import { marked } from "marked";

export function MarkdownBody({ content }: { content: string }) {
  const html = marked(content);

  return (
    <div
      className="article-content mt-[18px]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
