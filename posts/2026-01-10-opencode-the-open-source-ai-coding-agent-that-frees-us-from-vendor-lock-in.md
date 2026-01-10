---
title: "OpenCode: The Open Source AI Coding Agent That Frees Us From Vendor Lock-In"
date: "2026-01-10"
excerpt: "## An AI Coding Agent We Can Actually Own The project [OpenCode](https://github.com/anomalyco/opencode) solves a problem that's been frustrating us terminal use..."
coverImage: "https://yuv-ai-images.s3.us-west-2.amazonaws.com/i6hiabi8MpjjnsEP-cLi2Ac.jpg"
tags: ["github"]
author: "Yuval Avidani"
---

## An AI Coding Agent We Can Actually Own

The project [OpenCode](https://github.com/anomalyco/opencode) solves a problem that's been frustrating us terminal users for a while - we finally have an AI coding agent that's 100% open source and not locked to a single model provider. This means we can switch between Claude, OpenAI, Google, or even local models without rewriting our entire workflow.

## The Vendor Lock-In Problem We All Face

We all know this situation too well. We want AI assistance in our coding workflow, but we're forced to make uncomfortable compromises. Tools like Claude Code work brilliantly, but they tie us to Anthropic's ecosystem. GitHub Copilot is solid, but we're coupled to their infrastructure and pricing. As the AI landscape evolves rapidly - with new models appearing monthly and pricing constantly shifting - this coupling becomes a liability.

We need flexibility. When a better model drops or our budget constraints change, we want to switch providers without losing our entire workflow. The current generation of AI coding tools treats the model provider as fundamental to their architecture, not as a swappable component.

## How OpenCode Works

OpenCode takes a fundamentally different approach with its client-server architecture. Think of it like having a universal remote for your TV instead of being stuck with the manufacturer's proprietary app - you choose your backend while keeping the same interface you've learned.

The architecture separates the coding agent interface from the AI model provider. This means OpenCode can run on our local machine while we interact with it from different clients - the terminal UI, a future mobile app, or any other interface. The TUI (text user interface) is just one possible client, not the entire system.

### Quick Start

Here's how we get OpenCode running:

```
# YOLO install (macOS/Linux)
curl -fsSL https://opencode.ai/install | bash

# Or use package managers
npm i -g opencode-ai@latest
brew install anomalyco/tap/opencode

# Windows options
scoop bucket add extras
scoop install extras/opencode
# or
choco install opencode
```

### Built-In Agents

OpenCode includes two agents we can switch between using the Tab key:

```
# Start OpenCode and press Tab to switch agents

# 'build' agent (default)
# - Full file system access
# - Can edit files directly
# - Runs bash commands without asking
# - For active development work

# 'plan' agent
# - Read-only by default
# - Asks permission before bash commands
# - Denies file edits unless approved
# - Perfect for code exploration
```

## Key Features That Matter

*   **Provider Agnostic** - We can use Claude, OpenAI, Google's models, or run everything locally. As the model landscape evolves, we're not stuck rewriting our workflow. Think of it like having USB-C ports instead of proprietary connectors - we choose what plugs in.
*   **LSP Support Out of Box** - Language Server Protocol integration means we get proper code intelligence, completions, and diagnostics without configuration. This is what makes the difference between a chatbot that writes code and a real development tool.
*   **Terminal-First Design** - Built by neovim users and the creators of terminal.shop, OpenCode pushes the limits of what's possible in the terminal. The TUI isn't an afterthought - it's the primary interface, with other clients as options.
*   **Client-Server Architecture** - The agent runs on our machine but we can drive it from anywhere. This opens possibilities like controlling our local development environment from a phone or tablet when we're away from our desk.
*   **Dual Agent System** - The build/plan split is clever. We use 'build' for active development where we trust the agent to make changes. We switch to 'plan' when exploring unfamiliar code or when we want to review suggestions before they're applied. There's also a 'general' subagent for complex searches and multistep tasks.

### A Real Example

Let's say we want to refactor a legacy Python codebase we just inherited:

```
# Start OpenCode in plan mode for safe exploration
opencode
# Press Tab to ensure we're in 'plan' agent

# Ask it to analyze the codebase
> Analyze this codebase structure and identify the main components

# It will read files but not modify anything
# When it suggests running commands, it asks permission first

# Once we understand the structure, switch to build mode
# Press Tab to switch to 'build' agent

# Now we can make changes
> Refactor the database connection code to use connection pooling

# The agent will propose changes and apply them
# Because we're in build mode, it has write access
```

## When to Use OpenCode vs. Alternatives

Claude Code is excellent if we're all-in on Anthropic and their pricing works for our use case. It's more polished right now since it's had more development time. GitHub Copilot is great if we're already paying for GitHub and want inline suggestions in our IDE.

We'd choose OpenCode when we need flexibility in model providers, when we prefer terminal workflows over IDE extensions, or when we want the option to run everything locally. The client-server architecture also makes sense if we work across multiple machines or want remote access to our development environment.

The trade-off is maturity. OpenCode is newer, so the ecosystem and polish aren't quite at the level of Claude Code yet. But for those of us who prioritize avoiding vendor lock-in and maintaining control over our toolchain, that's an acceptable trade.

## My Take - Will I Use This?

In my view, this addresses a real gap in the AI coding tool landscape. We've needed a provider-agnostic agent that respects terminal workflows and doesn't treat the AI provider as unchangeable infrastructure.

Will I use it? Yes, absolutely. The ability to swap model providers as pricing and capabilities shift is worth the switch alone. I've been burned before by tools that coupled too tightly to a single service that later changed pricing or shut down. OpenCode's architecture prevents that.

The limitation to watch is that it's earlier in development than tools like Claude Code. We might hit rough edges or missing features. But the foundation is solid - open source, provider-agnostic, terminal-focused, with proper LSP integration. Those architectural decisions pay dividends long-term.

For developers who live in the terminal and want to future-proof their AI coding workflow, [OpenCode](https://github.com/anomalyco/opencode) offers exactly what we've been missing. The vendor lock-in problem isn't going away - if anything, it's getting worse as AI tools multiply. Having an open source option that lets us choose our backend is increasingly valuable.