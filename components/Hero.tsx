'use client';

import { motion } from 'framer-motion';
import {
  FaTwitter,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaGithub,
  FaLinkedin,
  FaAws
} from 'react-icons/fa';

const socialLinks = [
  { icon: FaTwitter, href: 'https://x.com/yuvalav', label: '@yuvalav' },
  { icon: FaInstagram, href: 'https://instagram.com/yuval_770', label: '@yuval_770' },
  { icon: FaTiktok, href: 'https://tiktok.com/@yuval.ai', label: '@yuval.ai' },
  { icon: FaYoutube, href: 'https://youtube.com/@yuv-ai', label: '@yuv-ai' },
  { icon: FaGithub, href: 'https://github.com/hoodini', label: 'GitHub Star' },
  { icon: FaLinkedin, href: 'https://linktr.ee/yuvai', label: 'Links' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <span className="px-4 py-1.5 rounded-full glass-effect text-xs font-medium flex items-center gap-2">
              <FaGithub className="text-purple-400" />
              GitHub Star
            </span>
            <span className="px-4 py-1.5 rounded-full glass-effect text-xs font-medium flex items-center gap-2">
              <FaAws className="text-orange-400" />
              AWS GenAI Superstar
            </span>
            <span className="px-4 py-1.5 rounded-full glass-effect text-xs font-medium">
              20+ Years in Tech
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="gradient-text">Yuval Avidani</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            AI Builder & Speaker
          </p>

          <p className="text-base sm:text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Insights on AI, automation, and code. Building generative AI platforms,
            unlocking real value through innovation. From vibe coding to production-ready solutions.
          </p>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect hover:bg-white/10 transition-all hover-lift group"
              >
                <social.icon className="text-lg group-hover:scale-110 transition-transform" />
                <span className="text-sm hidden sm:inline">{social.label}</span>
              </motion.a>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://yuv.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 font-semibold hover:scale-105 transition-transform"
            >
              Visit Portfolio
            </a>
            <a
              href="#articles"
              className="px-8 py-3 rounded-full glass-effect font-semibold hover:bg-white/10 transition-all"
            >
              Read Articles
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-white/60"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
