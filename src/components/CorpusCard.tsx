import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import type { CorpusEntry } from '@/data/corpus';

interface CorpusCardProps {
  entry: CorpusEntry;
}

const CorpusCard = ({ entry }: CorpusCardProps) => {
  return (
    <Link
      to={`/corpus/${entry.slug}`}
      className="group block p-6 bg-card border border-border rounded-lg hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
          <BookOpen className="w-4 h-4 text-primary" />
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>

      <h3 className="font-philosophy text-lg text-foreground group-hover:text-primary transition-colors mb-2">
        {entry.title}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {entry.excerpt}
      </p>

      <div className="flex flex-wrap gap-2">
        {entry.nodes.slice(0, 3).map((node) => (
          <span
            key={node}
            className="px-2 py-1 rounded-full bg-secondary text-xs font-system text-secondary-foreground capitalize"
          >
            {node}
          </span>
        ))}
        {entry.axes.map((axis) => (
          <span
            key={axis}
            className="px-2 py-1 rounded-full bg-primary/10 text-xs font-system text-primary capitalize"
          >
            {axis}
          </span>
        ))}
      </div>
    </Link>
  );
};

export default CorpusCard;
