import { Terminal } from "@/components/terminal";
import { getAllPosts } from "@/lib/posts";
import { getAllMoments } from "@/lib/moments";

export default async function HomePage() {
  const posts = await getAllPosts();
  const moments = await getAllMoments();

  return <Terminal posts={posts} moments={moments} />;
}
