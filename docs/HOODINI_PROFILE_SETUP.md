# English Blog Integration for GitHub Profile

This guide explains how to add English blog posts from `eng.yuv.ai` to your GitHub profile README (hoodini/hoodini repo), displayed above the existing Hebrew posts.

## Overview

The updated `update-blog.ts` script will:
1. **Fetch English posts** from `https://eng.yuv.ai/api/posts` (public API, no key needed)
2. **Fetch Hebrew posts** from Ghost blog (existing setup)
3. **Display English posts FIRST**, then Hebrew posts

## Setup Instructions

### Step 1: Update the Script in hoodini/hoodini Repo

Replace the contents of `scripts/update-blog.ts` in your hoodini/hoodini repository with the contents of `docs/update-blog-for-hoodini-repo.ts` from this project.

You can do this by:
1. Going to https://github.com/hoodini/hoodini/edit/main/scripts/update-blog.ts
2. Copying the content from `docs/update-blog-for-hoodini-repo.ts`
3. Pasting and committing the changes

### Step 2: No Additional Secrets Needed

The English blog API at `eng.yuv.ai/api/posts` is public and doesn't require any API key.

Your existing `GHOST_API_KEY` secret will continue to work for Hebrew posts.

### Step 3: Test the Workflow

1. Go to your repository's **Actions** tab
2. Find the "Update Blog Posts" workflow
3. Click **Run workflow**
4. Check the results in your README

## How It Works

The script fetches posts from both sources in parallel:

```
eng.yuv.ai/api/posts?limit=5  →  English posts (shown first)
yuv-ai.ghost.io/ghost/api/... →  Hebrew posts (shown second)
```

The README will display:

```markdown
## 📝 Latest Blog Posts

### 🇺🇸 English Posts
[Table with English posts from eng.yuv.ai]

### 🇮🇱 Hebrew Posts (עברית)
[Table with Hebrew posts from blog.yuv.ai]
```

## API Endpoint Details

Your eng.yuv.ai blog exposes posts at:

**GET** `https://eng.yuv.ai/api/posts`

Query Parameters:
- `limit` (optional): Number of posts to return (default: 5)

Response:
```json
{
  "posts": [
    {
      "slug": "2026-01-04-pathway-the-python-framework",
      "title": "Pathway: The Python Framework...",
      "date": "2026-01-04",
      "excerpt": "...",
      "coverImage": "...",
      "tags": ["AI", "Python"],
      "author": "Yuval Avidani",
      "url": "https://eng.yuv.ai/posts/..."
    }
  ],
  "total": 5,
  "timestamp": "2026-01-05T..."
}
```

## Customization

In the updated script, you can adjust:

- `MAX_POSTS`: Number of posts per section (default: 5)
- `ENG_BLOG_API_URL`: English blog API URL
- Section titles and emojis in `formatPostsSection()`

## Troubleshooting

### English posts not showing
- Verify eng.yuv.ai is deployed and accessible
- Check that `/api/posts` returns valid JSON
- Look at GitHub Actions logs for errors

### Hebrew posts not showing
- Verify your `GHOST_API_KEY` is still valid
- Check the Ghost blog is accessible

### Both sections empty
- Check the GitHub Actions workflow logs
- Verify network connectivity from GitHub Actions
