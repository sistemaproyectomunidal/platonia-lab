/**
 * AI Pipeline - Sistema Lagrange
 * Functions for socratic analysis using AI
 */

import { generateWithOpenAI } from "@/lib/backend";
import type {
  AnalysisRequest,
  AnalysisResponse,
  Node,
  SocraticQuestion,
} from "@/types";
import { fetchNodes, fetchSocraticQuestions } from "./dataLoader";

// Tension validation threshold (Regla de Oro)
const TENSION_THRESHOLD = 0.7;

// ============================================
// MAIN ANALYSIS FUNCTION
// ============================================

/**
 * Analyze user input with AI and return socratic analysis
 */
export async function analyzeWithAI(
  request: AnalysisRequest
): Promise<AnalysisResponse> {
  const { userInput, context, targetAxis } = request;

  try {
    // Build dynamic system prompt based on target axis
    const systemPrompt = buildSystemPrompt(targetAxis);

    // Build rich context from graph including related nodes
    const graphContext = await buildContextFromGraph();
    const relatedNodesPreview = await findRelatedNodes(userInput, "");
    const nodesContext =
      relatedNodesPreview.length > 0
        ? `\n\nNodos relacionados identificados: ${relatedNodesPreview.join(
            ", "
          )}`
        : "";

    // Build full context with axis information
    const axisContext = targetAxis ? `\n\nEje objetivo: ${targetAxis}` : "";
    const fullContext = `${graphContext}${nodesContext}${axisContext}${
      context ? `\n\nContexto adicional: ${context}` : ""
    }`;

    // Add timestamp for variability (prevent caching)
    const timestamp = new Date().toISOString();
    const fullPrompt = `[Timestamp: ${timestamp}]\n\n${userInput}`;

    // Call the OpenAI edge function with dynamic system prompt and conversation history
    const aiResp = await generateWithOpenAI(
      fullPrompt,
      fullContext,
      systemPrompt,
      request.conversationHistory
    );
    if (aiResp.error) {
      console.error("AI analysis error:", aiResp.error);
      return generateMockResponse(userInput);
    }

    // Parse and structure the response
    const aiText = aiResp.text || "";

    // Extract related nodes based on content analysis
    const relatedNodes = await findRelatedNodes(userInput, aiText);

    // Extract questions from AI response (lines starting with ?)
    const aiGeneratedQuestions = extractQuestionsFromAIResponse(aiText);

    // Also get database questions related to nodes
    const dbQuestions = await generateSocraticQuestions(
      userInput,
      relatedNodes
    );

    // Combine AI-generated questions (priority) with DB questions
    const generatedQuestions = [
      ...aiGeneratedQuestions,
      ...dbQuestions.slice(0, Math.max(0, 3 - aiGeneratedQuestions.length)),
    ];

    // Calculate tension level
    const tensionLevel = calculateTensionLevel(userInput, aiText);

    // Validate and generate warnings
    const warnings = validateTension(aiText, tensionLevel);

    return {
      analysis: aiText,
      generatedQuestions,
      relatedNodes,
      tensionLevel,
      warnings,
      ok: true,
    };
  } catch (e) {
    console.error("AI pipeline error:", e);
    return generateMockResponse(userInput);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Extract questions from AI response text
 * Looks for lines that start with question marks or numbered questions
 */
function extractQuestionsFromAIResponse(aiText: string): string[] {
  const questions: string[] = [];
  const lines = aiText.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Match patterns like:
    // - ¿Question?
    // - 1. ¿Question?
    // - PREGUNTAS SOCRÁTICAS: followed by questions
    // - Lines ending with ?

    if (line.startsWith("¿") || /^\d+\.\s*¿/.test(line) || /-\s*¿/.test(line)) {
      // Extract the question text
      let question = line
        .replace(/^\d+\.\s*/, "") // Remove numbering
        .replace(/^-\s*/, "") // Remove dash
        .trim();

      // If it's a valid question (has content and ends with ?)
      if (question.length > 10 && question.includes("?")) {
        questions.push(question);
      }
    }
  }

  // Also look for sections labeled as questions
  const questionSectionMatch =
    aiText.match(/PREGUNTAS SOCRÁTICAS:?\s*([\s\S]*?)(?=\n\n|$)/i) ||
    aiText.match(/PREGUNTAS:?\s*([\s\S]*?)(?=\n\n|$)/i);

  if (questionSectionMatch) {
    const section = questionSectionMatch[1];
    const sectionQuestions = section
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          (line.startsWith("¿") || /^\d+\.\s*¿/.test(line)) &&
          line.includes("?")
      )
      .map((line) =>
        line
          .replace(/^\d+\.\s*/, "")
          .replace(/^-\s*/, "")
          .trim()
      );

    questions.push(...sectionQuestions);
  }

  // Remove duplicates and limit to 3
  return [...new Set(questions)].slice(0, 3);
}

/**
 * Build system prompt based on target axis
 */
function buildSystemPrompt(targetAxis?: string): string {
  const axisDescriptions: Record<string, string> = {
    L1: "L1 (Miedo): Ontología de la amenaza. Explora cómo el miedo estructura la experiencia, genera narrativas de supervivencia y establece límites entre lo seguro y lo peligroso.",
    L2: "L2 (Control): Poder y gestión. Examina las dinámicas de control, dominación, resistencia y los mecanismos que naturalizan relaciones de poder asimétricas.",
    L3: "L3 (Legitimidad): Narrativas y verdad. Analiza cómo se construyen las narrativas legitimadoras, qué cuenta como verdad, y quién tiene autoridad epistémica.",
    L4: 'L4 (Salud Mental): Normalización y desviación. Investiga los límites entre normalidad y patología, y cómo se construyen socialmente los estados mentales "aceptables".',
    L5: "L5 (Responsabilidad): Agencia y determinación. Explora la tensión entre libre albedrío y determinismo, y cómo se asigna responsabilidad moral y política.",
  };

  const basePrompt = `Eres un filósofo socrático especializado en análisis dialéctico profundo del Sistema Lagrange.

Tu tarea es realizar análisis filosóficos rigurosos que:

1. IDENTIFIQUEN TENSIONES: Localiza contradicciones, paradojas y tensiones dialécticas en el input.

2. EXPLOREN LÍMITES: Examina los límites conceptuales, zonas grises y ambigüedades productivas.

3. GENEREN PREGUNTAS PROFUNDAS: Formula preguntas socráticas que profundicen sin cerrar el problema.

4. MANTENGAN APERTURA: No resuelvas la tensión. Mantenla abierta como espacio de pensamiento crítico.

5. CONTEXTO LAGRANGIANO - Los cinco ejes de tensión:
   - L1: Miedo (ontología de la amenaza)
   - L2: Control (poder y gestión)
   - L3: Legitimidad (narrativas y verdad)
   - L4: Salud Mental (normalización y desviación)
   - L5: Responsabilidad (agencia y determinación)

REGLAS CRÍTICAS:
- NO simplificar ni consolar
- NO ofrecer "soluciones" o "respuestas definitivas"
- Revelar complejidad, no ocultarla
- Lenguaje preciso y riguroso
- La "Regla de Oro": mantener tensión dialéctica sin resolverla

FORMATO ESPERADO:
- Análisis filosófico profundo (2-3 párrafos densos)
- Identificación explícita de tensiones entre ejes
- 2-3 preguntas socráticas que profundicen el análisis`;

  if (targetAxis) {
    const axisKey = targetAxis.toUpperCase();
    const axisDetail = axisDescriptions[axisKey] || `Eje ${targetAxis}`;
    return `${basePrompt}\n\n🎯 FOCO ESPECÍFICO: ${axisDetail}\n\nAnaliza el input desde este eje, pero sin olvidar las tensiones con los otros ejes del sistema. Identifica cómo este eje específico ilumina aspectos ocultos del problema.`;
  }

  return basePrompt;
}

/**
 * Build context from graph nodes
 */
async function buildContextFromGraph(): Promise<string> {
  try {
    const nodes = await fetchNodes();
    const nodeDescriptions = nodes
      .map((n) => `- ${n.label}: ${n.description}`)
      .join("\n");

    return `Nodos conceptuales del sistema:\n${nodeDescriptions}`;
  } catch (e) {
    return "";
  }
}

/**
 * Find nodes related to the user input and AI response
 */
async function findRelatedNodes(
  userInput: string,
  aiResponse: string
): Promise<string[]> {
  const nodes = await fetchNodes();
  const combinedText = `${userInput} ${aiResponse}`.toLowerCase();

  const relatedIds: string[] = [];

  for (const node of nodes) {
    const keywords = [
      node.label.toLowerCase(),
      node.id.toLowerCase(),
      ...node.description
        .toLowerCase()
        .split(" ")
        .filter((w) => w.length > 4),
    ];

    if (keywords.some((keyword) => combinedText.includes(keyword))) {
      relatedIds.push(node.id);
    }
  }

  return [...new Set(relatedIds)];
}

/**
 * Generate socratic follow-up questions
 */
async function generateSocraticQuestions(
  userInput: string,
  relatedNodes: string[]
): Promise<string[]> {
  const allQuestions = await fetchSocraticQuestions();

  // Filter questions related to the identified nodes
  const relevantQuestions = allQuestions.filter(
    (q) =>
      q.relatedNodes?.some((n) => relatedNodes.includes(n)) ||
      q.related_nodes?.some((n) => relatedNodes.includes(n))
  );

  // If no relevant questions found, return some generic ones
  if (relevantQuestions.length === 0) {
    return [
      "¿Qué supuestos estás dando por válidos sin cuestionarlos?",
      "¿Quién se beneficia de que pienses así?",
      "¿Cómo sabrías si estuvieras equivocado?",
    ];
  }

  // Return up to 3 relevant questions
  return relevantQuestions.slice(0, 3).map((q) => q.text || q.question || "");
}

/**
 * Calculate tension level based on content
 */
function calculateTensionLevel(userInput: string, aiResponse: string): number {
  const tensionKeywords = [
    "contradicción",
    "conflicto",
    "paradoja",
    "tensión",
    "ambiguo",
    "incierto",
    "cuestionar",
    "supuesto",
    "oculto",
    "verdad",
    "poder",
    "control",
    "miedo",
    "legitimidad",
  ];

  const combinedText = `${userInput} ${aiResponse}`.toLowerCase();
  let score = 0;

  for (const keyword of tensionKeywords) {
    if (combinedText.includes(keyword)) {
      score += 1;
    }
  }

  // Normalize to 0-10 scale
  return Math.min(10, Math.round((score / tensionKeywords.length) * 10));
}

/**
 * Validate tension level and generate warnings (Regla de Oro)
 */
export function validateTension(
  content: string,
  tensionLevel: number
): string[] {
  const warnings: string[] = [];

  // Check if tension is too low
  if (tensionLevel < 3) {
    warnings.push(
      "Advertencia: El nivel de tensión dialéctica es bajo. La respuesta puede ser demasiado complaciente."
    );
  }

  // Check for definitive statements (violation of Golden Rule)
  const definitivePatterns = [
    /la verdad es que/i,
    /definitivamente/i,
    /sin duda/i,
    /está claro que/i,
    /la respuesta es/i,
    /es obvio que/i,
  ];

  for (const pattern of definitivePatterns) {
    if (pattern.test(content)) {
      warnings.push(
        "Advertencia: Se detectaron afirmaciones definitivas. La Regla de Oro requiere mantener la tensión."
      );
      break;
    }
  }

  // Check for excessive agreement
  const agreementPatterns = [
    /tienes razón/i,
    /estoy de acuerdo/i,
    /exactamente/i,
    /correcto/i,
  ];

  let agreementCount = 0;
  for (const pattern of agreementPatterns) {
    if (pattern.test(content)) {
      agreementCount++;
    }
  }

  if (agreementCount >= 2) {
    warnings.push(
      "Advertencia: Exceso de afirmación. El método socrático requiere cuestionar, no validar."
    );
  }

  return warnings;
}

// ============================================
// MOCK RESPONSE (fallback when AI unavailable)
// ============================================

function generateMockResponse(userInput: string): AnalysisResponse {
  const mockAnalyses = [
    `Tu pregunta sobre "${userInput.substring(
      0,
      50
    )}..." revela una tensión fundamental entre lo que asumimos y lo que realmente sabemos. ¿Has considerado que la premisa misma de tu pregunta podría estar condicionada por estructuras de poder que das por naturales?`,
    `Interesante planteamiento. Pero pregunto: ¿desde qué posición de certeza formulas esta inquietud? El Sistema Lagrange nos recuerda que toda pregunta contiene ya una respuesta implícita. ¿Cuál es la que estás evitando formular?`,
    `Antes de responder, debo señalar que tu formulación asume varios supuestos. El eje del miedo (L1) nos enseña que muchas de nuestras preguntas nacen de ansiedades que preferimos no nombrar. ¿Qué miedo habita debajo de esta pregunta?`,
  ];

  const mockQuestions = [
    "¿Qué pasaría si la respuesta que buscas no existiera?",
    "¿Quién te enseñó a formular preguntas de esta manera?",
    "¿Cómo cambiaría tu vida si supieras que estás equivocado?",
  ];

  return {
    analysis: mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)],
    generatedQuestions: mockQuestions,
    relatedNodes: ["miedo", "verdad", "critica"],
    tensionLevel: 7,
    warnings: [],
    ok: true,
  };
}

export default {
  analyzeWithAI,
  validateTension,
};
