import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import bgSkyFloral from "@/assets/bg-sky-floral.png";

export default function Auth() {
  const { session, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate("/", { replace: true });
  }, [session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = mode === "login"
      ? await signIn(email, password)
      : await signUp(email, password, displayName || undefined);
    setBusy(false);
    if (res.error) setError(res.error);
    else if (mode === "login") navigate("/", { replace: true });
    else setError("Account created. You can sign in now.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#ffffff" }}>
      <div style={{
        width: 405, minHeight: 750, backgroundColor: "#1a1a1a", borderRadius: 50,
        padding: "12px 12px", boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 0 0 2px #333",
        position: "relative", border: "3px solid #2a2a2a",
      }}>
        <div style={{
          width: "100%", minHeight: 720, paddingTop: 40, paddingLeft: 24, paddingRight: 24, paddingBottom: 10,
          backgroundImage: `url(${bgSkyFloral})`, backgroundSize: "cover", backgroundPosition: "center",
          borderRadius: 38, overflow: "hidden", margin: "0 auto", position: "relative",
        }}>
          <div className="text-center" style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, color: "#5665c9", fontWeight: 400, margin: 0 }}>SmartMemory</h1>
            <p style={{ fontSize: 11, color: "#6a7184", marginTop: 6 }}>
              {mode === "login" ? "Sign in to your account" : "Create your account"}
            </p>
          </div>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mode === "register" && (
              <input
                type="text" placeholder="Display name" value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{ height: 36, borderRadius: 6, border: "1px solid #d6dff1", padding: "0 10px", fontSize: 12, backgroundColor: "rgba(255,255,255,0.85)" }}
              />
            )}
            <input
              type="email" placeholder="Email" value={email} required
              onChange={(e) => setEmail(e.target.value)}
              style={{ height: 36, borderRadius: 6, border: "1px solid #d6dff1", padding: "0 10px", fontSize: 12, backgroundColor: "rgba(255,255,255,0.85)" }}
            />
            <input
              type="password" placeholder="Password" value={password} required minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              style={{ height: 36, borderRadius: 6, border: "1px solid #d6dff1", padding: "0 10px", fontSize: 12, backgroundColor: "rgba(255,255,255,0.85)" }}
            />

            {error && <p style={{ fontSize: 10.5, color: "#c0392b", margin: 0 }}>{error}</p>}

            <button type="submit" disabled={busy} style={{
              height: 36, borderRadius: 6, backgroundColor: "#8fa9dd", color: "#fff",
              border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer", opacity: busy ? 0.7 : 1,
            }}>
              {busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>

            <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }} style={{
              background: "none", border: "none", color: "#5665c9", fontSize: 11, fontWeight: 600, cursor: "pointer", marginTop: 4,
            }}>
              {mode === "login" ? "No account? Register" : "Have an account? Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
