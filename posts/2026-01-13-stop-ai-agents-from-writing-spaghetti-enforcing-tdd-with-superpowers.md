---
title: "Stop AI Agents from Writing Spaghetti: Enforcing TDD with Superpowers"
date: "2026-01-13"
excerpt: "## Finally We Can Force AI Agents to Stop Acting Like Junior Developers The project [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent (obra) s..."
coverImage: "https://yuv-ai-images.s3.us-west-2.amazonaws.com/CqhmabzqF7S3nsEPme_2gQg.jpg"
tags: ["github"]
author: "Yuval Avidani"
---

## Finally We Can Force AI Agents to Stop Acting Like Junior Developers

The project [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent (obra) solves a problem we've all been hitting our heads against - AI coding assistants that behave like enthusiastic juniors rushing to ship code without thinking. This tool injects senior engineering discipline directly into Claude Code's workflow.

## The Problem We All Know Too Well

We've all been there. We ask Claude or GitHub Copilot to build a feature, and within seconds it's generating hundreds of lines of code. No planning phase. No test strategy. No consideration for maintainability. Just code that barely works and breaks the moment we try to extend it.

The result? We spend more time debugging and refactoring the AI's output than if we'd written it ourselves from scratch. Our codebases become unmaintainable tangles because the AI optimizes for speed over quality.

The core issue is that AI agents don't naturally think in terms of engineering process. They're trained on repositories full of code, but not on the discipline and methodology that created that code. They see the artifacts, not the craftsmanship.

## Why Existing Solutions Fall Short

Other tools have tried adding guardrails to AI coding assistants. Some are too rigid - forcing us through bureaucratic checklists that slow us down on simple tasks. Others are too loose - they suggest best practices but don't enforce them, so the AI ignores them under pressure.

The fundamental challenge is that prompting alone doesn't work. We can write elaborate system prompts telling the AI to "write tests first" or "plan before coding," but when the rubber meets the road, the AI takes shortcuts. It's wired to generate code quickly, not to follow process.

## How Superpowers Actually Works

Superpowers takes a completely different approach. Instead of hoping the AI will follow our instructions, it injects what the author calls "Subagent-Driven Development" directly into the agent's context window. Think of it like having a senior engineer physically sitting next to the AI, stopping it from rushing ahead.

The magic happens through composable "skills" - essentially tool definitions and system prompts that trigger automatically based on the current context. These aren't suggestions. They're mandatory workflow steps that the agent cannot skip.

### Quick Start

Here's how we get Superpowers running with Claude Code:

```
# Clone the repository
git clone https://github.com/obra/superpowers.git
cd superpowers

# Install dependencies
npm install

# Configure for Claude Code
cp config.example.json config.json
# Edit config.json with your Claude API key

# Activate the skills
npm run activate-skills
```

### The TDD Enforcement Cycle

The most powerful feature is the test-driven-development skill. Here's what happens when we ask for a new feature:

```
# Before Superpowers:
# User: "Add a login function"
# AI: *immediately writes 200 lines of login code*

# With Superpowers:
# User: "Add a login function"
# AI: *must follow this cycle*

# Step 1: Write a failing test
def test_login_with_valid_credentials():
    user = User(email="test@example.com", password="secret123")
    result = login(user.email, user.password)
    assert result.success == True
    assert result.token is not None

# Step 2: Run the test and watch it fail
# FAIL: NameError: name 'login' is not defined

# Step 3: Write MINIMAL code to pass
def login(email, password):
    # Simplest possible implementation
    if email and password:
        return LoginResult(success=True, token="dummy_token")
    return LoginResult(success=False, token=None)

# Step 4: Refactor after green
# Now improve the implementation while tests stay green
```

Here's the critical part: if code exists without accompanying tests, the agent is instructed to delete it. This sounds harsh, but it's exactly what we'd tell a junior developer on our team.

### Git Worktree Isolation

Another brilliant feature is the using-git-worktrees skill. When we're working on a feature, the agent doesn't touch our current working directory. Instead:

```
# Agent creates isolated worktree
git worktree add ../feature-temp feature-branch
cd ../feature-temp

# Runs project setup in isolation
npm install
npm test  # Verify clean baseline

# Makes changes in isolated environment
# No risk of breaking our main workspace

# When done, we can review and merge
cd ../main-project
git worktree remove ../feature-temp
```

This solves the "it works on my machine" problem. The agent proves the code works in a clean environment, not one polluted by our local tweaks and experiments.

## Key Features That Change How We Work

*   **Brainstorm Before Coding** - The agent must engage in Socratic design refinement before writing any implementation. It asks us clarifying questions about edge cases, performance requirements, and integration points. Think of it like a senior engineer doing discovery before estimation.
*   **Mandatory Planning Phase** - After brainstorming, the agent writes a detailed plan. We review and approve this plan before any code gets written. No surprises, no scope creep, no "I thought you meant..." conversations after the fact.
*   **Self-Review Cycle** - Before marking work as done, one agent writes the code and another agent reviews it against the original plan. This mirrors how senior engineers actually work on teams - fresh eyes catch issues the original author missed.
*   **YAGNI and DRY Enforcement** - The agent is explicitly instructed to follow "You Aren't Gonna Need It" and "Don't Repeat Yourself" principles. It pushes back if we ask for speculative features or duplicate code patterns.

## When to Use This vs. Alternatives

Superpowers is optimized specifically for Claude Code right now, though the skills are adaptable to GitHub Copilot or OpenCode with some configuration tweaking. It's not a replacement for tools like Cursor or Aider - it's complementary.

Use Superpowers when maintainability matters more than speed. If we're prototyping a throwaway demo, the overhead isn't worth it. But for production codebases where we'll be maintaining the code for years? The discipline it enforces pays dividends.

Compared to LangChain or AutoGPT's coding modes, Superpowers is much more opinionated. Those tools give us flexibility to define our own workflows. Superpowers says "here's the right way to do engineering" and enforces it. Some developers will love this, others will chafe against the constraints.

## My Take - Will I Use This in Production?

In my view, this is the first tool I've seen that treats AI agents like engineers-in-training rather than code generators. The workflow enforcement isn't about limiting the AI - it's about teaching it habits that lead to maintainable software.

I'm already integrating this into my workflow for any project where I'm not the only developer. The TDD enforcement alone saves me hours of debugging poorly-tested AI-generated code. The Git worktree isolation is brilliant for preventing environment pollution.

The catch is that it's definitely opinionated. If we have our own preferred workflow that differs from strict TDD, we'll need to customize the skills. The repository structure is modular, so this is doable, but it requires understanding how the skills compose together.

Another limitation: the Brainstorm and Planning phases add real overhead. For tiny changes - fixing a typo, updating a dependency - it feels like overkill. We need to develop judgment about when to activate Superpowers and when to let the AI work freely.

Bottom line: for any team serious about code quality, this is worth trying. Check out the repository at [github.com/obra/superpowers](https://github.com/obra/superpowers) and experiment with the skills that fit your workflow.