import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/AuthContext";

type AdminStats = {
  totalUsers: number;
  totalAlbums: number;
  totalPhotos: number;
  totalReminders: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialUsers: number;
  canceledSubscriptions: number;
  storageBuckets: number;
  storagePhotoCount: number;
};

type RecentUser = {
  id: string;
  email: string | null;
  display_name: string | null;
  plan: string | null;
  role?: string | null;
  is_admin?: boolean | null;
  created_at: string;
};

type RecentSubscription = {
  id: string;
  user_id: string | null;
  plan: string | null;
  status: string | null;
  current_period_end: string | null;
  created_at: string;
  provider_subscription_id?: string | null;
  stripe_subscription_id?: string | null;
};

type StripePayment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customer: string | null;
  created: string;
};

type AdminData = {
  stats: AdminStats;
  recentUsers: RecentUser[];
  recentSubscriptions: RecentSubscription[];
  recentStripePayments: StripePayment[];
};

const statLabels: Array<[keyof AdminStats, string]> = [
  ["totalUsers", "Total users"],
  ["totalAlbums", "Total albums"],
  ["totalPhotos", "Total photos"],
  ["totalReminders", "Total reminders"],
  ["totalSubscriptions", "Total subscriptions"],
  ["activeSubscriptions", "Active subscriptions"],
  ["trialUsers", "Trial users"],
  ["canceledSubscriptions", "Canceled subscriptions"],
  ["storagePhotoCount", "Storage/photo count"],
  ["storageBuckets", "Storage buckets"],
];

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function formatAmount(payment: StripePayment) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: payment.currency.toUpperCase(),
  }).format(payment.amount / 100);
}

export default function Admin() {
  const { session, loading } = useAuth();
  const [data, setData] = useState<AdminData | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!session) return;

    setBusy(true);
    setError(null);
    setAccessDenied(false);
    supabase.functions.invoke("admin-dashboard")
      .then(({ data: response, error: invokeError }) => {
        if (invokeError) throw new Error(invokeError.message || "Admin function failed");
        if (response?.error) {
          if (response.error === "Access denied") setAccessDenied(true);
          throw new Error(response.error);
        }
        setData(response as AdminData);
      })
      .catch((e) => {
        setError(e.message ?? "Unable to load admin dashboard");
      })
      .finally(() => setBusy(false));
  }, [session]);

  if (loading) return null;
  if (!session) return <Navigate to="/auth" replace />;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f6f8fb", color: "#253047", padding: 24 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <h1 style={{ fontSize: 26, margin: 0, color: "#394460" }}>SmartMemory Admin</h1>
            <p style={{ fontSize: 13, color: "#687287", margin: "4px 0 0" }}>Private operational dashboard</p>
            <p style={{ fontSize: 12, color: "#8fa9dd", margin: "4px 0 0" }}>Signed in as {session.user.email}</p>
          </div>
          <a href="/" style={{ color: "#5665c9", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Back to app</a>
        </div>

        {busy && <p style={{ fontSize: 14, color: "#687287" }}>Loading admin data...</p>}
        {accessDenied && (
          <div style={{ backgroundColor: "#fff3f3", border: "1px solid #fecaca", borderRadius: 8, padding: 14 }}>
            <strong style={{ color: "#c0392b" }}>Access denied</strong>
            <p style={{ color: "#687287", margin: "6px 0 0" }}>This account is not allowed to view the admin dashboard.</p>
          </div>
        )}
        {!accessDenied && error && (
          <div style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: 14, color: "#9a3412" }}>
            {error}
          </div>
        )}

        {data && !accessDenied && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 18 }}>
              {statLabels.map(([key, label]) => (
                <div key={key} style={{ backgroundColor: "#fff", border: "1px solid #dde3f0", borderRadius: 8, padding: 14 }}>
                  <p style={{ fontSize: 12, color: "#687287", margin: 0 }}>{label}</p>
                  <strong style={{ display: "block", fontSize: 26, color: "#394460", marginTop: 5 }}>{data.stats[key]}</strong>
                </div>
              ))}
            </div>

            <section style={{ backgroundColor: "#fff", border: "1px solid #dde3f0", borderRadius: 8, padding: 14, marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, color: "#394460", margin: "0 0 10px" }}>Recent users</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr><th align="left">Email</th><th align="left">Name</th><th align="left">Plan</th><th align="left">Role</th><th align="left">Created</th></tr></thead>
                  <tbody>
                    {data.recentUsers.map((user) => (
                      <tr key={user.id} style={{ borderTop: "1px solid #edf1f7" }}>
                        <td style={{ padding: "8px 4px" }}>{user.email ?? "-"}</td>
                        <td>{user.display_name ?? "-"}</td>
                        <td>{user.plan ?? "-"}</td>
                        <td>{user.is_admin ? "admin" : user.role ?? "user"}</td>
                        <td>{formatDate(user.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section style={{ backgroundColor: "#fff", border: "1px solid #dde3f0", borderRadius: 8, padding: 14, marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, color: "#394460", margin: "0 0 10px" }}>Recent subscriptions</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr><th align="left">Plan</th><th align="left">Status</th><th align="left">User ID</th><th align="left">Stripe sub</th><th align="left">Period end</th></tr></thead>
                  <tbody>
                    {data.recentSubscriptions.map((sub) => (
                      <tr key={sub.id} style={{ borderTop: "1px solid #edf1f7" }}>
                        <td style={{ padding: "8px 4px" }}>{sub.plan ?? "-"}</td>
                        <td>{sub.status ?? "-"}</td>
                        <td>{sub.user_id ?? "-"}</td>
                        <td>{sub.provider_subscription_id ?? sub.stripe_subscription_id ?? "-"}</td>
                        <td>{formatDate(sub.current_period_end)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section style={{ backgroundColor: "#fff", border: "1px solid #dde3f0", borderRadius: 8, padding: 14 }}>
              <h2 style={{ fontSize: 16, color: "#394460", margin: "0 0 10px" }}>Recent Stripe payments</h2>
              {data.recentStripePayments.length === 0 ? (
                <p style={{ color: "#687287", fontSize: 13 }}>No recent Stripe payments found. Trials may not create payments yet.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead><tr><th align="left">Payment</th><th align="left">Amount</th><th align="left">Status</th><th align="left">Customer</th><th align="left">Created</th></tr></thead>
                    <tbody>
                      {data.recentStripePayments.map((payment) => (
                        <tr key={payment.id} style={{ borderTop: "1px solid #edf1f7" }}>
                          <td style={{ padding: "8px 4px" }}>{payment.id}</td>
                          <td>{formatAmount(payment)}</td>
                          <td>{payment.status}</td>
                          <td>{payment.customer ?? "-"}</td>
                          <td>{formatDate(payment.created)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
