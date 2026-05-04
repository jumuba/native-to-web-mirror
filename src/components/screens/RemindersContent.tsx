import React, { useEffect, useState } from "react";
import { Plus, Bell, Trash2, Link as LinkIcon, Calendar } from "lucide-react";
import { mockReminders, type Reminder } from "@/lib/mockData";
import {
  fetchReminders,
  insertReminder,
  deleteReminderRow,
} from "@/lib/supabaseService";

export default function RemindersContent() {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchReminders()
      .then((rows) => {
        if (rows && rows.length) setReminders(rows);
      })
      .catch(() => {});
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    const tempId = `r-${Date.now()}`;
    const draft: Reminder = {
      id: tempId,
      title: newTitle,
      date: newDate || "2026-12-31",
      message: newMessage,
      linkedTo: null,
      linkedType: null,
    };
    setReminders((prev) => [...prev, draft]);
    setNewTitle("");
    setNewDate("");
    setNewMessage("");
    setCreating(false);
    try {
      const saved = await insertReminder(draft);
      if (saved) {
        setReminders((prev) =>
          prev.map((r) =>
            r.id === tempId
              ? {
                  id: saved.id,
                  title: saved.title,
                  date: saved.remind_at ?? "",
                  message: saved.message ?? "",
                  linkedTo: saved.linked_to ?? null,
                  linkedType: (saved.linked_type as "album" | "folder" | null) ?? null,
                }
              : r
          )
        );
      }
    } catch {}
  };

  const handleDelete = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
    if (/^[0-9a-f-]{36}$/i.test(id)) deleteReminderRow(id).catch(() => {});
  };

  return (
    <div style={{ padding: "0 4px" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#394460", margin: 0 }}>Reminders</p>
        <button
          onClick={() => setCreating(!creating)}
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            backgroundColor: "#8fa9dd",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Plus size={12} color="#fff" />
        </button>
      </div>

      {creating && (
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(214,223,241,0.9)",
            borderRadius: 8,
            padding: 8,
            marginBottom: 8,
          }}
        >
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Reminder title..."
            style={{ width: "100%", fontSize: 10, border: "1px solid #dde3f0", borderRadius: 4, padding: "4px 6px", marginBottom: 4, outline: "none" }}
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            style={{ width: "100%", fontSize: 10, border: "1px solid #dde3f0", borderRadius: 4, padding: "4px 6px", marginBottom: 4, outline: "none" }}
          />
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message..."
            style={{ width: "100%", fontSize: 10, border: "1px solid #dde3f0", borderRadius: 4, padding: "4px 6px", marginBottom: 6, outline: "none" }}
          />
          <button
            onClick={handleCreate}
            style={{ width: "100%", padding: "4px", borderRadius: 4, backgroundColor: "#8fa9dd", color: "#fff", fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            Create Reminder
          </button>
        </div>
      )}

      {reminders.length === 0 ? (
        <div className="flex flex-col items-center" style={{ padding: "30px 0" }}>
          <Bell size={28} color="#c0c8d8" style={{ marginBottom: 8 }} />
          <span style={{ fontSize: 11, color: "#8fa9dd", fontWeight: 600 }}>No reminders yet</span>
          <span style={{ fontSize: 9, color: "#a0a8b8" }}>Tap + to create one</span>
        </div>
      ) : (
        reminders.map((r) => (
          <div
            key={r.id}
            style={{
              backgroundColor: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(214,223,241,0.9)",
              borderRadius: 8,
              padding: "8px 10px",
              marginBottom: 6,
            }}
          >
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#394460" }}>{r.title}</span>
              <button onClick={() => handleDelete(r.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                <Trash2 size={10} color="#ef4444" />
              </button>
            </div>
            <div className="flex items-center" style={{ marginTop: 3, gap: 6 }}>
              <Calendar size={8} color="#8fa9dd" />
              <span style={{ fontSize: 8.5, color: "#687287" }}>{r.date}</span>
            </div>
            {r.message && <p style={{ fontSize: 8.5, color: "#8fa9dd", margin: "3px 0 0" }}>{r.message}</p>}
            {r.linkedTo && (
              <div className="flex items-center" style={{ marginTop: 3 }}>
                <LinkIcon size={8} color="#8b5cf6" style={{ marginRight: 3 }} />
                <span style={{ fontSize: 8, color: "#8b5cf6" }}>Linked to {r.linkedType}</span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
