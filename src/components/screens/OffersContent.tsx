import React, { useEffect, useState } from "react";
import { Check, Crown, Star, Zap } from "lucide-react";
import { mockPricingPlans } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";
import { fetchSubscription } from "@/lib/supabaseService";
import { toast } from "@/hooks/use-toast";

export default function OffersContent() {
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [status, setStatus] = useState<string>("inactive");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const icons = { free: Star, basic: Star, medium: Zap, premium: Crown } as const;

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const sub = await fetchSubscription(auth.user.id);
      if (sub) {
        setCurrentPlan(sub.plan ?? "free");
        setStatus(sub.status ?? "inactive");
        setSelectedPlan(sub.plan ?? "free");
      }
    })();
  }, []);

  const handleUpgrade = async (plan: (typeof mockPricingPlans)[number]) => {
    if (!plan.priceId) return;
    try {
      setLoadingId(plan.id);
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: plan.priceId },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (e: any) {
      toast({ title: "Checkout failed", description: e.message ?? "Try again", variant: "destructive" });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ padding: "0 4px" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#394460", marginBottom: 10 }}>
        Offers & Plans {status !== "inactive" && <span style={{ fontSize: 9, color: "#1db954" }}>• {status}</span>}
      </p>

      {mockPricingPlans.map((plan) => {
        const Icon = icons[plan.id as keyof typeof icons] || Star;
        const isSelected = selectedPlan === plan.id;
        const isPremium = plan.id === "premium";
        const isCurrent = plan.id === currentPlan;

        return (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            style={{
              backgroundColor: isPremium ? "rgba(91,69,195,0.1)" : "rgba(255,255,255,0.8)",
              border: isSelected ? "2px solid #8fa9dd" : "1px solid rgba(214,223,241,0.9)",
              borderRadius: 10,
              padding: "10px 12px",
              marginBottom: 8,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
              <div className="flex items-center">
                <Icon size={14} color={isPremium ? "#8b5cf6" : "#8fa9dd"} style={{ marginRight: 6 }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: "#394460" }}>{plan.name}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: isPremium ? "#8b5cf6" : "#8fa9dd" }}>{plan.price}</span>
            </div>
            <div>
              {plan.features.map((f) => (
                <div key={f} className="flex items-center" style={{ marginBottom: 2 }}>
                  <Check size={8} color="#1db954" style={{ marginRight: 4 }} />
                  <span style={{ fontSize: 8.5, color: "#687287" }}>{f}</span>
                </div>
              ))}
            </div>
            {isCurrent && (
              <div style={{ marginTop: 6, fontSize: 8, color: "#1db954", fontWeight: 700, textAlign: "center" }}>
                ✓ Current Plan
              </div>
            )}
            {!isCurrent && isSelected && plan.priceId && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpgrade(plan);
                }}
                disabled={loadingId === plan.id}
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: "5px",
                  borderRadius: 6,
                  backgroundColor: isPremium ? "#8b5cf6" : "#8fa9dd",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  opacity: loadingId === plan.id ? 0.6 : 1,
                }}
              >
                {loadingId === plan.id ? "Loading..." : "Start 7-day free trial"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
