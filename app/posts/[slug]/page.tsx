import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MarkdownBody } from "@/components/markdown-body";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "404" };
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <section className="terminal-window max-w-[900px] mx-auto">
      <div className="terminal-header">
        <span className="terminal-dot red" />
        <span className="terminal-dot yellow" />
        <span className="terminal-dot green" />
        <span className="terminal-title">
          uglis@home:~/posts/{slug}.md
        </span>
      </div>
      <div className="terminal-body">
        <div className="cmd-line mb-4">
          <span className="cmd-prompt">$ </span>
          <span className="cmd-command">cat posts/{slug}.md | head -1</span>
        </div>

        <p className="text-accent-green text-xs font-mono mb-1">
          [{post.date}] / {post.slug}
        </p>
        <h1 className="text-accent font-mono text-[clamp(1.2rem,3vw,1.6rem)] mt-0 mb-4">
          {post.title}
        </h1>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {post.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover}
            alt={post.title}
            className="w-full max-h-[400px] object-contain rounded border border-line mb-4"
            loading="lazy"
          />
        )}

        <div className="border-t border-line pt-4">
          <MarkdownBody content={post.content} />
        </div>

        <div className="mt-8 pt-4 border-t border-line">
          <Link href="/posts" className="text-xs text-accent-green hover:underline no-underline font-mono">
            $ cd ../ &larr; back to posts
          </Link>
        </div>
      </div>
    </section>
  );
}
