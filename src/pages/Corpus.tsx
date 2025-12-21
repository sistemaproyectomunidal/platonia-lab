import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import CorpusCard from '@/components/CorpusCard';
import { corpusIndex } from '@/data/corpus';
import { BookOpen } from 'lucide-react';

const Corpus = () => {
  const publishedEntries = corpusIndex.filter(e => e.state === 'published');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        <section className="py-16 border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-primary/10 border border-primary/30">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="font-system text-xs text-primary uppercase tracking-widest">
                Lectura Crítica
              </span>
            </div>

            <h1 className="font-philosophy text-4xl md:text-5xl text-foreground">
              Corpus Filosófico
            </h1>
            
            <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
              Textos que exploran las tensiones del mapa. No buscan resolver — buscan mantener 
              abierta la pregunta.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-6">
              {publishedEntries.map((entry) => (
                <CorpusCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Corpus;
