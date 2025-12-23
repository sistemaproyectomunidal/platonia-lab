import { useState } from "react";
import { useLabHistory } from "@/hooks/useLabHistory";
import { analyzeWithAI } from "@/utils/aiPipeline";
import {
  useMapNodes,
  useSocraticQuestions,
  useSaveDemoResult,
} from "@/hooks/queries";
import type { AnalysisResponse } from "@/types";
import {
  Sparkles,
  Loader2,
  History,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Result {
  axes: string[];
  matchedNodes: string[];
  questions: Array<{ id: string; text: string; axis: string }>;
  summary: string;
  aiResponse?: string;
  warnings?: string[];
  tensionLevel?: number;
}

const extractBracketTokens = (text: string) => {
  const re = /\[([^\]]+)\]/g;
  const found: string[] = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    found.push(m[1].trim());
  }
  return found;
};

const LabDemo: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Use optimized hooks
  const {
    data: nodes = [],
    isLoading: nodesLoading,
    error: nodesError,
  } = useMapNodes();
  const {
    data: questions = [],
    isLoading: questionsLoading,
    error: questionsError,
  } = useSocraticQuestions();
  const { mutateAsync: saveDemoMutation } = useSaveDemoResult();

  const { history, addAnalysis, clearHistory, exportHistory } = useLabHistory();

  const dataLoading = nodesLoading || questionsLoading;
  const dataError = nodesError || questionsError;

  const runAnalysis = async () => {
    if (!prompt.trim()) return;

    setRunning(true);
    setResult(null);

    try {
      // Extract bracket tokens for node matching
      const tokens = extractBracketTokens(prompt).map((t) => t.toLowerCase());
      const matchedNodes = new Set<string>();
      const matchedAxes = new Set<string>();

      // Match by tokens
      if (tokens.length) {
        tokens.forEach((tok) => {
          const byId = nodes.find((n) => n.id.toLowerCase() === tok);
          if (byId) {
            matchedNodes.add(byId.id);
            matchedAxes.add(byId.axis);
          } else {
            const byLabel = nodes.find((n) => n.label.toLowerCase() === tok);
            if (byLabel) {
              matchedNodes.add(byLabel.id);
              matchedAxes.add(byLabel.axis);
            }
          }
        });
      }

      // Match by content if no tokens found
      if (matchedNodes.size === 0) {
        const lowered = prompt.toLowerCase();
        nodes.forEach((n) => {
          if (
            lowered.includes(n.label.toLowerCase()) ||
            lowered.includes(n.id.toLowerCase())
          ) {
            matchedNodes.add(n.id);
            matchedAxes.add(n.axis);
          }
        });
      }

      // Find related questions
      const matchedQuestions: Array<{
        id: string;
        text: string;
        axis: string;
      }> = [];
      if (matchedNodes.size) {
        questions.forEach((q) => {
          const related = (q.relatedNodes || q.related_nodes || []).map((r) =>
            r.toLowerCase()
          );
          const intersects = Array.from(matchedNodes).some((m) =>
            related.includes(m.toLowerCase())
          );
          if (intersects)
            matchedQuestions.push({ id: q.id, text: q.text, axis: q.axis });
        });
      }

      if (matchedQuestions.length === 0) {
        matchedQuestions.push(
          ...questions
            .slice(0, 2)
            .map((q) => ({ id: q.id, text: q.text, axis: q.axis }))
        );
      }

      // Run AI analysis
      const aiResult = await analyzeWithAI({
        userInput: prompt,
        targetAxis: Array.from(matchedAxes)[0],
      });

      // Combine local matched questions with AI-generated questions
      const allQuestions = [
        ...matchedQuestions,
        ...aiResult.generatedQuestions.map((text, idx) => ({
          id: `ai-${idx}`,
          text,
          axis: Array.from(matchedAxes)[0] || "general",
        })),
      ];

      // Use AI-related nodes if available, otherwise use local matches
      const finalNodes =
        aiResult.relatedNodes.length > 0
          ? aiResult.relatedNodes
          : Array.from(matchedNodes);

      // Get axes from related nodes
      const finalAxes = new Set<string>(Array.from(matchedAxes));
      finalNodes.forEach((nodeId) => {
        const node = nodes.find((n) => n.id === nodeId);
        if (node?.axis) finalAxes.add(node.axis);
      });

      const summary = `Análisis completado: ${
        allQuestions.length
      } preguntas relevantes sobre los ejes ${
        Array.from(finalAxes).join(", ") || "general"
      }`;

      const resObj: Result = {
        axes: Array.from(finalAxes),
        matchedNodes: finalNodes,
        questions: allQuestions,
        summary,
        aiResponse: aiResult.analysis,
        warnings: aiResult.warnings,
        tensionLevel: aiResult.tensionLevel,
      };

      setResult(resObj);

      // Add to history
      addAnalysis(prompt, aiResult);

      // Save to database
      try {
        await saveDemoMutation({
          prompt,
          summary: resObj.summary,
          axes: resObj.axes,
          matchedNodes: resObj.matchedNodes,
          questions: resObj.questions,
          aiResponse: resObj.aiResponse,
        });
      } catch (e) {
        console.warn("Demo save error", e);
      }
    } catch (e) {
      console.error("Analysis error:", e);
      setResult({
        axes: [],
        matchedNodes: [],
        questions: [],
        summary: "Error al procesar el análisis.",
      });
    } finally {
      setRunning(false);
    }
  };

  const handleExportHistory = () => {
    const json = exportHistory();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lab-history-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFromHistory = (userInput: string) => {
    setPrompt(userInput);
    setShowHistory(false);
  };

  return (
    <div className="space-y-4">
      {/* Error states */}
      {dataError && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">
              Error al cargar datos
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              No se pudieron cargar los nodos o preguntas desde el servidor
            </p>
          </div>
        </div>
      )}

      {/* Main input area */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-philosophy text-lg text-foreground">
            Análisis Socrático
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="text-muted-foreground"
          >
            <History className="w-4 h-4 mr-1" />
            Historial ({history.length})
            {showHistory ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </Button>
        </div>

        {/* History panel */}
        {showHistory && (
          <div className="mb-4 p-4 bg-background border border-border rounded-lg max-h-48 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Sin historial
              </p>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    Análisis anteriores
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleExportHistory}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Exportar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-destructive"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Limpiar
                    </Button>
                  </div>
                </div>
                {history.slice(0, 5).map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => loadFromHistory(entry.userInput)}
                    className="w-full text-left p-2 rounded bg-card hover:bg-primary/10 transition-colors"
                  >
                    <p className="text-sm text-foreground truncate">
                      {entry.userInput}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Analiza la tensión entre [miedo] y [legitimidad] en el contexto de..."
          className="w-full h-32 p-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground font-system text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors"
        />

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={runAnalysis}
              disabled={
                running ||
                prompt.trim().length === 0 ||
                dataLoading ||
                !!dataError
              }
              className="gap-2"
            >
              {running || dataLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {dataLoading
                ? "Cargando datos..."
                : running
                ? "Analizando..."
                : "Analizar"}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setPrompt("");
                setResult(null);
              }}
            >
              Limpiar
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            {prompt.length} caracteres
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-card border border-border rounded-lg p-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Resultado del Análisis
            </div>
            {result.tensionLevel !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Tensión:</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-3 rounded-sm ${
                        i < result.tensionLevel! ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-primary font-medium">
                  {result.tensionLevel}/10
                </span>
              </div>
            )}
          </div>

          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <div className="text-sm font-medium text-destructive mb-1">
                Advertencias (Regla de Oro)
              </div>
              <ul className="space-y-1">
                {result.warnings.map((warning, i) => (
                  <li key={i} className="text-xs text-destructive/80">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Response */}
          {result.aiResponse && (
            <div className="mb-4 p-4 bg-background border border-border rounded-lg">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {result.aiResponse}
              </p>
            </div>
          )}

          {/* Axes */}
          <div className="flex flex-wrap gap-2 mb-4">
            {result.axes.length ? (
              result.axes.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-system"
                >
                  {a}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">Ejes: —</span>
            )}
          </div>

          {/* Questions */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Preguntas Socráticas Sugeridas
            </div>
            <ul className="space-y-3">
              {result.questions.length === 0 ? (
                <li className="p-3 bg-background border border-border rounded-lg text-sm text-muted-foreground italic">
                  No se generaron preguntas para este análisis
                </li>
              ) : (
                result.questions.map((q) => (
                  <li
                    key={q.id}
                    className="p-3 bg-background border border-border rounded-lg hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm text-foreground font-medium">
                        {q.text}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {q.axis}
                        </span>
                        {q.id.startsWith("ai-") && (
                          <span className="text-xs text-primary/70 whitespace-nowrap">
                            ✨ AI
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabDemo;
