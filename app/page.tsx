import { getAllPosts } from '@/lib/posts';
import FeaturedStory from '@/components/FeaturedStory';
import PostGrid from '@/components/PostGrid';
import InTheLoop from '@/components/InTheLoop';
import Footer from '@/components/Footer';

export default async function Home() {
  const posts = await getAllPosts();

  // Strategy:
  // 1. First post is Featured.
  // 2. Next 4 posts are "In the Loop" (Horizontal).
  // 3. Rest are "Latest Stories" (Grid).

  const featuredPost = posts[0];
  const loopPosts = posts.slice(1, 5);
  const remainingPosts = posts.slice(5);
  // If we don't have enough posts, just dump them all in grid or handle gracefully.
  // For now, let's just be smart: if few posts, just grid them.

  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      <div className="container-width">
        {/* Header Title */}
        <div className="py-8 border-b border-[var(--card-border)] mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="headline-large text-[var(--foreground)]">10x AI Newsroom</h1>
            <p className="mt-4 text-xl text-[var(--muted)] max-w-2xl">
              Insights on AI, automation, and code. Building generative AI solutions for the future.
            </p>
          </div>
        </div>

        {/* Featured Section */}
        {featuredPost && (
          <section className="mb-20">
            <FeaturedStory post={featuredPost} />
          </section>
        )}

        {/* In The Loop - Only if we have posts for it */}
        {loopPosts.length > 0 && (
          <InTheLoop posts={loopPosts} />
        )}

        {/* Latest Stories - Grid */}
        <div className="mt-20">
          {/* If we have remaining posts, show them. If loop was empty, show everything else from index 1 */}
          <PostGrid posts={remainingPosts.length > 0 ? remainingPosts : (loopPosts.length === 0 ? posts.slice(1) : [])} title="More Stories" />
        </div>
      </div>
      <Footer />
    </main>
  );
}
