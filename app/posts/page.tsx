import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { PostsFilter } from "./posts-filter";

export const metadata: Metadata = {
  title: "posts",
  description: "博客文章列表",
};

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function PostsPage() {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  return (
    <>
      <section className="terminal-window mb-3">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">uglis@home:~/posts</span>
        </div>
        <div className="terminal-body">
          <div className="cmd-line">
            <span className="cmd-prompt">$ </span>
            <span className="cmd-command">ls -la posts/</span>
          </div>
          <div className="cmd-output">
            total {posts.length} posts | tags: {tags.join(", ")}
          </div>
        </div>
      </section>

      <PostsFilter posts={posts} allTags={tags} />
    </>
  );
}
