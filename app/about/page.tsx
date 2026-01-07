import Footer from '@/components/Footer';
import AuthorCard from '@/components/AuthorCard';
import Image from 'next/image';
import { FaGithub, FaAws, FaRocket, FaMicrophone, FaCode, FaBrain, FaStar, FaUsers, FaGraduationCap } from 'react-icons/fa';

export const metadata = {
  title: 'About | Yuval Avidani',
  description: 'Learn more about Yuval Avidani - AI Builder, Speaker, AWS GenAI Superstar & GitHub Star',
};

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-black pt-24 pb-24">
        {/* Hero Section with Image */}
        <div className="relative overflow-hidden mb-20">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent" />

          <div className="max-w-6xl mx-auto px-6 py-16 relative">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Image */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex-shrink-0">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 blur-2xl opacity-30" />
                <Image
                  src="/hero-studio.jpg"
                  alt="Yuval Avidani"
                  fill
                  className="object-cover rounded-3xl ring-2 ring-white/20 relative z-10"
                  priority
                />
              </div>

              {/* Text Content */}
              <div className="text-center lg:text-left">
                <p className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-4">
                  AI Builder & Speaker
                </p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tighter mb-6">
                  Yuval Avidani
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 max-w-xl leading-relaxed mb-8">
                  Building the future with AI agents, automation, and cutting-edge technology.
                  20+ years turning complex ideas into production-ready solutions.
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FaGithub className="text-white" />
                    <span>110+ Repos</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FaAws className="text-[#FF9900]" />
                    <span>GenAI Superstar</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FaMicrophone className="text-purple-400" />
                    <span>Speaker</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6">
          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mb-24">
            <div className="bg-black p-8 text-center group hover:bg-neutral-900 transition-colors">
              <FaGithub className="w-10 h-10 mx-auto mb-6 text-white" />
              <h3 className="font-semibold text-lg text-white mb-2">GitHub Star</h3>
              <p className="text-gray-500 text-sm">Recognized for open-source contributions</p>
            </div>
            <div className="bg-black p-8 text-center group hover:bg-neutral-900 transition-colors">
              <FaAws className="w-10 h-10 mx-auto mb-6 text-[#FF9900]" />
              <h3 className="font-semibold text-lg text-white mb-2">AWS GenAI Superstar</h3>
              <p className="text-gray-500 text-sm">Expert in AWS AI/ML services</p>
            </div>
            <div className="bg-black p-8 text-center group hover:bg-neutral-900 transition-colors">
              <FaRocket className="w-10 h-10 mx-auto mb-6 text-blue-400" />
              <h3 className="font-semibold text-lg text-white mb-2">20+ Years Experience</h3>
              <p className="text-gray-500 text-sm">Dev, Research & Cybersecurity</p>
            </div>
          </div>

          {/* Bio & Journey */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-8 flex items-center gap-3">
              <FaBrain className="text-purple-400" />
              My Journey
            </h2>
            <div className="space-y-6 text-lg text-gray-400 leading-relaxed tracking-wide">
              <p>
                I'm an AI Builder and Speaker passionate about unlocking real value
                through generative AI platforms. With over two decades of experience in tech, spanning
                development, research, and cybersecurity, I've built companies and created innovative
                solutions that push the boundaries of what's possible.
              </p>
              <p>
                As an <strong className="text-white">AWS GenAI Superstar</strong> and <strong className="text-white">GitHub Star</strong>, I focus on "vibe coding" with cutting-edge
                tools like AWS services, building AI agents with Model Context Protocol (MCP), and
                creating production-ready solutions that make a real impact.
              </p>
              <p>
                I train developers worldwide to build production AI systems through hands-on workshops and courses.
                My ability to break down complex AI architecture into practical skills has helped teams from
                startups to enterprises like <strong className="text-white">NICE</strong>, where I led a global AI learning event
                for <strong className="text-white">1,000+ employees</strong> worldwide.
              </p>
              <p>
                As a content creator partner with <strong className="text-white">Hailuo AI (MiniMax)</strong> and <strong className="text-white">Higgsfield</strong>,
                I explore the bleeding edge of AI video generation and share insights with the community.
                I believe in building in public and making AI practical, personal, and powerful for everyone.
              </p>
            </div>

            {/* Impact Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">1,000+</div>
                <div className="text-sm text-gray-500">Developers Trained</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">110+</div>
                <div className="text-sm text-gray-500">Open Source Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">160+</div>
                <div className="text-sm text-gray-500">GitHub Followers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">20+</div>
                <div className="text-sm text-gray-500">Years in Tech</div>
              </div>
            </div>

            {/* What I Do Section */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-10 flex items-center gap-3">
                <FaCode className="text-blue-400" />
                What I Build
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-neutral-900 rounded-xl p-6 border border-white/5">
                  <h3 className="font-semibold text-white mb-2">AI Agents</h3>
                  <p className="text-gray-500 text-sm">Autonomous systems that think, plan, and execute complex workflows using LLMs and tool orchestration.</p>
                </div>
                <div className="bg-neutral-900 rounded-xl p-6 border border-white/5">
                  <h3 className="font-semibold text-white mb-2">Automation Pipelines</h3>
                  <p className="text-gray-500 text-sm">End-to-end workflows connecting APIs, databases, and AI models for seamless operations.</p>
                </div>
                <div className="bg-neutral-900 rounded-xl p-6 border border-white/5">
                  <h3 className="font-semibold text-white mb-2">GenAI Applications</h3>
                  <p className="text-gray-500 text-sm">Production-ready apps leveraging the latest in generative AI for real business value.</p>
                </div>
                <div className="bg-neutral-900 rounded-xl p-6 border border-white/5">
                  <h3 className="font-semibold text-white mb-2">Developer Tools</h3>
                  <p className="text-gray-500 text-sm">Open-source utilities and frameworks that accelerate AI development for the community.</p>
                </div>
              </div>
            </div>

            {/* Speaking & Training */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-10 flex items-center gap-3">
                <FaGraduationCap className="text-green-400" />
                Speaking & Training
              </h2>
              <div className="space-y-6">
                <div className="bg-neutral-900 rounded-xl p-6 border border-white/5">
                  <div className="flex items-start gap-4">
                    <FaUsers className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Enterprise AI Training</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Led global AI learning events for enterprise teams, teaching hands-on skills from ideation to deployment—
                        covering web apps, presentations, dashboards, and interactive podcasts using cutting-edge AI tools.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-900 rounded-xl p-6 border border-white/5">
                  <div className="flex items-start gap-4">
                    <FaStar className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">AWS & GitHub Expert</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Collaborating with AWS GenAI/ML teams on vibe coding workshops, exploring Nova Act models,
                        MCP agent development, and Q Developer. Regular speaker at tech conferences and community events.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Projects */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-10">Top Projects</h2>
              <div className="grid gap-6">
                <a
                  href="https://github.com/hoodini/yuv-ai-trends"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group bg-neutral-900 rounded-xl p-6 border border-white/5 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">YUV.AI Trends</h3>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-yellow-400 text-sm"><FaStar /> 92</span>
                      <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">Open Source</span>
                    </div>
                  </div>
                  <p className="text-gray-500">
                    Beautiful Gen AI & ML news aggregator—stay on top of the latest developments in AI with a curated feed.
                  </p>
                </a>

                <a
                  href="https://agents.yuv.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group bg-neutral-900 rounded-xl p-6 border border-white/5 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">AI Agents 101</h3>
                    <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">Educational Platform</span>
                  </div>
                  <p className="text-gray-500">
                    Interactive training platform with hands-on labs covering LLMs, tools, memory, RAG, and multi-agent systems.
                  </p>
                </a>

                <a
                  href="https://github.com/hoodini/nano-banana-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group bg-neutral-900 rounded-xl p-6 border border-white/5 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Nano Banana UI</h3>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-yellow-400 text-sm"><FaStar /> 18</span>
                      <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">Open Source</span>
                    </div>
                  </div>
                  <p className="text-gray-500">
                    YUV.AI Nano Banana Pro—beautiful web app for Google Gemini image generation with full API feature support.
                  </p>
                </a>

                <a
                  href="https://github.com/hoodini/nextjs-bun-starter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group bg-neutral-900 rounded-xl p-6 border border-white/5 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Next.js Bun Starter</h3>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-yellow-400 text-sm"><FaStar /> 15</span>
                      <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">Template</span>
                    </div>
                  </div>
                  <p className="text-gray-500">
                    The ultimate Next.js starter kit with Bun, Shadcn/ui, Tailwind CSS, and Google Authentication.
                  </p>
                </a>

                <a
                  href="https://github.com/hoodini/autocap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group bg-neutral-900 rounded-xl p-6 border border-white/5 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">AutoCap</h3>
                    <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">AI Tool</span>
                  </div>
                  <p className="text-gray-500">
                    AI-powered image captioning for LoRA training using Microsoft's Florence-2-large vision-language model.
                  </p>
                </a>
              </div>
            </div>

            {/* Connect Section */}
            <div className="mt-24">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-8">Let's Connect</h2>
              <AuthorCard variant="about" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
