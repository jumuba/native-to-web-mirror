import { createClient } from "npm:@supabase/supabase-js";
import Stripe from "npm:stripe@17.5.0";

const FIRST_ADMIN_EMAIL = "smartmemoryapp@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function countRows(supabase: ReturnType<typeof createClient>, table: string, filter?: (query: any) => any) {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) query = filter(query);
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

async function safeCountRows(supabase: ReturnType<typeof createClient>, table: string, filter?: (query: any) => any) {
  try {
    return await countRows(supabase, table, filter);
  } catch (e) {
    console.warn(`Could not count ${table}`, (e as Error).message);
    return 0;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const userSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: userData, error: userError } = await userSupabase.auth.getUser();
    if (userError || !userData.user) return jsonResponse({ error: "Unauthorized" }, 401);

    const serviceSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const email = userData.user.email?.toLowerCase() ?? "";
    const { data: profile } = await serviceSupabase
      .from("users")
      .select("*")
      .or(`id.eq.${userData.user.id},email.eq.${email}`)
      .maybeSingle();

    const isAdmin = email === FIRST_ADMIN_EMAIL || profile?.is_admin === true || profile?.role === "admin";
    if (!isAdmin) return jsonResponse({ error: "Access denied" });

    if (email === FIRST_ADMIN_EMAIL && profile && !profile?.is_admin) {
      const { error: adminUpdateError } = await serviceSupabase
        .from("users")
        .update({ role: "admin", is_admin: true })
        .eq("id", profile.id);

      if (adminUpdateError) {
        console.warn("Could not persist admin flags. Run the admin role migration.", adminUpdateError.message);
      }
    }

    const [
      totalUsers,
      totalAlbums,
      totalPhotos,
      totalReminders,
      totalSubscriptions,
      activeSubscriptions,
      trialUsers,
      canceledSubscriptions,
      recentUsers,
      recentSubscriptions,
    ] = await Promise.all([
      safeCountRows(serviceSupabase, "users"),
      safeCountRows(serviceSupabase, "albums"),
      safeCountRows(serviceSupabase, "photos"),
      safeCountRows(serviceSupabase, "reminders"),
      safeCountRows(serviceSupabase, "subscriptions"),
      safeCountRows(serviceSupabase, "subscriptions", (query) => query.eq("status", "active")),
      safeCountRows(serviceSupabase, "subscriptions", (query) => query.eq("status", "trialing")),
      safeCountRows(serviceSupabase, "subscriptions", (query) => query.in("status", ["canceled", "cancelled"])),
      serviceSupabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8),
      serviceSupabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    const stripePayments: unknown[] = [];
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (stripeKey) {
      try {
        const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });
        const payments = await stripe.paymentIntents.list({ limit: 8 });
        stripePayments.push(...payments.data.map((payment) => ({
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          customer: typeof payment.customer === "string" ? payment.customer : payment.customer?.id ?? null,
          created: new Date(payment.created * 1000).toISOString(),
        })));
      } catch (e) {
        console.warn("Could not load Stripe payments", (e as Error).message);
      }
    }

    const { data: buckets } = await serviceSupabase.storage.listBuckets().catch((e) => {
      console.warn("Could not list storage buckets", (e as Error).message);
      return { data: [] };
    });

    return jsonResponse({
      stats: {
        totalUsers,
        totalAlbums,
        totalPhotos,
        totalReminders,
        totalSubscriptions,
        activeSubscriptions,
        trialUsers,
        canceledSubscriptions,
        storageBuckets: buckets?.length ?? 0,
        storagePhotoCount: totalPhotos,
      },
      recentUsers: recentUsers.data ?? [],
      recentSubscriptions: recentSubscriptions.data ?? [],
      recentStripePayments: stripePayments,
    });
  } catch (e) {
    console.error(e);
    return jsonResponse({ error: (e as Error).message }, 500);
  }
});
