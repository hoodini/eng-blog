'use client';

import Link from 'next/link';
import { Post } from '@/lib/posts';
import { format } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <article className="group h-full glass-effect rounded-2xl overflow-hidden hover-lift">
        {/* Image */}
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-md bg-white/5 text-xs font-medium text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <time dateTime={post.date}>
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </time>
            {post.readingTime && <span>{post.readingTime} min read</span>}
          </div>
        </div>
      </article>
    </Link>
  );
}
