import { createClient } from "npm:@supabase/supabase-js";
import Stripe from "npm:stripe@17.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRICE_TO_PLAN: Record<string, string> = {
  price_1TTDPJRGCq8kXsN3GmpPDrGh: "basic",
  price_1TTDWGRGCq8kXsN3bKW16QNb: "medium",
  price_1TTDbARGCq8kXsN3B9AiSBcs: "premium",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "sessionId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const userSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: userData, error: userErr } = await userSupabase.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-11-20.acacia",
    });
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    const sessionUserId = session.metadata?.user_id ?? session.client_reference_id;
    if (sessionUserId !== userData.user.id) {
      return new Response(JSON.stringify({ error: "Checkout session does not belong to this user" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subscription = session.subscription as Stripe.Subscription | null;
    if (!subscription) {
      return new Response(JSON.stringify({ error: "No subscription found for checkout session" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const priceId = subscription.items.data[0]?.price.id;
    const plan = PRICE_TO_PLAN[priceId ?? ""] ?? "free";
    const serviceSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await serviceSupabase.from("users").upsert(
      {
        id: userData.user.id,
        email: userData.user.email,
        display_name: userData.user.user_metadata?.display_name ?? userData.user.user_metadata?.name ?? null,
        plan: "free",
      },
      { onConflict: "id" }
    );

    const { error } = await serviceSupabase.from("subscriptions").upsert(
      {
        user_id: userData.user.id,
        plan,
        status: subscription.status,
        provider: "stripe",
        provider_customer_id: subscription.customer as string,
        provider_subscription_id: subscription.id,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (error) throw error;

    await serviceSupabase
      .from("users")
      .update({ plan })
      .eq("id", userData.user.id);

    return new Response(JSON.stringify({
      plan,
      status: subscription.status,
      subscriptionId: subscription.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
