'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from './PostCard';
import SectionHeader from './SectionHeader';
import { Post } from '@/lib/posts';

interface PostGridProps {
  posts: Post[];
  title?: string;
}

const tags = ['All', 'AI', 'Automation', 'Code', 'AWS', 'GenAI', 'Tutorials'];

export default function PostGrid({ posts, title = "Latest Stories" }: PostGridProps) {
  const [selectedTag, setSelectedTag] = useState('All');

  const filteredPosts = selectedTag === 'All'
    ? posts
    : posts.filter(post => post.tags?.some(tag => tag.toLowerCase() === selectedTag.toLowerCase()));

  return (
    <section id="articles" className="py-12 border-b border-[var(--card-border)] mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">{title}</h2>

        {/* Tags */}
        <div className="overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${selectedTag === tag
                  ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                  : 'bg-transparent text-[var(--muted)] border-transparent hover:bg-gray-100 hover:text-[var(--foreground)]'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="min-h-[400px]">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            <AnimatePresence mode='popLayout'>
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-[var(--muted)] text-lg">No stories found for this category.</p>
            <button
              onClick={() => setSelectedTag('All')}
              className="mt-4 text-[#0071e3] font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
