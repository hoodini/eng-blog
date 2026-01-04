'use client';

import { motion } from 'framer-motion';
import {
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';

const socialLinks = [
  { icon: FaTwitter, href: 'https://x.com/yuvalav', label: '@yuvalav' },
  { icon: FaGithub, href: 'https://github.com/hoodini', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linktr.ee/yuvai', label: 'LinkedIn' },
  { icon: FaYoutube, href: 'https://youtube.com/@yuv-ai', label: 'YouTube' },
];

export default function Hero() {
  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 bg-white">

      <div className="max-w-4xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1d1d1f] mb-4">
            Yuval Avidani
          </h1>
          <p className="text-xl sm:text-2xl text-[#86868b] font-medium">
            AI Builder & Speaker
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-[#424245] max-w-2xl mx-auto leading-relaxed"
        >
          Insights on AI, automation, and code. Building generative AI platforms,
          unlocking real value through innovation. From vibe coding to production-ready solutions.
        </motion.p>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-6 pt-4"
        >
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#86868b] hover:text-[#0066cc] transition-colors"
              aria-label={social.label}
            >
              <social.icon className="text-xl" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
