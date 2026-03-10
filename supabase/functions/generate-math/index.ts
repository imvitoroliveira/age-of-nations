import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { difficulty, age, childName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const difficultyGuide = {
      easy: "Números de 1 a 5, apenas soma. Problemas muito simples para crianças de 3-4 anos.",
      medium: "Números de 1 a 15, soma e subtração. Para crianças de 5-6 anos.",
      hard: "Números de 1 a 30, soma e subtração com números maiores. Para crianças de 7-8 anos.",
    };

    const systemPrompt = `Você é um gerador de problemas de matemática para crianças brasileiras.
Gere UM problema criativo e divertido com contexto lúdico (animais, frutas, brinquedos, etc).
Dificuldade: ${difficultyGuide[difficulty as keyof typeof difficultyGuide] || difficultyGuide.easy}

IMPORTANTE: Responda APENAS com JSON válido, sem markdown, sem texto extra.
O JSON deve ter este formato exato:
{
  "story": "Uma frase curta com o contexto do problema (max 80 chars)",
  "question": "A pergunta matemática em si (max 60 chars)",
  "a": <número>,
  "b": <número>,
  "operator": "+" ou "-",
  "answer": <resultado correto>,
  "options": [<4 opções numéricas incluindo a resposta correta, embaralhadas>],
  "emoji": "<emoji relacionado ao contexto>"
}

Regras:
- A subtração nunca deve resultar em número negativo
- As opções erradas devem ser plausíveis (próximas da resposta)
- Use linguagem simples e divertida
- ${childName ? `O nome da criança é ${childName}, pode usar no contexto` : ""}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Gere um problema de matemática nível ${difficulty} para uma criança de ${age || 5} anos.` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "rate_limit" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "payment_required" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response, handling possible markdown wrapping
    let parsed;
    try {
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid AI response format");
    }

    // Validate required fields
    if (!parsed.answer || !parsed.options || parsed.options.length < 4) {
      throw new Error("Incomplete AI response");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-math error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
