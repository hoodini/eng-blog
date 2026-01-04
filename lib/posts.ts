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

export async function getAllPosts(): Promise<Post[]> {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = await Promise.all(
      fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map(async (fileName) => {
          const slug = fileName.replace(/\.md$/, '');
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
          };
        })
    );

    // Sort posts by date (newest first)
    return allPostsData.sort((a, b) => (a.date > b.date ? -1 : 1));
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
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
