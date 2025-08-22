import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

const components = {
  code: ({ className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    
    return match ? (
      <SyntaxHighlighter
        style={tomorrow}
        language={language}
        PreTag="div"
        className="rounded-lg overflow-x-auto"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-6 py-2 bg-blue-50 dark:bg-blue-900/20">
      <div className="text-blue-800 dark:text-blue-200 italic">
        {children}
      </div>
    </blockquote>
  ),
  h1: ({ children }: any) => (
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
      {children}
    </p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside mb-4 text-gray-600 dark:text-gray-300 space-y-2">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside mb-4 text-gray-600 dark:text-gray-300 space-y-2">
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li className="mb-1">{children}</li>
  ),
  a: ({ href, children }: any) => (
    <a 
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  img: ({ src, alt }: any) => (
    <img 
      src={src}
      alt={alt}
      className="w-full rounded-lg shadow-lg my-6"
    />
  ),
};

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert prose-blue max-w-none">
      <MDXRemote {...source} components={components} />
    </div>
  );
}
