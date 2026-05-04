import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import bgSkyFloral from "@/assets/bg-sky-floral.png";

export default function StripeCancel() {
  useEffect(() => {
    toast({
      title: "Checkout canceled",
      description: "No payment was taken. You can try again anytime.",
      variant: "destructive",
    });
  }, []);

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
          <h1 style={{ fontSize: 22, color: "#5665c9", fontWeight: 500, margin: 0 }}>Checkout canceled</h1>
          <p style={{ fontSize: 12, color: "#394460", marginTop: 10 }}>No payment was taken. You can try again anytime.</p>
          <Link to="/" style={{ display: "inline-flex", marginTop: 18, height: 36, borderRadius: 6, backgroundColor: "#8fa9dd", color: "#fff", alignItems: "center", justifyContent: "center", padding: "0 14px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
            Back to SmartMemory
          </Link>
        </div>
      </div>
    </div>
  );
}
