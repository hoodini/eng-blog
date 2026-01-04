import Link from 'next/link';
import { Post } from '@/lib/posts';
import SectionHeader from './SectionHeader';

interface InTheLoopProps {
    posts: Post[];
}

export default function InTheLoop({ posts }: InTheLoopProps) {
    return (
        <section className="py-12 border-b border-[var(--card-border)]">
            <SectionHeader title="In the Loop" action={{ label: 'See All', href: '/archive' }} />

            <div className="overflow-x-auto pb-6 scrollbar-hide">
                <div className="flex gap-5 w-max pl-5 sm:pl-6 md:pl-8 pr-5 sm:pr-6 md:pr-8">
                    {posts.slice(0, 5).map((post) => (
                        <Link
                            key={post.slug}
                            href={`/posts/${post.slug}`}
                            className="group flex flex-col w-[280px] md:w-[320px] bg-white rounded-xl border border-[var(--card-border)] overflow-hidden transition-all hover:shadow-lg"
                        >
                            <div className="h-40 bg-gray-100 relative overflow-hidden">
                                {post.coverImage && (
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase text-[#0071e3] tracking-wider">
                                    {post.tags?.[0] || 'Update'}
                                </span>
                                <h3 className="text-base font-bold text-[var(--foreground)] line-clamp-2 leading-snug">
                                    {post.title}
                                </h3>
                                <span className="text-xs text-[var(--muted)] mt-1">{post.date}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
