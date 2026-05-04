import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { fetchSubscription } from "@/lib/supabaseService";
import { supabase } from "@/integrations/supabase/client";
import bgSkyFloral from "@/assets/bg-sky-floral.png";

export default function StripeSuccess() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Your payment/trial has started.");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const sessionId = searchParams.get("session_id");

    const showSubscription = (plan: string, status: string, trialEnd?: string | null) => {
      const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
      const date = trialEnd ? new Date(trialEnd).toLocaleDateString() : null;
      const text = status === "trialing"
        ? `Your ${planName} free trial has started${date ? ` until ${date}` : ""}.`
        : `Your ${planName} subscription is ${status}.`;

      setMessage(text);
      toast({ title: text });
    };

    if (sessionId) {
      supabase.functions.invoke("verify-checkout", {
        body: { sessionId },
      }).then(({ data, error: invokeError }) => {
        if (invokeError) throw invokeError;
        if (data?.error) throw new Error(data.error);
        showSubscription(data.plan, data.status, data.trialEnd);
      }).catch((e) => {
        const fallback = "Your checkout completed, but we could not verify the subscription yet.";
        setError(e.message ?? fallback);
        toast({ title: fallback, description: e.message, variant: "destructive" });
      });
      return;
    }

    let attempts = 0;
    const loadSubscription = async () => {
      attempts += 1;
      const sub = await fetchSubscription(user.id);
      if (sub?.plan) {
        showSubscription(sub.plan, sub.status);
        return;
      }
      if (attempts < 5) window.setTimeout(loadSubscription, 1500);
    };

    loadSubscription().catch(() => {});
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#ffffff" }}>
      <div style={{
        width: 405, minHeight: 750, backgroundColor: "#1a1a1a", borderRadius: 50,
        padding: "12px 12px", boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 0 0 2px #333",
        position: "relative", border: "3px solid #2a2a2a",
      }}>
        <div style={{
          width: "100%", minHeight: 720, paddingTop: 80, paddingLeft: 24, paddingRight: 24, paddingBottom: 10,
          backgroundImage: `url(${bgSkyFloral})`, backgroundSize: "cover", backgroundPosition: "center",
          borderRadius: 38, overflow: "hidden", margin: "0 auto", position: "relative",
        }}>
          <h1 style={{ fontSize: 22, color: "#5665c9", fontWeight: 500, margin: 0 }}>Subscription started</h1>
          <p style={{ fontSize: 12, color: "#394460", marginTop: 10 }}>{message}</p>
          {error && <p style={{ fontSize: 10.5, color: "#c0392b", marginTop: 8 }}>{error}</p>}
          <Link to="/" style={{ display: "inline-flex", marginTop: 18, height: 36, borderRadius: 6, backgroundColor: "#8fa9dd", color: "#fff", alignItems: "center", justifyContent: "center", padding: "0 14px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
            Back to SmartMemory
          </Link>
        </div>
      </div>
    </div>
  );
}
