import React, { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle, BookOpen, HelpCircle } from "lucide-react";
import { mockFAQ } from "@/lib/mockData";

export default function HelpContent() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [contactSent, setContactSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleContact = () => {
    if (!message.trim()) return;
    setContactSent(true);
    setMessage("");
    setTimeout(() => setContactSent(false), 2000);
  };

  return (
    <div style={{ padding: "0 4px" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#394460", marginBottom: 10 }}>Help & Support</p>

      {/* FAQ */}
      <div style={{ marginBottom: 10 }}>
        <div className="flex items-center" style={{ marginBottom: 6 }}>
          <HelpCircle size={11} color="#8fa9dd" style={{ marginRight: 4 }} />
          <span style={{ fontSize: 10, color: "#687287", fontWeight: 700 }}>FAQ</span>
        </div>
        {mockFAQ.map((faq, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(214,223,241,0.9)",
              borderRadius: 8,
              marginBottom: 4,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
              className="flex items-center justify-between"
              style={{ width: "100%", padding: "7px 10px", background: "none", border: "none", cursor: "pointer" }}
            >
              <span style={{ fontSize: 9, color: "#394460", fontWeight: 600, textAlign: "left" }}>{faq.question}</span>
              {openFAQ === i ? <ChevronUp size={10} color="#687287" /> : <ChevronDown size={10} color="#687287" />}
            </button>
            {openFAQ === i && (
              <div style={{ padding: "0 10px 8px", fontSize: 8.5, color: "#687287", lineHeight: "12px" }}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact */}
      <div style={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid rgba(214,223,241,0.9)", borderRadius: 10, padding: "10px", marginBottom: 10 }}>
        <div className="flex items-center" style={{ marginBottom: 6 }}>
          <MessageCircle size={11} color="#8fa9dd" style={{ marginRight: 4 }} />
          <span style={{ fontSize: 10, color: "#687287", fontWeight: 700 }}>Contact Support</span>
        </div>
        {contactSent ? (
          <span style={{ fontSize: 10, color: "#1db954", fontWeight: 600 }}>✓ Message sent! We'll get back to you.</span>
        ) : (
          <>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue..."
              style={{ width: "100%", fontSize: 9, border: "1px solid #dde3f0", borderRadius: 4, padding: "4px 6px", outline: "none", minHeight: 40, resize: "none" }}
            />
            <button
              onClick={handleContact}
              style={{ width: "100%", marginTop: 4, padding: "4px", borderRadius: 4, backgroundColor: "#8fa9dd", color: "#fff", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}
            >
              Send Message
            </button>
          </>
        )}
      </div>

      {/* Tutorials */}
      <div style={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid rgba(214,223,241,0.9)", borderRadius: 10, padding: "10px" }}>
        <div className="flex items-center" style={{ marginBottom: 6 }}>
          <BookOpen size={11} color="#8fa9dd" style={{ marginRight: 4 }} />
          <span style={{ fontSize: 10, color: "#687287", fontWeight: 700 }}>Tutorials</span>
        </div>
        {["Getting Started", "Creating Albums", "Sharing Memories", "Using AI Tools"].map((t) => (
          <div
            key={t}
            className="flex items-center"
            style={{ padding: "5px 0", borderBottom: "1px solid rgba(214,223,241,0.3)", cursor: "pointer" }}
          >
            <span style={{ fontSize: 9, color: "#8fa9dd", fontWeight: 600 }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
