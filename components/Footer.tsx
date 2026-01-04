import { FaTwitter, FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">YUV.AI</h3>
            <p className="text-gray-400 text-sm">
              AI Builder & Speaker sharing insights on generative AI, automation, and modern development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://yuv.ai" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="https://agents.yuv.ai" className="text-gray-400 hover:text-white text-sm transition-colors">
                  AI Agents 101
                </a>
              </li>
              <li>
                <a href="https://github.com/hoodini" className="text-gray-400 hover:text-white text-sm transition-colors">
                  GitHub Projects
                </a>
              </li>
              <li>
                <a href="https://linktr.ee/yuvai" className="text-gray-400 hover:text-white text-sm transition-colors">
                  All Links
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://x.com/yuvalav"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://github.com/hoodini"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://linktr.ee/yuvai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://youtube.com/@yuv-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Yuval Avidani. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built with Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
