import { createFileRoute } from "@tanstack/react-router";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";

const SYSTEM = `You are SWIFTLY Copilot, the AI assistant for Bengaluru Traffic Police command center.
You answer questions about traffic congestion forecasting, event impact, officer deployment,
barricading and diversion strategy.

Style: concise, decisive, operational. 2–5 sentences max. Use bullet points only when listing
officers / barricades / corridors. Never invent numbers — anchor recommendations to the
LIVE CONTEXT you are given. If the user asks something outside traffic operations, politely
redirect to traffic, events, corridors or deployment topics.`;

export const Route = createFileRoute("/api/copilot")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return Response.json(
            { answer: "Copilot not configured: LOVABLE_API_KEY missing." },
            { status: 500 },
          );
        }
        let body: { question?: string; context?: unknown };
        try {
          body = await request.json();
        } catch {
          return Response.json({ answer: "Invalid request body." }, { status: 400 });
        }
        const question = (body.question || "").toString().trim();
        const context =
          typeof body.context === "string"
            ? body.context
            : body.context != null
              ? JSON.stringify(body.context).slice(0, 6000)
              : "";
        if (!question) {
          return Response.json({ answer: "Please ask a question." }, { status: 400 });
        }


        const gateway = createOpenAICompatible({
          name: "lovable",
          baseURL: "https://ai.gateway.lovable.dev/v1",
          headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
        });

        try {
          const { text } = await generateText({
            model: gateway("google/gemini-3-flash-preview"),
            system: SYSTEM,
            prompt: `LIVE CONTEXT:\n${context}\n\nCOMMANDER QUESTION:\n${question}`,
          });
          return Response.json({ answer: text });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          const status = /429/.test(msg)
            ? 429
            : /402/.test(msg)
              ? 402
              : 500;
          const friendly =
            status === 429
              ? "Copilot is rate-limited. Please try again in a moment."
              : status === 402
                ? "Copilot credits exhausted — please add credits in workspace billing."
                : `Copilot error: ${msg.slice(0, 200)}`;
          return Response.json({ answer: friendly }, { status });
        }
      },
    },
  },
});
