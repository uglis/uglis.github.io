import { HomeViewSwitcher } from "@/components/home-view-switcher";
import { getAllPosts } from "@/lib/posts";
import { getAllMoments } from "@/lib/moments";

export default async function HomePage() {
  const posts = await getAllPosts();
  const moments = await getAllMoments();

  return <HomeViewSwitcher posts={posts} moments={moments} />;
}
