import { useMemo, useState } from 'react';
import nodesData from '@/data/nodes.json';
import questionsData from '@/data/socraticQuestions.json';
import { saveDemoResult } from '@/lib/backend';
import { ArrowRight } from 'lucide-react';

const GEMINI_ENDPOINT = import.meta.env.VITE_GEMINI_ENDPOINT || '';

interface Result {
  axes: string[];
  matchedNodes: string[];
  questions: Array<{ id: string; text: string; axis: string }>;
  summary: string;
}

const extractBracketTokens = (text: string) => {
  const re = /\[([^\]]+)\]/g;
  const found: string[] = [];
  let m;
  // eslint-disable-next-line no-cond-assign
  while ((m = re.exec(text)) !== null) {
    found.push(m[1].trim());
  }
  return found;
};

const LabDemo: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const nodes = useMemo(() => nodesData.nodes, []);
  const questions = useMemo(() => questionsData.questions, []);

  const runDemo = async () => {
    setRunning(true);
    setResult(null);

    // Simulate a small processing delay
    await new Promise((r) => setTimeout(r, 500));

    // Extract explicit tokens like [miedo]
    const tokens = extractBracketTokens(prompt).map(t => t.toLowerCase());

    // Match nodes by id or label
    const matchedNodes = new Set<string>();
    const matchedAxes = new Set<string>();

    if (tokens.length) {
      tokens.forEach((tok) => {
        const byId = nodes.find((n: any) => n.id.toLowerCase() === tok);
        if (byId) {
          matchedNodes.add(byId.id);
          matchedAxes.add(byId.axis);
        } else {
          // try label match
          const byLabel = nodes.find((n: any) => n.label.toLowerCase() === tok);
          if (byLabel) {
            matchedNodes.add(byLabel.id);
            matchedAxes.add(byLabel.axis);
          }
        }
      });
    }

    // Fallback: keyword match against labels
    if (matchedNodes.size === 0 && prompt.trim().length > 0) {
      const lowered = prompt.toLowerCase();
      nodes.forEach((n: any) => {
        if (lowered.includes(n.label.toLowerCase()) || lowered.includes(n.id.toLowerCase())) {
          matchedNodes.add(n.id);
          matchedAxes.add(n.axis);
        }
      });
    }

    // Find relevant questions that reference matched nodes or axes
    const matchedQuestions: Array<{ id: string; text: string; axis: string }> = [];
    if (matchedNodes.size) {
      questions.forEach((q: any) => {
        const related = (q.relatedNodes || []).map((r: string) => r.toLowerCase());
        const intersects = Array.from(matchedNodes).some(m => related.includes(m.toLowerCase()));
        if (intersects) matchedQuestions.push({ id: q.id, text: q.text, axis: q.axis });
      });
    }

    // If still empty, pick top 2 general questions
    if (matchedQuestions.length === 0) {
      matchedQuestions.push(...questions.slice(0, 2).map((q: any) => ({ id: q.id, text: q.text, axis: q.axis })));
    }

    const summary = matchedQuestions.length
      ? `Propuesta: ${matchedQuestions.length} preguntas relevantes sobre los ejes ${Array.from(matchedAxes).join(', ') || 'general'}`
      : 'No se encontraron correspondencias claras.';

    const resObj = { axes: Array.from(matchedAxes), matchedNodes: Array.from(matchedNodes), questions: matchedQuestions, summary };
    setResult(resObj);

    // Try saving the demo run to backend (Supabase) if configured
    try {
      const saved = await saveDemoResult({ prompt, summary: resObj.summary, axes: resObj.axes, matchedNodes: resObj.matchedNodes, questions: resObj.questions });
      if (saved && saved.error) {
        console.warn('Demo save failed:', saved.error);
      } else if (saved && saved.id) {
        console.info('Demo saved id:', saved.id);
      }
    } catch (e) {
      console.warn('Demo save error', e);
    }
    setRunning(false);
  };

  const generateWithGemini = async () => {
    if (!GEMINI_ENDPOINT) {
      alert('GEMINI endpoint not configured (set VITE_GEMINI_ENDPOINT)');
      return;
    }

    setRunning(true);
    try {
      const res = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const json = await res.json();
      if (json?.ok && json.data) {
        const aiText = typeof json.data === 'string' ? json.data : JSON.stringify(json.data);
        setResult((r) => ({ ...(r as any), // append ai field
          ai: aiText } as any));
      } else if (json?.error) {
        console.warn('Gemini function error:', json.error);
        alert('Gemini function error: ' + json.error);
      }
    } catch (e) {
      console.warn('Gemini call failed', e);
      alert('Gemini call failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-philosophy text-lg text-foreground">Laboratorio — Demo de prompts</h3>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Analiza la tensión entre [miedo] y [legitimidad] en el contexto de..."
        className="w-full h-32 p-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground font-system text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors"
      />

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={runDemo}
            disabled={running || prompt.trim().length === 0}
            className={`px-4 py-2 rounded-lg bg-primary text-primary-foreground font-system text-sm uppercase tracking-wider transition-opacity ${running || prompt.trim().length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
          >
            Ejecutar demo
          </button>

          <button
            onClick={() => { setPrompt(''); setResult(null); }}
            className="px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground"
          >
            Limpiar
          </button>
        </div>

        <div className="text-xs text-muted-foreground">{prompt.length} caracteres</div>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6">
          <div className="mb-3 text-sm text-muted-foreground">Resumen</div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="font-medium text-foreground mb-2">{result.summary}</div>

            <div className="flex flex-wrap gap-2 mt-2">
              {result.axes.length ? result.axes.map((a) => (
                <span key={a} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-system">{a}</span>
              )) : <span className="text-xs text-muted-foreground">Ejes: —</span>}
            </div>

            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-2">Preguntas sugeridas</div>
              <ul className="space-y-3">
                {result.questions.map((q) => (
                  <li key={q.id} className="p-3 bg-card border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-foreground font-medium">{q.text}</div>
                      <span className="text-xs text-muted-foreground">{q.axis}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 text-primary">Simulado</span>
                      <span className="ml-auto text-muted-foreground">#{q.id}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabDemo;
