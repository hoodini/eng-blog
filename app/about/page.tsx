import Footer from '@/components/Footer';
import { FaGithub, FaAws, FaRocket } from 'react-icons/fa';

export const metadata = {
  title: 'About | Yuval Avidani',
  description: 'Learn more about Yuval Avidani - AI Builder, Speaker, AWS GenAI Superstar & GitHub Star',
};

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-black pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="gradient-text">About Me</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              AI Builder & Speaker with 20+ years in tech
            </p>
          </div>

          {/* Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="glass-effect rounded-2xl p-6 text-center">
              <FaGithub className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="font-bold text-lg mb-2">GitHub Star</h3>
              <p className="text-gray-400 text-sm">110+ public repositories</p>
            </div>
            <div className="glass-effect rounded-2xl p-6 text-center">
              <FaAws className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <h3 className="font-bold text-lg mb-2">AWS GenAI Superstar</h3>
              <p className="text-gray-400 text-sm">Building with AWS AI services</p>
            </div>
            <div className="glass-effect rounded-2xl p-6 text-center">
              <FaRocket className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="font-bold text-lg mb-2">20+ Years Experience</h3>
              <p className="text-gray-400 text-sm">Development, research & cybersecurity</p>
            </div>
          </div>

          {/* Bio */}
          <div className="glass-effect rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">My Journey</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                I'm Yuval Avidani, an AI Builder and Speaker passionate about unlocking real value
                through generative AI platforms. With over two decades of experience in tech, spanning
                development, research, and cybersecurity, I've built companies and created innovative
                solutions that push the boundaries of what's possible.
              </p>
              <p>
                As an AWS GenAI Superstar and GitHub Star, I focus on vibe coding with cutting-edge
                tools like AWS services, building AI agents with Model Context Protocol (MCP), and
                creating production-ready solutions that make a real impact.
              </p>
              <p>
                My work includes projects like AutoCap (AI-powered image captioning using Florence-2),
                the AI Agents 101 interactive training platform, and numerous open-source contributions
                across various domains including generative AI, automation, and developer tools.
              </p>
              <p>
                I'm also a content creator partner with Hailuo AI (MiniMax) & Higgsfield, sharing
                insights and building in public to help others learn and grow in the AI space.
              </p>
            </div>
          </div>

          {/* Projects */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Notable Projects</h2>
            <div className="space-y-4">
              <a
                href="https://github.com/hoodini/autocap"
                target="_blank"
                rel="noopener noreferrer"
                className="block glass-effect rounded-xl p-6 hover-lift"
              >
                <h3 className="text-xl font-bold mb-2">AutoCap</h3>
                <p className="text-gray-400">
                  AI-powered image captioning for LoRA training using Microsoft's Florence-2-large
                  vision-language model
                </p>
              </a>
              <a
                href="https://agents.yuv.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="block glass-effect rounded-xl p-6 hover-lift"
              >
                <h3 className="text-xl font-bold mb-2">AI Agents 101</h3>
                <p className="text-gray-400">
                  Interactive training platform covering LLMs, tools, memory, RAG, and multi-agent
                  systems
                </p>
              </a>
              <a
                href="https://yuv.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="block glass-effect rounded-xl p-6 hover-lift"
              >
                <h3 className="text-xl font-bold mb-2">YUV.AI Platform</h3>
                <p className="text-gray-400">
                  Generative AI platform unlocking real value through innovative AI solutions
                </p>
              </a>
            </div>
          </div>

          {/* Connect */}
          <div className="text-center glass-effect rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
            <p className="text-gray-300 mb-6">
              Interested in AI, automation, or collaboration? Reach out!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://linktr.ee/yuvai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 font-semibold hover:scale-105 transition-transform"
              >
                All Links
              </a>
              <a
                href="https://github.com/hoodini"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full glass-effect font-semibold hover:bg-white/10 transition-all"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
