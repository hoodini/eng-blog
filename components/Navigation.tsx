'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaGithub } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
        <div className="container-width h-14 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="text-[19px] font-semibold tracking-tight text-[var(--foreground)] hover:opacity-70 transition-opacity z-50"
          >
             Newsroom
            {/* Using Apple logo for "Newsroom" feel or just Yuval's brand */}
            <span className="sr-only">Home</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/" active={pathname === '/'}>News</NavLink>
            <NavLink href="/about" active={pathname === '/about'}>About</NavLink>
            <span className="h-4 w-px bg-gray-300 mx-1"></span>
            <a
              href="https://yuv.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-[var(--muted)] hover:text-[#0071e3] transition-colors"
            >
              Portfolio
            </a>
            <a
              href="https://github.com/hoodini"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1d1d1f] hover:opacity-60 transition-opacity"
            >
              <FaGithub size={18} />
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#1d1d1f] z-50 p-2"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden flex flex-col"
          >
            <div className="flex flex-col space-y-6">
              <MobileLink href="/">News</MobileLink>
              <MobileLink href="/about">About</MobileLink>
              <div className="h-px bg-gray-100 w-full my-2"></div>
              <a
                href="https://yuv.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-semibold text-[var(--muted)]"
              >
                Portfolio
              </a>
              <a
                href="https://github.com/hoodini"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#1d1d1f] font-medium"
              >
                <FaGithub size={24} />
                <span>GitHub</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode, active?: boolean }) {
  return (
    <Link
      href={href}
      className={`text-xs font-medium tracking-wide transition-colors ${active ? 'text-[#1d1d1f]' : 'text-[var(--muted)] hover:text-[#0071e3]'
        }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-2xl font-semibold text-[#1d1d1f] tracking-tight"
    >
      {children}
    </Link>
  );
}
