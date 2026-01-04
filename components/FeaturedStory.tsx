import Link from 'next/link';
import { Post } from '@/lib/posts';

interface FeaturedStoryProps {
    post: Post;
}

export default function FeaturedStory({ post }: FeaturedStoryProps) {
    return (
        <Link href={`/posts/${post.slug}`} className="group block mb-16">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-[var(--card-border)] group-hover:shadow-2xl transition-all duration-500 ease-out">
                <div className="grid lg:grid-cols-2 gap-0">

                    {/* Image Section - Equal width on large screens */}
                    <div className="relative h-[300px] sm:h-[400px] lg:h-[550px] overflow-hidden">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Content Section - Equal width on large screens */}
                    <div className="p-8 sm:p-10 lg:p-14 flex flex-col justify-center bg-white relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {post.tags && post.tags.length > 0 && (
                            <span className="inline-block text-xs font-bold tracking-wider uppercase text-white bg-[#0071e3] px-3 py-1 rounded-full mb-4 w-fit">
                                {post.tags[0]}
                            </span>
                        )}

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.15] text-[var(--foreground)] mb-5 group-hover:text-[#0071e3] transition-colors">
                            {post.title}
                        </h2>

                        {post.excerpt && (
                            <p className="text-[var(--muted)] text-base sm:text-lg leading-relaxed mb-6 line-clamp-4">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="flex items-center text-sm font-medium text-[var(--muted)] mt-auto pt-4 border-t border-[var(--card-border)]">
                            <span className="text-[var(--foreground)] font-semibold">{post.author || 'Yuval Avidani'}</span>
                            <span className="mx-2">•</span>
                            <span>{post.date}</span>
                            <span className="ml-auto text-[#0071e3] group-hover:translate-x-1 transition-transform duration-300">Read →</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
