import { FaTwitter, FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[var(--section-bg)] pt-20 pb-12 border-t border-[var(--card-border)]">
      <div className="container-width">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">

          <div>
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2 tracking-tight flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[var(--foreground)]"></span>
              10x AI
            </h3>
            <p className="text-[var(--muted)] text-sm max-w-md">
              Engineering the future with AI Agents & Automation.
            </p>
          </div>

          <div className="flex gap-6">
            <SocialLink href="https://x.com/yuvalav" icon={FaTwitter} />
            <SocialLink href="https://github.com/hoodini" icon={FaGithub} />
            <SocialLink href="https://linktr.ee/yuvai" icon={FaLinkedin} />
            <SocialLink href="https://youtube.com/@yuv-ai" icon={FaYoutube} />
          </div>
        </div>

        <div className="border-t border-[var(--card-border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--muted)] text-xs">
            © {new Date().getFullYear()} Yuval Avidani. All rights reserved.
          </p>

          <div className="flex gap-6">
            <FooterLink href="https://yuv.ai">Portfolio</FooterLink>
            <FooterLink href="https://agents.yuv.ai">Course</FooterLink>
            <FooterLink href="/rss">RSS</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
    >
      <Icon size={20} />
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-[var(--muted)] hover:text-[var(--foreground)] text-xs transition-colors"
    >
      {children}
    </a>
  );
}
