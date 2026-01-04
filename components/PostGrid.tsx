'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard';
import { Post } from '@/lib/posts';

interface PostGridProps {
  posts: Post[];
}

const tags = ['All', 'AI', 'Automation', 'Code', 'AWS', 'GenAI', 'Tutorials'];

export default function PostGrid({ posts }: PostGridProps) {
  const [selectedTag, setSelectedTag] = useState('All');

  const filteredPosts = selectedTag === 'All'
    ? posts
    : posts.filter(post => post.tags?.includes(selectedTag.toLowerCase()));

  return (
    <section id="articles" className="relative py-20 px-6 sm:px-8 max-w-7xl mx-auto">

      {/* Header - Left Aligned, Clean */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8 border-b border-[#d2d2d7] pb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight">
          Latest Stories
        </h2>

        {/* Minimal Scrollable Tags */}
        <div className="overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${selectedTag === tag
                    ? 'bg-[#1d1d1f] text-white'
                    : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#e8e8ed]'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <PostCard post={post} featured={index === 0 && selectedTag === 'All'} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center">
          <p className="text-[#86868b] text-lg">No stories found for this category.</p>
        </div>
      )}
    </section>
  );
}
