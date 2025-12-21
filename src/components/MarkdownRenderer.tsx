import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="font-philosophy text-3xl md:text-4xl text-foreground mb-6 mt-8 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-philosophy text-2xl text-foreground mb-4 mt-8 border-b border-border pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-philosophy text-xl text-foreground mb-3 mt-6">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground leading-relaxed mb-4">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/50 pl-4 py-2 my-6 bg-primary/5 rounded-r-lg italic text-foreground">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-2 mb-4 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 ml-4 text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="text-foreground font-semibold">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="text-primary italic">
              {children}
            </em>
          ),
          hr: () => (
            <hr className="border-border my-8" />
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="font-system text-sm bg-secondary px-1.5 py-0.5 rounded text-primary">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
