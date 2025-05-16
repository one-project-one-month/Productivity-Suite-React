import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGFM from 'remark-gfm';
import 'katex/dist/katex.min.css';

interface MarkdownPreviewProps {
  title: string;
  content: string;
}

const MarkdownPreview = ({ title, content }: MarkdownPreviewProps) => {
  return (
    <div className="markdown-preview p-4 overflow-y-auto h-full w-full">
      <h1 className="text-2xl font-bold mb-4 text-note-purple">
        {title || 'Untitled Note'}
      </h1>
      {content ? (
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGFM]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {content}
        </ReactMarkdown>
      ) : (
        <div className="text-muted-foreground italic">
          No content to preview
        </div>
      )}
    </div>
  );
};

export default MarkdownPreview;
