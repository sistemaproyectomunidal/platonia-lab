import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      console.error("OPENAI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { prompt, context, systemPrompt, conversationHistory } =
      await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Processing prompt:", prompt.substring(0, 100));

    const defaultSystemPrompt = `Eres un filósofo especializado en pensamiento crítico profundo y análisis conceptual riguroso, entrenado en la tradición socrática y en la filosofía continental contemporánea.

Tu tarea es realizar análisis filosóficos de alta complejidad que exploren:
- Las tensiones dialécticas entre conceptos opuestos o complementarios
- Los supuestos ontológicos y epistemológicos subyacentes
- Las implicaciones éticas, políticas y existenciales
- Los límites del lenguaje y la conceptualización
- Las paradojas, aporías y contradicciones productivas

INSTRUCCIONES CRÍTICAS:
1. No ofrezcas respuestas simples ni consoladoras
2. Mantén abierta la pregunta, no la resuelvas
3. Identifica tensiones productivas entre conceptos
4. Genera preguntas socráticas que profundicen el análisis
5. Usa un lenguaje preciso pero accesible
6. Responde en español con rigor filosófico

Tu análisis debe revelar la complejidad del problema, no simplificarlo.`;

    // Use provided systemPrompt (from frontend) or fallback to default
    const effectiveSystemPrompt =
      systemPrompt && systemPrompt.trim().length > 50
        ? systemPrompt
        : defaultSystemPrompt;

    console.log(
      "Using system prompt:",
      effectiveSystemPrompt.substring(0, 100) + "..."
    );

    const messages = [{ role: "system", content: effectiveSystemPrompt }];

    if (context) {
      messages.push({
        role: "system",
        content: `Contexto del mapa conceptual: ${context}`,
      });
    }

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      console.log(`Including ${conversationHistory.length} previous messages`);
      conversationHistory.forEach((msg: any) => {
        if (msg.role && msg.content) {
          messages.push({ role: msg.role, content: msg.content });
        }
      });
    }

    messages.push({ role: "user", content: prompt });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.8,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${response.status}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content || "";

    console.log("Generated response length:", generatedText.length);

    return new Response(JSON.stringify({ ok: true, text: generatedText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in openai-chat function:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
