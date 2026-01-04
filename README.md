# 10x AI Newsroom

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hoodini/eng-blog)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)

A modern, Apple-inspired AI blog platform with automated content publishing via Make.com. Built with Next.js 16, TypeScript, and Tailwind CSS.

**🌐 Live Demo:** [en-blog.yuv.ai](https://en-blog.yuv.ai)

**👤 Created by:** [Yuval Avidani](https://yuv.ai) - AI Builder & Speaker

---

## 📸 Screenshots

### Desktop View
![Desktop Screenshot](public/images/screenshot-desktop.png)

### Mobile View
![Mobile Screenshot](public/images/screenshot-mobile.png)

---

## ✨ Features

- **🎨 Apple-Inspired Design** - Clean, modern UI with premium aesthetics
- **🤖 Make.com Integration** - Automated blog posting via webhook API
- **📝 Markdown Support** - Write posts in Markdown with full formatting
- **🏷️ Tag System** - Organize posts with customizable tags
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile
- **⚡ Fast Performance** - Static generation with Next.js for blazing speed
- **🔒 Secure API** - Rate-limited publish endpoint with API key authentication
- **🌙 GitHub Integration** - Posts are committed directly to the repository

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- GitHub account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hoodini/eng-blog.git
   cd eng-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configure environment variables** (see [Configuration](#configuration))

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

Create a `.env.local` file with the following variables:

```env
# API Security
PUBLISH_SECRET=your-secure-api-key-here

# GitHub Integration (for automated publishing)
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_OWNER=your-github-username
GITHUB_REPO=eng-blog
GITHUB_BRANCH=master
```

### Getting a GitHub Token

1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Generate a new token (classic)
3. Select the `repo` scope
4. Copy and save the token

---

## 📡 API Documentation

### POST `/api/publish`

Create a new blog post programmatically.

**Headers:**
| Header | Value |
|--------|-------|
| `x-api-key` | Your `PUBLISH_SECRET` |
| `Content-Type` | `application/json` |

**Request Body:**
```json
{
  "title": "Your Post Title",
  "content": "# Markdown Content\n\nYour post content here...",
  "excerpt": "Optional short summary",
  "tags": ["ai", "automation"],
  "coverImage": "https://example.com/image.jpg",
  "date": "2026-01-05"
}
```

**Response:**
```json
{
  "success": true,
  "slug": "your-post-title",
  "message": "Post published successfully! Site will redeploy shortly.",
  "url": "/posts/2026-01-05-your-post-title"
}
```

### GET `/api/publish`

Health check endpoint.

```json
{
  "status": "ok",
  "message": "Publish API is running",
  "timestamp": "2026-01-05T00:00:00.000Z"
}
```

---

## 🔄 Make.com Integration

This blog is designed to work seamlessly with [Make.com](https://make.com) for automated content publishing.

### Setup Steps

1. **Create a new scenario** in Make.com
2. **Add an HTTP module** with these settings:
   - **URL:** `https://en-blog.yuv.ai/api/publish`
   - **Method:** `POST`
   - **Headers:**
     - `x-api-key`: Your secret key
     - `Content-Type`: `application/json`
   - **Body:** JSON with your content

See [docs/AUTOMATION_GUIDE.md](docs/AUTOMATION_GUIDE.md) for detailed instructions.

---

## 🏗️ Project Structure

```
eng-blog/
├── app/
│   ├── api/
│   │   └── publish/          # Publish API endpoint
│   ├── posts/
│   │   └── [slug]/           # Dynamic post pages
│   ├── about/                # About page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/
│   ├── Navigation.tsx        # Header navigation
│   ├── Footer.tsx            # Site footer
│   ├── PostCard.tsx          # Post preview card
│   ├── PostGrid.tsx          # Posts grid layout
│   └── ...
├── lib/
│   └── posts.ts              # Post utilities
├── posts/                    # Markdown blog posts
├── public/
│   └── images/               # Static images
└── docs/
    └── AUTOMATION_GUIDE.md   # Make.com setup guide
```

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Deployment:** [Vercel](https://vercel.com/)
- **Content:** Markdown with [gray-matter](https://github.com/jonschlinkert/gray-matter)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Yuval Avidani**

- Website: [yuv.ai](https://yuv.ai)
- Twitter: [@yuvalav](https://twitter.com/yuvalav)
- GitHub: [@hoodini](https://github.com/hoodini)
- LinkedIn: [Yuval Avidani](https://linkedin.com/in/yuval-avidani)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/hoodini/eng-blog/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⭐ Show Your Support

Give a ⭐ if this project helped you!

---

*Built with ❤️ by [Yuval Avidani](https://yuv.ai)*
