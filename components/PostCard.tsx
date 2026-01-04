'use client';

import Link from 'next/link';
import { Post } from '@/lib/posts';

interface PostCardProps {
  post: Post;
  className?: string; // Allow custom classes
}

export default function PostCard({ post, className = '' }: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`group flex flex-col h-full apple-card ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-4xl"></span>
          </div>
        )}

        {/* Floating Tag */}
        {post.tags && post.tags.length > 0 && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#1d1d1f]">
              {post.tags[0]}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
          <time dateTime={post.date}>{post.date}</time>
          <span>•</span>
          <span>{post.readingTime} min read</span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-[var(--foreground)] mb-3 leading-snug group-hover:text-[#0071e3] transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-[var(--muted)] line-clamp-3 mb-4 flex-grow">
          {post.excerpt}
        </p>

        {/* Author or Footer of card */}
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
          <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden">
            {/* Placeholder avatar or author image if available */}
            <div className="w-full h-full bg-gradient-to-tr from-blue-400 to-emerald-400"></div>
          </div>
          <span className="text-xs font-semibold text-[var(--foreground)]">{post.author}</span>
        </div>
      </div>
    </Link>
  );
}
