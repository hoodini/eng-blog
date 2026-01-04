import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '@/lib/posts';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
      ? body.tags.filter((tag: any) => typeof tag === 'string').slice(0, 10)
      : [];

    // Create the post
    const slug = await createPost({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      coverImage: body.coverImage,
      tags,
      date: body.date,
    });

    // Git commit and push (if in production)
    if (process.env.NODE_ENV === 'production' || process.env.AUTO_COMMIT === 'true') {
      try {
        const fileName = `${body.date || new Date().toISOString().split('T')[0]}-${slug}.md`;
        await execAsync(`git add posts/${fileName}`);
        await execAsync(`git commit -m "Add new post: ${body.title}"`);
        await execAsync('git push origin main');

        console.log(`Post published and pushed to GitHub: ${slug}`);
      } catch (gitError) {
        console.error('Git operation failed:', gitError);
        // Don't fail the request if git fails
      }
    }

    return NextResponse.json({
      success: true,
      slug,
      message: 'Post published successfully!',
      url: `/posts/${slug}`,
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
