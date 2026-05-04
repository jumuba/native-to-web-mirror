import { createClient } from "npm:@supabase/supabase-js";
import Stripe from "npm:stripe@17.5.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-11-20.acacia",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const PRICE_TO_PLAN: Record<string, string> = {
  price_1TTDPJRGCq8kXsN3GmpPDrGh: "basic",
  price_1TTDWGRGCq8kXsN3bKW16QNb: "medium",
  price_1TTDbARGCq8kXsN3B9AiSBcs: "premium",
};

async function getUserIdForCustomer(customerId: string) {
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return undefined;
  return customer.metadata?.user_id;
}

async function ensureUser(userId: string, customerId: string) {
  const customer = await stripe.customers.retrieve(customerId);
  const email = customer.deleted ? null : customer.email;

  await supabase.from("users").upsert(
    {
      id: userId,
      email,
      plan: "free",
    },
    { onConflict: "id" }
  );
}

async function upsertSub(sub: Stripe.Subscription, userId?: string) {
  const uid = userId
    ?? (sub.metadata?.user_id as string | undefined)
    ?? await getUserIdForCustomer(sub.customer as string);
  if (!uid) return;
  const priceId = sub.items.data[0]?.price.id;
  const plan = PRICE_TO_PLAN[priceId ?? ""] ?? "free";
  await ensureUser(uid, sub.customer as string);

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: uid,
      plan,
      status: sub.status,
      provider: "stripe",
      provider_customer_id: sub.customer as string,
      provider_subscription_id: sub.id,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;

  await supabase
    .from("users")
    .update({ plan })
    .eq("id", uid);
}

Deno.serve(async (req) => {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch (e) {
    return new Response(`Webhook Error: ${(e as Error).message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.subscription) {
          const sub = await stripe.subscriptions.retrieve(s.subscription as string);
          await upsertSub(
            sub,
            (s.metadata?.user_id as string | undefined) ?? (s.client_reference_id ?? undefined)
          );
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.trial_will_end": {
        await upsertSub(event.data.object as Stripe.Subscription);
        break;
      }
    }
  } catch (e) {
    console.error("handler error", e);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
