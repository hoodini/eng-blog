# Security Setup Guide

## Your Generated API Secret

**IMPORTANT: Save this secret securely!**

```
7bacb71dab674a5915f497d3dd436682d4d742ab543494c62587d419c667b67a
```

⚠️ **Never commit this secret to Git or share it publicly!**

---

## Step 1: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Import repository: `hoodini/eng-blog`
4. **Before deploying**, add environment variable:
   - **Name**: `PUBLISH_SECRET`
   - **Value**: `7bacb71dab674a5915f497d3dd436682d4d742ab543494c62587d419c667b67a`
   - **Environment**: Production, Preview, Development (select all)
5. Click **Deploy**

---

## Step 2: Configure Make.com Webhook

Once your blog is deployed, update your Make.com scenario:

### HTTP Module Settings:

**URL:**
```
https://your-blog-name.vercel.app/api/publish
```

**Method:** `POST`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "x-api-key": "7bacb71dab674a5915f497d3dd436682d4d742ab543494c62587d419c667b67a"
}
```

**Body (Raw JSON):**
```json
{
  "title": "{{article.title}}",
  "content": "{{article.content}}",
  "excerpt": "{{article.excerpt}}",
  "coverImage": "{{article.image}}",
  "tags": ["ai", "automation", "code"],
  "date": "{{formatDate(now, 'YYYY-MM-DD')}}"
}
```

---

## Step 3: Test the Webhook

### Test with curl:

```bash
curl -X POST https://your-blog-name.vercel.app/api/publish \
  -H "Content-Type: application/json" \
  -H "x-api-key: 7bacb71dab674a5915f497d3dd436682d4d742ab543494c62587d419c667b67a" \
  -d '{
    "title": "Test Post",
    "content": "This is a test post from Make.com automation.",
    "excerpt": "Testing the automated blog posting.",
    "tags": ["test", "automation"]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "slug": "test-post",
  "message": "Post published successfully!",
  "url": "/posts/test-post"
}
```

---

## Security Features Enabled

✅ **API Key Authentication**
- Only requests with correct `x-api-key` header are accepted
- Secret stored securely in Vercel environment variables

✅ **Rate Limiting**
- Maximum 10 posts per hour per IP address
- Prevents spam and abuse

✅ **Input Validation**
- Title: Max 200 characters
- Content: Max 100KB
- Tags: Max 10 tags, sanitized
- Required fields: title, content

✅ **HTML Sanitization**
- All content sanitized with DOMPurify
- Prevents XSS attacks

✅ **HTTPS Only**
- Vercel enforces HTTPS
- All data encrypted in transit

✅ **Git Version Control**
- All posts tracked in Git
- Easy to revert changes
- Full audit trail

---

## Security Best Practices

### DO:
- ✅ Keep your API secret safe
- ✅ Use HTTPS only (enforced by Vercel)
- ✅ Monitor Vercel logs regularly
- ✅ Rotate secret every 6-12 months
- ✅ Use environment variables (never hardcode)

### DON'T:
- ❌ Commit `.env.local` to Git
- ❌ Share API key in screenshots
- ❌ Use simple/guessable secrets
- ❌ Expose secret in client-side code
- ❌ Share secret via email or Slack

---

## Monitoring & Alerts

### View Logs in Vercel:
1. Go to your project in Vercel
2. Click **"Logs"** tab
3. Filter by `/api/publish` to see all publish attempts

### What to Watch For:
- Multiple failed authentication attempts (401 errors)
- Rate limit hits (429 errors)
- Unusual posting patterns
- Posts from unexpected IPs

---

## Rotating Your Secret

If you need to change your secret:

1. Generate new secret:
   ```bash
   openssl rand -hex 32
   ```

2. Update in Vercel:
   - Go to Project Settings → Environment Variables
   - Edit `PUBLISH_SECRET`
   - Save and redeploy

3. Update in Make.com:
   - Edit HTTP module
   - Update `x-api-key` header
   - Test the connection

---

## Troubleshooting

### Error: 401 Unauthorized
- Check that `x-api-key` header is included
- Verify secret matches exactly (no extra spaces)
- Ensure environment variable is set in Vercel

### Error: 429 Rate Limit Exceeded
- You've hit 10 posts per hour
- Wait for rate limit window to reset
- Contact admin if you need higher limits

### Error: 400 Bad Request
- Check JSON format is valid
- Ensure `title` and `content` are provided
- Verify field lengths (title < 200 chars, content < 100KB)

### Error: 500 Internal Server Error
- Check Vercel logs for details
- Verify environment variables are set
- Contact support if issue persists

---

## Support

For issues or questions:
- Check Vercel logs first
- Review Make.com execution history
- Test with curl to isolate the problem
- Check GitHub repo for recent changes

---

**Generated:** 2026-01-04
**Secret Generated:** `7bacb71dab674a5915f497d3dd436682d4d742ab543494c62587d419c667b67a`

⚠️ **Keep this file secure! It contains your API secret.**
