import { createClient } from "npm:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PhotoRow = {
  id: string;
  album_id: string | null;
  title: string | null;
  event: string | null;
  place: string | null;
  taken_at: string | null;
  url: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function parseJsonObject(text: string) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

function matchesQuery(photo: PhotoRow, query: string) {
  const haystack = [
    photo.title,
    photo.event,
    photo.place,
    photo.taken_at,
  ].filter(Boolean).join(" ").toLowerCase();
  return query.toLowerCase().split(/\s+/).filter(Boolean).some((word) => haystack.includes(word));
}

async function callGemini(prompt: string) {
  const apiKey = Deno.env.get("AI_API_KEY");
  if (!apiKey) throw new Error("AI_API_KEY is not configured");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.35, maxOutputTokens: 512 },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI request failed: ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return jsonResponse({ error: "Unauthorized" }, 401);

    const { action, query, context } = await req.json();

    if (action === "suggest-album-title") {
      const prompt = `
You are helping name a SmartMemory photo album.
Return JSON only: {"titles":["short title 1","short title 2","short title 3"]}
Keep titles warm, simple, and under 40 characters.
Use this private user context:
${JSON.stringify(context ?? {}).slice(0, 8000)}
`;
      const text = await callGemini(prompt);
      const parsed = parseJsonObject(text);
      const titles = Array.isArray(parsed?.titles)
        ? parsed.titles.filter((title: unknown) => typeof title === "string").slice(0, 3)
        : [];
      return jsonResponse({ titles });
    }

    if (action === "search-photos") {
      if (!query || typeof query !== "string") return jsonResponse({ error: "query required" }, 400);

      const { data: photos, error } = await supabase
        .from("photos")
        .select("id, album_id, title, event, place, taken_at, url")
        .eq("user_id", userData.user.id)
        .limit(100);
      if (error) throw error;

      const prompt = `
You help search a user's own SmartMemory photos.
Return JSON only: {"keywords":["keyword1","keyword2"],"ids":["photo-id-if-clearly-relevant"]}
User search: ${query}
Photos:
${JSON.stringify(photos ?? []).slice(0, 10000)}
`;
      const text = await callGemini(prompt);
      const parsed = parseJsonObject(text);
      const ids = new Set(Array.isArray(parsed?.ids) ? parsed.ids : []);
      const keywords = Array.isArray(parsed?.keywords) ? parsed.keywords.filter((k: unknown) => typeof k === "string") : [];
      const keywordQuery = [query, ...keywords].join(" ");
      const results = (photos ?? [])
        .filter((photo: PhotoRow) => ids.has(photo.id) || matchesQuery(photo, keywordQuery))
        .slice(0, 24);

      return jsonResponse({ results, keywords });
    }

    return jsonResponse({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error(e);
    return jsonResponse({ error: (e as Error).message }, 500);
  }
});
