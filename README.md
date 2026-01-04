# Yuval Avidani's Blog

> **AI, Automation & Code** - Insights from an AWS GenAI Superstar & GitHub Star

A stunning, fully automated blog built with Next.js, featuring Apple Newsroom-style design and automated publishing via Make.com.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Apple Newsroom-Style Design** - Stunning, premium UI with smooth animations
- **100% Mobile Responsive** - Perfect experience on all devices
- **Automated Publishing** - Webhook integration with Make.com
- **Zero Backend Needed** - Markdown files as database
- **Tag Filtering** - AI, Automation, Code, AWS, GenAI, Tutorials
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards
- **Fast & Secure** - Static generation, DOMPurify sanitization
- **Free Hosting** - Deploy to Vercel with zero cost

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- GitHub account
- Vercel account (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eng-blog.git
   cd eng-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your secret:
   ```env
   PUBLISH_SECRET=your-super-secret-key-here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📝 Creating Posts

### Manual Method

Create a new markdown file in the `posts/` directory:

```markdown
---
title: 'Your Amazing Post Title'
date: '2025-01-04'
excerpt: 'A brief description of your post'
coverImage: '/images/your-image.jpg'
tags:
  - ai
  - automation
  - code
author: Yuval Avidani
---

# Your Content Here

Write your post content in Markdown format...
```

### Automated Method (Make.com)

**1. Make.com Setup**

Create a new scenario in Make.com:

```
Trigger (Webhook/Schedule/etc.)
  ↓
HTTP Module → POST Request
  URL: https://your-blog.vercel.app/api/publish
  Headers:
    - x-api-key: YOUR_PUBLISH_SECRET
  Body (JSON):
    {
      "title": "Post Title",
      "content": "Post content in markdown...",
      "excerpt": "Brief description",
      "coverImage": "https://...",
      "tags": ["ai", "code"],
      "date": "2025-01-04"
    }
```

**2. API Response**

Success:
```json
{
  "success": true,
  "slug": "post-title",
  "url": "/posts/post-title"
}
```

## 🔐 Security

The blog implements multiple security layers:

1. **API Authentication** - Secret token required for publishing
2. **Rate Limiting** - Max 10 posts per hour per IP
3. **Input Validation** - Title/content length checks
4. **HTML Sanitization** - DOMPurify prevents XSS
5. **Git Verification** - All changes tracked in version control

### Security Best Practices

- Generate a strong `PUBLISH_SECRET`:
  ```bash
  openssl rand -hex 32
  ```
- Never commit `.env.local` to Git
- Use Vercel environment variables in production
- Monitor API logs for suspicious activity

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Yuval Avidani's stunning AI blog"
   git branch -M main
   git remote add origin https://github.com/yourusername/eng-blog.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable: `PUBLISH_SECRET`
   - Click "Deploy"

3. **Configure Make.com**
   - Update your Make.com webhook URL to: `https://your-blog.vercel.app/api/publish`
   - Add your `PUBLISH_SECRET` to the headers

### Custom Domain

In Vercel dashboard:
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## 📊 Architecture

```
┌─────────────────┐
│   Make.com      │  (Content Pipeline)
│   Automation    │
└────────┬────────┘
         │ POST /api/publish
         ↓
┌─────────────────────────┐
│  Next.js API Route      │  (Webhook Handler)
│  - Auth Check           │
│  - Rate Limiting        │
│  - Input Validation     │
└────────┬────────────────┘
         │ Create .md file
         ↓
┌─────────────────────────┐
│  GitHub Repository      │  (Version Control)
│  /posts/*.md files      │
└────────┬────────────────┘
         │ Auto Deploy
         ↓
┌─────────────────────────┐     ┌──────────────┐
│  Vercel (Production)    │────→│   Hoodini    │
│  - Static Generation    │     │   (GitHub)   │
│  - Global CDN           │     └──────────────┘
└─────────────────────────┘
```

## 📦 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Markdown**: [remark](https://github.com/remarkjs/remark) + [gray-matter](https://github.com/jonschlinkert/gray-matter)
- **Security**: [DOMPurify](https://github.com/cure53/DOMPurify)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Deployment**: [Vercel](https://vercel.com)
- **Automation**: [Make.com](https://make.com)

## 👤 Author

**Yuval Avidani**

- Website: [yuv.ai](https://yuv.ai)
- Twitter: [@yuvalav](https://x.com/yuvalav)
- GitHub: [@hoodini](https://github.com/hoodini)
- YouTube: [@yuv-ai](https://youtube.com/@yuv-ai)
- All Links: [linktr.ee/yuvai](https://linktr.ee/yuvai)

AWS GenAI Superstar ⭐ GitHub Star ⭐ 20+ Years in Tech

---

**Built with ❤️ by Yuval Avidani**

*From vibe coding to production-ready solutions*
