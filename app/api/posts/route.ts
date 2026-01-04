import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostApiResponse {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  author?: string;
  url: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    // Read all markdown files from posts directory
    const fileNames = fs.readdirSync(postsDirectory);
    
    const posts: PostApiResponse[] = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Get the base URL from environment or default
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eng.yuv.ai';

        return {
          slug,
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString().split('T')[0],
          excerpt: data.excerpt || content.slice(0, 160).replace(/\n/g, ' ') + '...',
          coverImage: data.coverImage || undefined,
          tags: data.tags || [],
          author: data.author || 'Yuval Avidani',
          url: `${baseUrl}/posts/${slug}`,
        };
      })
      // Sort by date (newest first)
      .sort((a, b) => (a.date > b.date ? -1 : 1))
      // Limit results
      .slice(0, limit);

    return NextResponse.json({
      posts,
      total: posts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
