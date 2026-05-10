import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PostsFilter } from "./posts-filter";

export const metadata: Metadata = {
  title: "文章",
  description: "林方浩的博客文章列表",
};

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function PostsPage() {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  return (
    <>
      <ScrollReveal>
        <section className="panel border border-line rounded-2xl bg-surface p-[clamp(22px,3.6vw,38px)]">
          <div className="flex justify-between items-baseline gap-3">
            <p className="m-0 text-[0.78rem] tracking-[0.2em] text-accent-2">
              POSTS
            </p>
            <h1 className="font-serif">文章</h1>
          </div>
          <p className="text-muted leading-[1.84]">这是我的文章列表。</p>
        </section>
      </ScrollReveal>

      <PostsFilter posts={posts} allTags={tags} />
    </>
  );
}
