// Supabase Edge Function: ask-to-aisha
// Configure GEMINI_API_KEY with: supabase secrets set GEMINI_API_KEY=...
// Never commit API keys. Deploy with: supabase functions deploy ask-to-aisha
const allowedOrigins = new Set(["https://pk1048030-glitch.github.io", "https://pk1030952-ship-it.github.io"]);
const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Vary": "Origin",
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
Education: BCA at IGNOU, T.P.S. College Study Centre, Patna (currently pursuing); ITI Electrician at AK ITI, Sasaram (currently pursuing); ADCA at Techinaut Institute of Technology was COMPLETED in April 2026 with A+ and 87% (do not describe ADCA as currently pursuing); Class 12 Science PCM + Biology at Shree Shankar College, Sasaram, BSEB was completed in March 2026 with 353/500, first division.
Skills: HTML, CSS, JavaScript, Tailwind CSS; VS Code, Android Studio, Spck Editor, Pydroid 3, GitHub Pages, Firebase, Google Analytics; Gemini API, Ollama Qwen 2.5 Coder 7B, Continue, FFmpeg, Auto-Editor; DaVinci Resolve, Motion Ninja, CapCut, VN Editor; practical PC and electronics experimentation, DroidCam; LibreOffice Writer/Calc. Do not claim specific owned PC components without confirmation.
Projects: Tuition Management Application with working-day attendance, holiday status, fee concessions and PDF receipts; interactive Sudoku solvers, dashboards and name-art generators; Alpha Art digital design project/YouTube channel for custom name art and logos; personal developer portfolio.
Experience: private home tutor creating Mathematics, English Grammar and Science lesson plans, worksheets and presentations for primary/middle-school learners; hardware/electronics experimentation; participation in Free Fire MAX Community Leader Program and community tournaments/mini-events in Rohtas.
Portfolio link: https://pk1048030-glitch.github.io/pk/
GitHub username: pk1048030-glitch
The owner's exact home village/post address is private and must never be disclosed. If asked for unpublished email/phone/social contact details, say they are not publicly provided yet.
`;

function verifiedPortfolioFallback(message: string): string {
  const q = message.toLowerCase();
  const hi = /[\u0900-\u097f]/.test(message) || /\b(kya|kab|hai|hain|batao|padha|padhai)\b/.test(q);
  if (/(address|home address|mobile|phone|email|contact|पता|फोन|नंबर|ईमेल)/.test(q)) {
    return hi
      ? "Pankaj की निजी संपर्क जानकारी और घर का पता सार्वजनिक नहीं हैं। आप पोर्टफोलियो के Contact Form से संदेश भेज सकते हैं।"
      : "Pankaj's private contact details and home address are not published. You can use the portfolio contact form.";
  }
  if (/(adca|advanced diploma|एडीसीए)/.test(q)) {
    return hi
      ? "हाँ, Pankaj ने Techinaut Institute of Technology से ADCA अप्रैल 2026 में पूरा किया था। उन्हें A+ और 87% अंक मिले थे।"
      : "Yes. Pankaj completed ADCA at Techinaut Institute of Technology in April 2026, earning an A+ grade with 87%.";
  }
  if (/(12th|class 12|intermediate|बारहवीं|12वीं)/.test(q)) {
    return hi
      ? "Pankaj ने मार्च 2026 में BSEB से कक्षा 12वीं (PCM और Biology) प्रथम श्रेणी में 353/500 अंकों के साथ पूरी की थी।"
      : "Pankaj completed BSEB Class 12 (PCM and Biology) in March 2026, first division, with 353/500 marks.";
  }
  if (/(bca|ignou|degree|college|बीसीए)/.test(q)) {
    return hi
      ? "Pankaj IGNOU से BCA कर रहे हैं। उनका अध्ययन केंद्र T.P.S. College, Patna है।"
      : "Pankaj is pursuing a BCA through IGNOU, with T.P.S. College, Patna as the study centre.";
  }
  if (/(iti|electrician|आईटीआई)/.test(q)) {
    return hi
      ? "Pankaj AK ITI, Sasaram में Electrician trade की पढ़ाई कर रहे हैं।"
      : "Pankaj is pursuing the Electrician trade at AK ITI, Sasaram.";
  }
  if (/(skill|technology|tech stack|coding|programming|कौशल|स्किल|कोडिंग)/.test(q)) {
    return hi
      ? "Pankaj के कौशल में HTML, CSS, JavaScript, Tailwind CSS, Python, वेब डेवलपमेंट, वीडियो एडिटिंग और इलेक्ट्रॉनिक्स से जुड़े प्रयोग शामिल हैं।"
      : "Pankaj works with HTML, CSS, JavaScript, Tailwind CSS, Python, web development, video editing and practical electronics projects.";
  }
  if (/(project|portfolio|application|app|प्रोजेक्ट|पोर्टफोलियो)/.test(q)) {
    return hi
      ? "उनके प्रोजेक्ट्स में Tuition Management Application, Interactive Web Tools, Alpha Art और PANKAJ JII personal portfolio शामिल हैं।"
      : "His projects include a Tuition Management Application, Interactive Web Tools, Alpha Art and the PANKAJ JII personal portfolio.";
  }
  if (/(pankaj|about|who|परिचय|कौन|पंकज)/.test(q)) {
    return hi
      ? "Pankaj Kumar, Sasaram (Bihar) के Student, Web Developer और Creative Creator हैं। उन्हें बचपन से इलेक्ट्रॉनिक्स और टेक्नोलॉजी में रुचि है।"
      : "Pankaj Kumar is a student, web developer and creative creator from Sasaram, Bihar, with a long-standing interest in electronics and technology.";
  }
  return hi
    ? "मैं फिलहाल PANKAJ JII पोर्टफोलियो की प्रमाणित जानकारी दे सकती हूँ। आप उनके प्रोजेक्ट्स, शिक्षा या कौशल के बारे में पूछ सकते हैं।"
    : "I can currently share verified PANKAJ JII portfolio facts. Ask about his projects, education or skills.";
}

const hits = new Map<string, number[]>();
function json(status: number, body: unknown, origin = "") {
  const headers: Record<string, string> = { ...corsHeaders };
  if (allowedOrigins.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return new Response(JSON.stringify(body), { status, headers });
}
Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  if (req.method === "OPTIONS") {
    if (!allowedOrigins.has(origin)) return new Response(null, { status: 403, headers: { "Vary": "Origin" } });
    return new Response("ok", { headers: { ...corsHeaders, "Access-Control-Allow-Origin": origin } });
  }
  if (req.method !== "POST") return json(405, { error: "Method not allowed" }, origin);
  if (!allowedOrigins.has(origin)) return json(403, { error: "Origin not allowed" });
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
  }).join("\n") : "";
  const input = history
    ? `Previous conversation:\n${history}\n\nVisitor: ${message}\nAisha:`
    : message;
  const preferredModels = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
  ];
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const retryableMessage = (message: string) =>
    /high demand|rate limit|too many requests|unavailable|temporar|overload|resource exhausted|quota/i.test(message);
  const deadline = Date.now() + 21000;

  let answer = "";
  let lastError = "";
  const attempts: { model: string; status: number | string; detail: string }[] = [];

  for (let index = 0; index < preferredModels.length; index++) {
    if (Date.now() >= deadline) break;
    const model = preferredModels[index];
    const remaining = deadline - Date.now();
    const attemptTimeout = Math.max(3000, Math.min(9000, remaining - 1000));
    if (attemptTimeout < 3000) break;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), attemptTimeout);

    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          model,
          store: false,
          system_instruction: profileContext,
          input,
          generation_config: { thinking_level: "low" },
        }),
      });

      const result = await response.json().catch(() => ({}));
      const providerMessage = String(result?.error?.message || "");

      if (!response.ok) {
        lastError = `${model}: ${providerMessage || `HTTP ${response.status}`}`;
        attempts.push({ model, status: response.status, detail: (providerMessage || `HTTP ${response.status}`).slice(0, 220) });

        const modelSpecificFailure =
          response.status === 400 || response.status === 404 ||
          /model|not supported|invalid_request|no longer available|does not support/i.test(providerMessage);
        const temporaryFailure =
          response.status === 429 || response.status === 503 || retryableMessage(providerMessage);

        if (!modelSpecificFailure && !temporaryFailure) {
          console.error("Non-retryable provider response", response.status, providerMessage);
          return json(200, { answer: verifiedPortfolioFallback(message), mode: "verified_fallback" }, origin);
        }
      } else {
        answer = Array.isArray(result?.steps)
          ? result.steps.filter((step: { type?: string }) => step.type === "model_output")
              .flatMap((step: { content?: { type?: string; text?: string }[] }) => step.content || [])
              .filter((part: { type?: string }) => part.type === "text")
              .map((part: { text?: string }) => part.text || "").join("").trim()
          : "";

        if (answer) {
          attempts.push({ model, status: response.status, detail: "success" });
          break;
        }
        lastError = `${model}: empty response`;
        attempts.push({ model, status: response.status, detail: "empty response" });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        lastError = `${model}: timed out after ${attemptTimeout}ms`;
        attempts.push({ model, status: "timeout", detail: `timed out after ${attemptTimeout}ms` });
      } else {
        lastError = `${model}: ${String(error)}`;
        attempts.push({ model, status: "network_error", detail: String(error).slice(0, 220) });
      }
    } finally {
      clearTimeout(timeout);
    }

    if (index < preferredModels.length - 1 && Date.now() + 700 < deadline) await sleep(700);
  }

  if (!answer) {
    console.error("All Gemini fallback models failed:", lastError, attempts);
    return json(200, { answer: verifiedPortfolioFallback(message), mode: "verified_fallback" }, origin);
  }
  return json(200, { answer }, origin);
});
