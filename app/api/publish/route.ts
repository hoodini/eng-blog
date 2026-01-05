import { NextRequest, NextResponse } from 'next/server';
import TurndownService from 'turndown';

// Rate limiting (simple in-memory implementation)
const requestLog = new Map<string, number[]>();
const RATE_LIMIT = 10; // Max 10 requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = requestLog.get(ip) || [];

  // Remove old requests outside the window
  const recentRequests = requests.filter(time => now - time < RATE_WINDOW);

  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }

  recentRequests.push(now);
  requestLog.set(ip, recentRequests);
  return true;
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function createMarkdownContent(postData: {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  date: string;
}): string {
  // Strip HTML from excerpt and create clean plain text
  const rawExcerpt = postData.excerpt || postData.content.slice(0, 300);
  const cleanExcerpt = stripHtml(rawExcerpt).slice(0, 160) + '...';
  
  // Escape quotes for YAML
  const escapedTitle = postData.title.replace(/"/g, '\\"');
  const escapedExcerpt = cleanExcerpt.replace(/"/g, '\\"');
  
  const frontmatter = `---
title: "${escapedTitle}"
date: "${postData.date}"
excerpt: "${escapedExcerpt}"
coverImage: "${postData.coverImage || ''}"
tags: [${(postData.tags || []).map(t => `"${t}"`).join(', ')}]
author: "Yuval Avidani"
---

${postData.content}`;

  return frontmatter;
}

async function createGitHubFile(
  fileName: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'hoodini';
  const repo = process.env.GITHUB_REPO || 'eng-blog';
  const branch = process.env.GITHUB_BRANCH || 'master';

  if (!token) {
    return { success: false, error: 'GitHub token not configured' };
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/posts/${fileName}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        message: `Add new post: ${fileName}`,
        content: Buffer.from(content).toString('base64'),
        branch,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API error:', errorData);
      return { success: false, error: errorData.message || 'GitHub API error' };
    }

    return { success: true };
  } catch (error) {
    console.error('GitHub API request failed:', error);
    return { success: false, error: 'Failed to connect to GitHub API' };
  }
}

// Strip HTML tags and get plain text for excerpts
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp;
    .replace(/&amp;/g, '&') // Replace &amp;
    .replace(/&lt;/g, '<') // Replace &lt;
    .replace(/&gt;/g, '>') // Replace &gt;
    .replace(/&quot;/g, '"') // Replace &quot;
    .replace(/&#39;/g, "'") // Replace &#39;
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Convert HTML to Markdown
function htmlToMarkdown(html: string): string {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  });

  // Add custom rule for code blocks to preserve them
  turndownService.addRule('codeBlock', {
    filter: ['code'],
    replacement: function(content, node) {
      // If it's a block-level code element, wrap in triple backticks
      if ((node as HTMLElement).parentElement?.tagName === 'P') {
        return '\n```\n' + content + '\n```\n';
      }
      return '`' + content + '`';
    }
  });

  return turndownService.turndown(html);
}

// Check if content looks like HTML
function isHtmlContent(content: string): boolean {
  // Check for common HTML tags
  return /<(p|h[1-6]|div|span|a|ul|ol|li|strong|em|br)\b/i.test(content);
}

// Extract post data from different formats
function extractPostData(body: any): {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  slug?: string;
} | null {
  // Format 1: Direct format (title, content in root)
  if (body.title && body.content) {
    // Convert HTML to Markdown if content looks like HTML
    const content = isHtmlContent(body.content) 
      ? htmlToMarkdown(body.content) 
      : body.content;
    
    return {
      title: body.title,
      content,
      excerpt: body.excerpt,
      coverImage: body.coverImage,
      tags: body.tags,
      slug: body.slug,
    };
  }

  // Format 2: Make.com format with jsonResponse.ghost
  if (body.jsonResponse?.ghost) {
    const ghost = body.jsonResponse.ghost;
    return {
      title: ghost.title,
      content: ghost.html ? htmlToMarkdown(ghost.html) : '',
      excerpt: ghost.custom_excerpt,
      coverImage: ghost.cover_image || ghost.coverImage,
      tags: ghost.tags,
      slug: ghost.slug,
    };
  }

  // Format 3: Nested ghost object
  if (body.ghost) {
    return {
      title: body.ghost.title,
      content: body.ghost.html ? htmlToMarkdown(body.ghost.html) : '',
      excerpt: body.ghost.custom_excerpt,
      coverImage: body.ghost.cover_image || body.ghost.coverImage,
      tags: body.ghost.tags,
      slug: body.ghost.slug,
    };
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 10 posts per hour.' },
        { status: 429 }
      );
    }

    // Verify API key
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.PUBLISH_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid API key.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Extract post data from various formats
    const postData = extractPostData(body);

    // Validate required fields
    if (!postData || !postData.title || !postData.content) {
      return NextResponse.json(
        { error: 'Missing required fields: title and content are required.' },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (postData.title.length > 200) {
      return NextResponse.json(
        { error: 'Title too long. Maximum 200 characters.' },
        { status: 400 }
      );
    }

    if (postData.content.length > 100000) {
      return NextResponse.json(
        { error: 'Content too long. Maximum 100KB.' },
        { status: 400 }
      );
    }

    // Sanitize tags
    const tags = Array.isArray(postData.tags)
      ? postData.tags.filter((tag: string) => typeof tag === 'string').slice(0, 10)
      : [];

    // Generate slug and date
    const slug = postData.slug || createSlug(postData.title);

    // Parse date - handle ISO timestamps or date strings, extract just YYYY-MM-DD
    let date: string;
    if (body.date) {
      // If it's an ISO timestamp like "2026-01-04T22:03:05.457Z", extract just the date
      const dateMatch = body.date.match(/^\d{4}-\d{2}-\d{2}/);
      date = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];
    } else {
      date = new Date().toISOString().split('T')[0];
    }

    const fileName = `${date}-${slug}.md`;

    // Create markdown content
    const markdownContent = createMarkdownContent({
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      coverImage: postData.coverImage,
      tags,
      date,
    });

    // Create file in GitHub
    const result = await createGitHubFile(fileName, markdownContent);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create post in repository.' },
        { status: 500 }
      );
    }

    console.log(`Post published via GitHub API: ${slug}`);

    return NextResponse.json({
      success: true,
      slug,
      message: 'Post published successfully! Site will redeploy shortly.',
      url: `/posts/${date}-${slug}`,
    });

  } catch (error) {
    console.error('Error publishing post:', error);
    return NextResponse.json(
      { error: 'Internal server error. Failed to publish post.' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Publish API is running',
    timestamp: new Date().toISOString(),
  });
}
