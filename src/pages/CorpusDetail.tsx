import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { corpusIndex, corpusContent } from '@/data/corpus';
import { ArrowLeft } from 'lucide-react';

const CorpusDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const entry = corpusIndex.find(e => e.slug === slug);
  const content = slug ? corpusContent[slug] : null;

  if (!entry || !content) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 text-center">
          <p className="text-muted-foreground">Texto no encontrado</p>
          <Link to="/corpus" className="text-primary hover:underline mt-4 inline-block">
            Volver al corpus
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        <article className="max-w-3xl mx-auto px-6 py-16">
          <Link 
            to="/corpus" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-system text-sm">Volver al corpus</span>
          </Link>

          <MarkdownRenderer content={content} />

          <div className="mt-12 pt-8 border-t border-border">
            <h4 className="font-philosophy text-lg text-foreground mb-4">Nodos relacionados</h4>
            <div className="flex flex-wrap gap-2">
              {entry.nodes.map((node) => (
                <Link
                  key={node}
                  to="/mapa"
                  className="px-3 py-1.5 rounded-full bg-secondary text-sm font-system text-secondary-foreground capitalize hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  {node}
                </Link>
              ))}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default CorpusDetail;
