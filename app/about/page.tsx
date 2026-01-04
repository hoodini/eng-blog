import Footer from '@/components/Footer';
import { FaGithub, FaAws, FaRocket } from 'react-icons/fa';

export const metadata = {
  title: 'About | Yuval Avidani',
  description: 'Learn more about Yuval Avidani - AI Builder, Speaker, AWS GenAI Superstar & GitHub Star',
};

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-black pt-32 pb-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto px-6 mb-20 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tighter mb-8">
            About Me
          </h1>
          <p className="text-2xl font-medium text-gray-400 max-w-2xl mx-auto leading-relaxed">
            AI Builder & Speaker with 20+ years in tech.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-6">
          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mb-24">
            <div className="bg-black p-8 text-center group hover:bg-neutral-900 transition-colors">
              <FaGithub className="w-10 h-10 mx-auto mb-6 text-white" />
              <h3 className="font-semibold text-lg text-white mb-2">GitHub Star</h3>
              <p className="text-gray-500 text-sm">110+ public repositories</p>
            </div>
            <div className="bg-black p-8 text-center group hover:bg-neutral-900 transition-colors">
              <FaAws className="w-10 h-10 mx-auto mb-6 text-white" />
              <h3 className="font-semibold text-lg text-white mb-2">AWS GenAI Superstar</h3>
              <p className="text-gray-500 text-sm">Building with AWS AI services</p>
            </div>
            <div className="bg-black p-8 text-center group hover:bg-neutral-900 transition-colors">
              <FaRocket className="w-10 h-10 mx-auto mb-6 text-white" />
              <h3 className="font-semibold text-lg text-white mb-2">20+ Years Experience</h3>
              <p className="text-gray-500 text-sm">Development & Research</p>
            </div>
          </div>

          {/* Bio & Journey */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-8">My Journey</h2>
            <div className="space-y-6 text-lg text-gray-400 leading-relaxed tracking-wide">
              <p>
                I'm Yuval Avidani, an AI Builder and Speaker passionate about unlocking real value
                through generative AI platforms. With over two decades of experience in tech, spanning
                development, research, and cybersecurity, I've built companies and created innovative
                solutions that push the boundaries of what's possible.
              </p>
              <p>
                As an AWS GenAI Superstar and GitHub Star, I focus on "vibe coding" with cutting-edge
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

            {/* Notable Projects List */}
            <div className="mt-24">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-10">Selected Works</h2>
              <div className="grid gap-8">
                <a
                  href="https://github.com/hoodini/autocap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group border-b border-white/10 pb-8 hover:border-white/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">AutoCap</h3>
                    <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">Open Source</span>
                  </div>
                  <p className="text-gray-500">
                    AI-powered image captioning for LoRA training using Microsoft's Florence-2-large vision-language model.
                  </p>
                </a>

                <a
                  href="https://agents.yuv.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group border-b border-white/10 pb-8 hover:border-white/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">AI Agents 101</h3>
                    <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">Educational Platform</span>
                  </div>
                  <p className="text-gray-500">
                    Interactive training platform covering LLMs, tools, memory, RAG, and multi-agent systems.
                  </p>
                </a>

                <a
                  href="https://yuv.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group border-b border-white/10 pb-8 hover:border-white/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">YUV.AI Platform</h3>
                    <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">SaaS</span>
                  </div>
                  <p className="text-gray-500">
                    Generative AI platform unlocking real value through innovative AI solutions.
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
