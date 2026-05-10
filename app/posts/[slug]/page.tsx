import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MarkdownBody } from "@/components/markdown-body";
import { ScrollReveal } from "@/components/scroll-reveal";

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
  if (!post) return { title: "文章未找到" };
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
    <ScrollReveal>
      <article className="panel max-w-[860px] mx-auto border border-line rounded-2xl bg-surface p-[clamp(22px,3.6vw,38px)]">
        <p className="text-accent-2 text-[0.8rem] tracking-[0.08em]">
          {post.date}
        </p>
        <h1 className="font-serif mt-2 text-[clamp(1.6rem,4vw,2.5rem)]">
          {post.title}
        </h1>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-[6px] mt-[10px]">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-accent text-[0.76rem] tracking-[0.06em] border border-accent/25 rounded-full px-[10px] py-1 bg-[rgba(14,22,36,0.7)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover}
            alt={post.title}
            className="w-full max-h-[min(70vh,680px)] h-auto rounded-[14px] mt-4 object-contain object-center bg-[rgba(8,12,20,0.92)]"
            loading="lazy"
          />
        )}

        <MarkdownBody content={post.content} />

        <p className="mt-6">
          <Link
            href="/posts"
            className="text-accent no-underline hover:underline"
          >
            &larr; 返回文章列表
          </Link>
        </p>
      </article>
    </ScrollReveal>
  );
}
