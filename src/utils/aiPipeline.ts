/**
 * AI Pipeline - Sistema Lagrange
 * Functions for socratic analysis using AI
 */

import { supabase } from '@/integrations/supabase/client';
import type { AnalysisRequest, AnalysisResponse, Node, SocraticQuestion } from '@/types';
import { fetchNodes, fetchSocraticQuestions } from './dataLoader';

// Tension validation threshold (Regla de Oro)
const TENSION_THRESHOLD = 0.7;

// ============================================
// MAIN ANALYSIS FUNCTION
// ============================================

/**
 * Analyze user input with AI and return socratic analysis
 */
export async function analyzeWithAI(request: AnalysisRequest): Promise<AnalysisResponse> {
  const { userInput, context, targetAxis } = request;

  try {
    // Build the prompt for OpenAI
    const systemPrompt = buildSystemPrompt(targetAxis);
    const fullPrompt = context 
      ? `Contexto: ${context}\n\nInput del usuario: ${userInput}`
      : userInput;

    // Call the OpenAI edge function
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: {
        prompt: fullPrompt,
        systemPrompt,
        context: await buildContextFromGraph(),
      },
    });

    if (error) {
      console.error('AI analysis error:', error);
      return generateMockResponse(userInput);
    }

    // Parse and structure the response
    const aiText = data?.text || data?.generatedText || '';
    
    // Extract related nodes based on content analysis
    const relatedNodes = await findRelatedNodes(userInput, aiText);
    
    // Generate follow-up questions
    const generatedQuestions = await generateSocraticQuestions(userInput, relatedNodes);
    
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
    console.error('AI pipeline error:', e);
    return generateMockResponse(userInput);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Build system prompt based on target axis
 */
function buildSystemPrompt(targetAxis?: string): string {
  const basePrompt = `Eres un asistente socrático del Sistema Lagrange. Tu función es:
1. Analizar críticamente las afirmaciones del usuario
2. Formular preguntas que revelen contradicciones o supuestos ocultos
3. Identificar conexiones con los ejes Lagrange (Miedo, Control, Legitimidad, Salud Mental, Responsabilidad)
4. Nunca dar respuestas definitivas, siempre abrir nuevas líneas de reflexión
5. Mantener un tono filosófico pero accesible

IMPORTANTE: La "Regla de Oro" del sistema es mantener la tensión dialéctica sin resolverla.`;

  if (targetAxis) {
    return `${basePrompt}\n\nEnfócate especialmente en el eje: ${targetAxis}`;
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
      .join('\n');
    
    return `Nodos conceptuales del sistema:\n${nodeDescriptions}`;
  } catch (e) {
    return '';
  }
}

/**
 * Find nodes related to the user input and AI response
 */
async function findRelatedNodes(userInput: string, aiResponse: string): Promise<string[]> {
  const nodes = await fetchNodes();
  const combinedText = `${userInput} ${aiResponse}`.toLowerCase();
  
  const relatedIds: string[] = [];
  
  for (const node of nodes) {
    const keywords = [
      node.label.toLowerCase(),
      node.id.toLowerCase(),
      ...node.description.toLowerCase().split(' ').filter((w) => w.length > 4),
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
      '¿Qué supuestos estás dando por válidos sin cuestionarlos?',
      '¿Quién se beneficia de que pienses así?',
      '¿Cómo sabrías si estuvieras equivocado?',
    ];
  }
  
  // Return up to 3 relevant questions
  return relevantQuestions
    .slice(0, 3)
    .map((q) => q.text || q.question || '');
}

/**
 * Calculate tension level based on content
 */
function calculateTensionLevel(userInput: string, aiResponse: string): number {
  const tensionKeywords = [
    'contradicción',
    'conflicto',
    'paradoja',
    'tensión',
    'ambiguo',
    'incierto',
    'cuestionar',
    'supuesto',
    'oculto',
    'verdad',
    'poder',
    'control',
    'miedo',
    'legitimidad',
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
export function validateTension(content: string, tensionLevel: number): string[] {
  const warnings: string[] = [];
  
  // Check if tension is too low
  if (tensionLevel < 3) {
    warnings.push(
      'Advertencia: El nivel de tensión dialéctica es bajo. La respuesta puede ser demasiado complaciente.'
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
        'Advertencia: Se detectaron afirmaciones definitivas. La Regla de Oro requiere mantener la tensión.'
      );
      break;
    }
  }
  
  // Check for excessive agreement
  const agreementPatterns = [/tienes razón/i, /estoy de acuerdo/i, /exactamente/i, /correcto/i];
  
  let agreementCount = 0;
  for (const pattern of agreementPatterns) {
    if (pattern.test(content)) {
      agreementCount++;
    }
  }
  
  if (agreementCount >= 2) {
    warnings.push(
      'Advertencia: Exceso de afirmación. El método socrático requiere cuestionar, no validar.'
    );
  }
  
  return warnings;
}

// ============================================
// MOCK RESPONSE (fallback when AI unavailable)
// ============================================

function generateMockResponse(userInput: string): AnalysisResponse {
  const mockAnalyses = [
    `Tu pregunta sobre "${userInput.substring(0, 50)}..." revela una tensión fundamental entre lo que asumimos y lo que realmente sabemos. ¿Has considerado que la premisa misma de tu pregunta podría estar condicionada por estructuras de poder que das por naturales?`,
    `Interesante planteamiento. Pero pregunto: ¿desde qué posición de certeza formulas esta inquietud? El Sistema Lagrange nos recuerda que toda pregunta contiene ya una respuesta implícita. ¿Cuál es la que estás evitando formular?`,
    `Antes de responder, debo señalar que tu formulación asume varios supuestos. El eje del miedo (L1) nos enseña que muchas de nuestras preguntas nacen de ansiedades que preferimos no nombrar. ¿Qué miedo habita debajo de esta pregunta?`,
  ];

  const mockQuestions = [
    '¿Qué pasaría si la respuesta que buscas no existiera?',
    '¿Quién te enseñó a formular preguntas de esta manera?',
    '¿Cómo cambiaría tu vida si supieras que estás equivocado?',
  ];

  return {
    analysis: mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)],
    generatedQuestions: mockQuestions,
    relatedNodes: ['miedo', 'verdad', 'critica'],
    tensionLevel: 7,
    warnings: [],
    ok: true,
  };
}

export default {
  analyzeWithAI,
  validateTension,
};
