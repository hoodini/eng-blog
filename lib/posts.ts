import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  author?: string;
  readingTime?: number;
}

// Ensure posts directory exists
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true });
}

// Helper to strip date prefix from filename (e.g., "2026-01-05-my-post" -> "my-post")
function stripDatePrefix(filename: string): { slug: string; hasDatePrefix: boolean } {
  const datePattern = /^(\d{4}-\d{2}-\d{2})-(.+)$/;
  const match = filename.match(datePattern);
  if (match) {
    return { slug: match[2], hasDatePrefix: true };
  }
  return { slug: filename, hasDatePrefix: false };
}

// Find the actual filename for a given slug (handles both date-prefixed and plain filenames)
export function findPostFile(slug: string): string | null {
  const fileNames = fs.readdirSync(postsDirectory);
  
  // First, try exact match
  if (fileNames.includes(`${slug}.md`)) {
    return `${slug}.md`;
  }
  
  // Then, look for date-prefixed files that match the slug
  for (const fileName of fileNames) {
    if (fileName.endsWith('.md')) {
      const baseName = fileName.replace(/\.md$/, '');
      const { slug: strippedSlug } = stripDatePrefix(baseName);
      if (strippedSlug === slug) {
        return fileName;
      }
    }
  }
  
  return null;
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = await Promise.all(
      fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map(async (fileName) => {
          const baseName = fileName.replace(/\.md$/, '');
          const { slug, hasDatePrefix } = stripDatePrefix(baseName);
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data, content } = matter(fileContents);

          // Calculate reading time (average 200 words per minute)
          const words = content.trim().split(/\s+/).length;
          const readingTime = Math.ceil(words / 200);

          return {
            slug,
            title: data.title || 'Untitled',
            date: data.date || new Date().toISOString().split('T')[0],
            excerpt: data.excerpt || content.slice(0, 160) + '...',
            content,
            coverImage: data.coverImage,
            tags: data.tags || [],
            author: data.author || 'Yuval Avidani',
            readingTime,
            _hasDatePrefix: hasDatePrefix, // Internal flag for sorting
          };
        })
    );

    // Sort posts by date (newest first)
    // For posts with same date, prioritize date-prefixed files (from automation) as they are newer
    return allPostsData.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date > b.date ? -1 : 1;
      }
      // For same dates, prefer date-prefixed files (automated posts)
      const aHasDatePrefix = (a as any)._hasDatePrefix;
      const bHasDatePrefix = (b as any)._hasDatePrefix;
      if (aHasDatePrefix && !bHasDatePrefix) return -1;
      if (!aHasDatePrefix && bHasDatePrefix) return 1;
      // If both have or both lack date prefix, sort by slug descending
      return a.slug > b.slug ? -1 : 1;
    });
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fileName = findPostFile(slug);
    if (!fileName) {
      return null;
    }
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Convert markdown to HTML
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    // Calculate reading time
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      excerpt: data.excerpt || content.slice(0, 160) + '...',
      content: contentHtml,
      coverImage: data.coverImage,
      tags: data.tags || [],
      author: data.author || 'Yuval Avidani',
      readingTime,
    };
  } catch (error) {
    console.error('Error reading post:', error);
    return null;
  }
}

export async function createPost(postData: {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  date?: string;
}): Promise<string> {
  const slug = postData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const date = postData.date || new Date().toISOString().split('T')[0];
  const fileName = `${date}-${slug}.md`;
  const filePath = path.join(postsDirectory, fileName);

  const frontmatter = {
    title: postData.title,
    date,
    excerpt: postData.excerpt || postData.content.slice(0, 160) + '...',
    coverImage: postData.coverImage || '',
    tags: postData.tags || [],
    author: 'Yuval Avidani',
  };

  const fileContent = matter.stringify(postData.content, frontmatter);
  fs.writeFileSync(filePath, fileContent);

  return slug;
}
