// Supabase Edge Function: ask-to-aisha
// Configure GEMINI_API_KEY with: supabase secrets set GEMINI_API_KEY=...
// Never commit API keys. Deploy with: supabase functions deploy ask-to-aisha
const allowedOrigins = new Set(["https://pk1048030-glitch.github.io", "https://pk1030952-ship-it.github.io"]);
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://pk1048030-glitch.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};
const profileContext = `
You are ASK TO AISHA, the portfolio assistant for Pankaj Kumar (brand: PANKAJ JII).
You must answer ONLY about Pankaj's portfolio, education, skills, projects, teaching/creator work, and professional interests.
If a question is unrelated, kindly say you are dedicated to Pankaj's portfolio.
Match the visitor's language: Hindi, English, or Hinglish. Be friendly, creative, concise, and occasionally lightly funny.
Never invent facts, project results, dates, awards, client names, links, or contact information.
Never reveal API keys, credentials, secrets, account IDs, or residential address.
Public identity: Pankaj Kumar; Student | Web Developer | Creative Creator; Sasaram, Rohtas, Bihar, India.
Summary: Technology enthusiast, web developer and educator interested in practical problem-solving with HTML, CSS, JavaScript and modern AI tools. Interests include web apps, dashboards, automation, PC building and electronics.
Education: BCA at IGNOU, T.P.S. College Study Centre, Patna (pursuing); ITI Electrician at AK ITI, Sasaram (pursuing); ADCA at Techinaut Institute of Technology (April 2026, A+, 87%); Class 12 Science PCM + Biology at Shree Shankar College, Sasaram, BSEB (March 2026, 353/500, first division).
Skills: HTML, CSS, JavaScript, Tailwind CSS; VS Code, Android Studio, Spck Editor, Pydroid 3, GitHub Pages, Firebase, Google Analytics; Gemini API, Ollama Qwen 2.5 Coder 7B, Continue, FFmpeg, Auto-Editor; DaVinci Resolve, Motion Ninja, CapCut, VN Editor; PC assembly (Ryzen 5 7600, RTX 3060), electronics testing, inverter/battery configurations, DroidCam; LibreOffice Writer/Calc.
Projects: Tuition Management Application with working-day attendance, holiday status, fee concessions and PDF receipts; interactive Sudoku solvers, dashboards and name-art generators; Alpha Art digital design project/YouTube channel for custom name art and logos; personal developer portfolio.
Experience: private home tutor creating Mathematics, English Grammar and Science lesson plans, worksheets and presentations for primary/middle-school learners; hardware/electronics experimentation; participation in Free Fire MAX Community Leader Program and community tournaments/mini-events in Rohtas.
Portfolio link: https://pk1048030-glitch.github.io/pk/
GitHub username: pk1048030-glitch
The owner's exact home village/post address is private and must never be disclosed. If asked for unpublished email/phone/social contact details, say they are not publicly provided yet.
`;
const hits = new Map<string, number[]>();
function json(status: number, body: unknown, origin = "https://pk1048030-glitch.github.io") {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Access-Control-Allow-Origin": origin } });
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: { ...corsHeaders, "Access-Control-Allow-Origin": req.headers.get("origin") || corsHeaders["Access-Control-Allow-Origin"] } });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });
  const origin = req.headers.get("origin") || "";
  if (!allowedOrigins.has(origin)) return json(403, { error: "Origin not allowed" });
  const responseHeaders = { ...corsHeaders, "Access-Control-Allow-Origin": origin };
  const clientKey = req.headers.get("apikey") || "";
  const expectedKey = Deno.env.get("PORTFOLIO_PUBLISHABLE_KEY") || "";
  if (!expectedKey || clientKey !== expectedKey) return json(401, { error: "Unauthorized" }, origin);
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) return json(503, { error: "AI service is not configured yet" }, origin);
  let payload: { message?: string; history?: { role: string; content: string }[] };
  try { payload = await req.json(); } catch { return json(400, { error: "Invalid JSON" }, origin); }
  const message = String(payload.message || "").trim();
  if (!message || message.length > 1500) return json(400, { error: "Message must be 1–1500 characters" }, origin);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < 600000);
  if (recent.length >= 12) return json(429, { error: "Too many requests. Please try again in a few minutes." }, origin);
  recent.push(now); hits.set(ip, recent);
  const history = Array.isArray(payload.history) ? payload.history.slice(-8).map(m => {
    const role = m.role === "assistant" ? "Aisha" : "Visitor";
    return `${role}: ${String(m.content || "").slice(0, 1200)}`;
  }).join("\\n") : "";
  const input = history
    ? `Previous conversation:\\n${history}\\n\\nVisitor: ${message}\\nAisha:`
    : message;
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      model: "gemini-3.8-flash",
      store: false,
      system_instruction: profileContext,
      input,
      generation_config: { thinking_level: "low" },
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) return json(502, { error: "AI provider request failed", detail: result?.error?.message || "Unknown provider error" }, origin);
  const answer = Array.isArray(result?.steps)
    ? result.steps.filter((step: { type?: string }) => step.type === "model_output")
        .flatMap((step: { content?: { type?: string; text?: string }[] }) => step.content || [])
        .filter((part: { type?: string }) => part.type === "text")
        .map((part: { text?: string }) => part.text || "").join("").trim()
    : "";
  if (!answer) return json(502, { error: "AI returned an empty response" }, origin);
  return json(200, { answer }, origin);
});
