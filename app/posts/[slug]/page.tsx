import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import Footer from '@/components/Footer';
import AuthorCard from '@/components/AuthorCard';
import DOMPurify from 'isomorphic-dompurify';
import ScrollProgress from '@/components/ScrollProgress';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Yuval Avidani`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'Yuval Avidani'],
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Sanitize HTML content to prevent XSS
  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <>
      <ScrollProgress />
      <article className="min-h-screen bg-white pt-32 pb-24">
        {/* Header Section */}
        <div className="container-width mb-16">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[#0071e3] transition-colors mb-10 group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Newsroom
          </Link>

          <div className="flex items-center gap-3 text-sm font-bold tracking-wide uppercase text-[#0071e3] mb-6">
            {post.tags && post.tags.length > 0 ? post.tags[0] : 'Article'}
          </div>

          <h1 className="headline-medium md:text-5xl lg:text-6xl text-[var(--foreground)] leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-6">
            <div className="flex items-center gap-3">
              <span className="text-[var(--foreground)] font-semibold text-base">
                {post.author || 'Yuval Avidani'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-[var(--muted)] font-medium">
              <time dateTime={post.date}>
                {format(new Date(post.date), 'MMMM d, yyyy')}
              </time>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </div>

        {/* Cover Image - Wide */}
        {post.coverImage && (
          <div className="container-width mb-16">
            <div className="aspect-[21/9] relative overflow-hidden rounded-2xl shadow-sm border border-[var(--card-border)]">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="container-width">
          <div
            className="prose prose-lg prose-slate max-w-none 
              prose-headings:text-[var(--foreground)] prose-headings:font-semibold prose-headings:tracking-tight
              prose-p:leading-8 prose-p:text-[1.125rem] prose-p:text-[#333336]
              prose-a:text-[#0071e3] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[var(--foreground)] prose-strong:font-semibold
              prose-code:text-[#d63384] prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-code:text-[0.9em]
              prose-pre:bg-[#f5f5f7] prose-pre:border prose-pre:border-[var(--card-border)] prose-pre:rounded-xl prose-pre:text-[#1d1d1f]
              prose-img:rounded-xl prose-img:shadow-lg
              prose-blockquote:border-l-[4px] prose-blockquote:border-[#1d1d1f] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[var(--muted)]
              prose-ul:text-[#333336] prose-ol:text-[#333336]
              prose-li:marker:text-[var(--muted)]"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
          {/* Author Card */}
          <div className="mt-16 pt-12 border-t border-[var(--card-border)]">
            <p className="text-sm font-semibold text-[var(--muted)] uppercase tracking-widest mb-6">
              Written by
            </p>
            <AuthorCard />
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
