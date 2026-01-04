import { NextRequest, NextResponse } from 'next/server';

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
  const frontmatter = `---
title: "${postData.title.replace(/"/g, '\\"')}"
date: "${postData.date}"
excerpt: "${(postData.excerpt || postData.content.slice(0, 160) + '...').replace(/"/g, '\\"')}"
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

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: title and content are required.' },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (body.title.length > 200) {
      return NextResponse.json(
        { error: 'Title too long. Maximum 200 characters.' },
        { status: 400 }
      );
    }

    if (body.content.length > 100000) {
      return NextResponse.json(
        { error: 'Content too long. Maximum 100KB.' },
        { status: 400 }
      );
    }

    // Sanitize tags
    const tags = Array.isArray(body.tags)
      ? body.tags.filter((tag: string) => typeof tag === 'string').slice(0, 10)
      : [];

    // Generate slug and date
    const slug = createSlug(body.title);
    const date = body.date || new Date().toISOString().split('T')[0];
    const fileName = `${date}-${slug}.md`;

    // Create markdown content
    const markdownContent = createMarkdownContent({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      coverImage: body.coverImage,
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
