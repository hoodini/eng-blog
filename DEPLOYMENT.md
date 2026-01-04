# Deployment Guide - Step by Step

## 🚀 Deploy to Vercel (5 minutes)

### Prerequisites
- GitHub account (✓ already set up)
- Repository pushed to GitHub: `hoodini/eng-blog` (✓ done)
- Vercel account (sign up at [vercel.com](https://vercel.com))

---

## Step 1: Create Vercel Account & Import Project

1. **Go to [vercel.com](https://vercel.com)**
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"
   - Authorize Vercel to access your repositories

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Find `hoodini/eng-blog` in the list
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

---

## Step 2: Add Environment Variable (CRITICAL!)

**Before deploying**, add your API secret:

1. Expand **"Environment Variables"** section
2. Add variable:
   - **Name**: `PUBLISH_SECRET`
   - **Value**: `7bacb71dab674a5915f497d3dd436682d4d742ab543494c62587d419c667b67a`
   - **Environment**: ☑ Production ☑ Preview ☑ Development (select all 3)
3. Click "Add"

⚠️ **IMPORTANT**: Without this, your webhook API won't work!

---

## Step 3: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll see: ✓ Deployment ready!

**Your blog is now live!** 🎉

You'll get a URL like: `https://eng-blog-hoodini.vercel.app`

---

## Step 4: Test Your Blog

1. **Visit your blog**: Click the deployment URL
2. **Check pages**:
   - Homepage: `https://your-blog.vercel.app/`
   - About: `https://your-blog.vercel.app/about`
   - Sample post: `https://your-blog.vercel.app/posts/2025-01-01-welcome-to-my-blog`

3. **Test API** (optional):
   ```bash
   curl https://your-blog.vercel.app/api/publish
   ```
   Should return: `{"status":"ok","message":"Publish API is running",...}`

---

## Step 5: Add Custom Domain (Optional)

If you want `blog.yourdomain.com`:

1. Go to **Project Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `blog.yourdomain.com`
4. Follow DNS instructions (add CNAME record)
5. Wait for SSL certificate (automatic)

---

## Step 6: Configure Make.com Webhook

Now that your blog is deployed, update Make.com:

### HTTP Module Configuration:

**URL:**
```
https://your-blog.vercel.app/api/publish
```
*(Replace `your-blog.vercel.app` with your actual Vercel URL)*

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
x-api-key: 7bacb71dab674a5915f497d3dd436682d4d742ab543494c62587d419c667b67a
```

**Body:**
```json
{
  "title": "{{1.title}}",
  "content": "{{1.content}}",
  "excerpt": "{{1.excerpt}}",
  "tags": ["ai", "automation", "code"],
  "date": "{{formatDate(now; YYYY-MM-DD)}}"
}
```

### Test the Webhook in Make.com:

1. Click **"Run once"** in your scenario
2. Check the HTTP module output
3. Should see: `{"success":true,"slug":"...","url":"..."}`
4. Visit your blog to see the new post!

---

## Step 7: Enable Auto-Commit (Optional)

To automatically commit new posts to GitHub:

1. Go to Vercel → Project Settings → Environment Variables
2. Add new variable:
   - **Name**: `AUTO_COMMIT`
   - **Value**: `true`
   - **Environment**: Production
3. Redeploy your project

Now every new post will be:
1. Created as markdown file
2. Committed to GitHub automatically
3. Available for Hoodini to read

---

## 🔒 Security Checklist

Before going live, verify:

- ✅ `PUBLISH_SECRET` is set in Vercel environment variables
- ✅ `.env.local` is NOT committed to Git (check `.gitignore`)
- ✅ API secret is stored securely (not in screenshots/emails)
- ✅ Make.com webhook uses correct secret
- ✅ HTTPS is enforced (automatic on Vercel)
- ✅ Rate limiting is working (10 posts/hour)

---

## 📊 Monitoring Your Blog

### View Deployment Logs:
1. Go to Vercel → Your Project → **"Deployments"**
2. Click any deployment
3. View **"Functions"** tab to see API calls
4. Filter by `/api/publish` to see webhook activity

### Check Build Status:
- Green ✓ = Successful
- Red ✗ = Failed (check logs)

### Monitor Usage:
- Vercel Dashboard shows bandwidth, function invocations
- Free tier limits:
  - 100 GB bandwidth/month
  - 100,000 function invocations/month
  - Plenty for a blog!

---

## 🐛 Troubleshooting

### "Build failed" error:
- Check build logs in Vercel
- Ensure all dependencies are in `package.json`
- Try running `npm run build` locally first

### "Environment variable not found":
- Verify `PUBLISH_SECRET` is set
- Check spelling exactly matches
- Redeploy after adding variables

### Webhook returns 401 Unauthorized:
- Check `x-api-key` header in Make.com
- Verify secret matches exactly
- No extra spaces or quotes

### Posts not appearing:
- Check `/posts` folder in GitHub
- Verify markdown frontmatter is correct
- Check Vercel function logs

### CSS not loading:
- Clear browser cache (Ctrl+F5)
- Check for build errors
- Verify `app/globals.css` exists

---

## 🔄 Future Updates

When you update your blog code:

1. **Local changes**:
   ```bash
   git add .
   git commit -m "Update XYZ"
   git push origin master
   ```

2. **Auto-deploy**: Vercel detects the push and rebuilds automatically (30-60 seconds)

3. **Check deployment**: Visit your blog to verify changes

---

## 📞 Support Resources

**Vercel Documentation:**
- https://vercel.com/docs
- https://vercel.com/docs/deployments/overview

**Next.js Documentation:**
- https://nextjs.org/docs

**Make.com Webhooks:**
- https://www.make.com/en/help/tools/http

**Your Repository:**
- https://github.com/hoodini/eng-blog

---

## ✅ Deployment Complete!

You now have:
- ✨ A stunning, production-ready blog
- 🤖 Fully automated posting via Make.com
- 🔒 Secure API with authentication
- 📱 100% mobile responsive
- ⚡ Lightning-fast static generation
- 💰 Zero hosting costs
- 🔄 Auto-deployment on Git push

**Next:** Set up your Make.com automation and start publishing! 🚀

---

**Deployed by:** Yuval Avidani
**Repository:** https://github.com/hoodini/eng-blog
**Date:** 2026-01-04
