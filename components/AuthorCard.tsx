import Image from 'next/image';
import { FaTwitter, FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';

interface AuthorCardProps {
  variant?: 'article' | 'about';
}

export default function AuthorCard({ variant = 'article' }: AuthorCardProps) {
  const isAbout = variant === 'about';

  return (
    <div className={`${isAbout ? 'bg-neutral-900' : 'bg-[#f5f5f7]'} rounded-2xl overflow-hidden`}>
      <div className={`flex flex-col ${isAbout ? 'md:flex-row' : 'sm:flex-row'} items-center gap-6 ${isAbout ? 'p-8 md:p-12' : 'p-6 sm:p-8'}`}>
        {/* Avatar */}
        <div className={`relative ${isAbout ? 'w-32 h-32 md:w-40 md:h-40' : 'w-20 h-20 sm:w-24 sm:h-24'} flex-shrink-0`}>
          <Image
            src="/hero-studio.jpg"
            alt="Yuval Avidani"
            fill
            className="object-cover rounded-full ring-4 ring-white/10"
          />
        </div>

        {/* Info */}
        <div className={`${isAbout ? 'text-center md:text-left' : 'text-center sm:text-left'} flex-1`}>
          <h3 className={`font-bold ${isAbout ? 'text-2xl md:text-3xl text-white' : 'text-lg sm:text-xl text-[var(--foreground)]'} mb-2`}>
            Yuval Avidani
          </h3>
          <p className={`${isAbout ? 'text-gray-400 text-lg mb-6' : 'text-[var(--muted)] text-sm sm:text-base mb-4'} leading-relaxed`}>
            {isAbout
              ? 'AI Builder & Speaker. AWS GenAI Superstar. GitHub Star. Building the future with AI agents and automation.'
              : 'AI Builder & Speaker with 20+ years in tech. AWS GenAI Superstar & GitHub Star.'}
          </p>

          {/* Social Links */}
          <div className={`flex ${isAbout ? 'justify-center md:justify-start' : 'justify-center sm:justify-start'} gap-4`}>
            <SocialLink
              href="https://x.com/yuvalav"
              icon={FaTwitter}
              label="Twitter"
              isAbout={isAbout}
            />
            <SocialLink
              href="https://github.com/hoodini"
              icon={FaGithub}
              label="GitHub"
              isAbout={isAbout}
            />
            <SocialLink
              href="https://linkedin.com/in/yuval-avidani"
              icon={FaLinkedin}
              label="LinkedIn"
              isAbout={isAbout}
            />
            <SocialLink
              href="https://youtube.com/@yuv-ai"
              icon={FaYoutube}
              label="YouTube"
              isAbout={isAbout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialLink({
  href,
  icon: Icon,
  label,
  isAbout
}: {
  href: string;
  icon: any;
  label: string;
  isAbout: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`${isAbout
        ? 'w-10 h-10 bg-white/10 hover:bg-white/20 text-white'
        : 'w-9 h-9 bg-[var(--foreground)]/10 hover:bg-[var(--foreground)]/20 text-[var(--foreground)]'
      } rounded-full flex items-center justify-center transition-all hover:scale-110`}
    >
      <Icon size={isAbout ? 18 : 16} />
    </a>
  );
}
