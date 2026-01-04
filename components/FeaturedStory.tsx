import Link from 'next/link';
import { Post } from '@/lib/posts';

interface FeaturedStoryProps {
    post: Post;
}

export default function FeaturedStory({ post }: FeaturedStoryProps) {
    return (
        <Link href={`/posts/${post.slug}`} className="group block mb-16">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-[var(--card-border)] group-hover:shadow-2xl transition-all duration-500 ease-out">
                <div className="grid md:grid-cols-12 gap-0">

                    {/* Use different layouts based on image availability, here assuming image is always present or fallback */}
                    <div className="md:col-span-8 relative h-[400px] md:h-[500px] overflow-hidden">
                        {post.coverImage ? (
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white text-6xl font-bold opacity-20">Art</span>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-4 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {post.tags && post.tags.length > 0 && (
                            <span className="text-xs font-bold tracking-wider uppercase text-[#0071e3] mb-3">
                                {post.tags[0]}
                            </span>
                        )}

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-[var(--foreground)] mb-4 group-hover:text-[#0071e3] transition-colors">
                            {post.title}
                        </h2>

                        {post.excerpt && (
                            <p className="text-[var(--muted)] text-lg leading-relaxed mb-6 line-clamp-3">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="flex items-center text-sm font-medium text-[var(--muted)] mt-auto">
                            <span className="text-[var(--foreground)]">{post.author || 'Yuval Avidani'}</span>
                            <span className="mx-2">•</span>
                            <span>{post.date}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
