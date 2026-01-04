import { getAllPosts } from '@/lib/posts';
import Hero from '@/components/Hero';
import PostGrid from '@/components/PostGrid';
import Footer from '@/components/Footer';

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <Hero />
      <PostGrid posts={posts} />
      <Footer />
    </main>
  );
}
