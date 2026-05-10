import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  content: string;
  cover: string;
}

function formatDate(d: unknown): string {
  if (!d) return "";
  if (d instanceof Date) {
    return d.toISOString().slice(0, 10);
  }
  return String(d);
}

const postsDir = path.join(process.cwd(), "content/posts");

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug: data.slug || file.replace(/\.md$/, ""),
      title: data.title || "Untitled",
      date: formatDate(data.date),
      summary: data.summary || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      content,
      cover: data.cover || "",
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      if (tag) tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}
