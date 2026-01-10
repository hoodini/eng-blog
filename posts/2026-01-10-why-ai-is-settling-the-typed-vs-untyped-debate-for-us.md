---
title: "Why AI is Settling the Typed vs. Untyped Debate For Us"
date: "2026-01-10"
excerpt: "## The 94% Stat That Changes Everything A recent [GitHub Blog post by Cassidy Williams](https://github.blog/ai-and-ml/llms/why-ai-is-pushing-developers-toward-t..."
coverImage: "https://yuv-ai-images.s3.us-west-2.amazonaws.com/S5liaYq-EZS6xN8PgYbSsAk.jpg"
tags: ["github"]
author: "Yuval Avidani"
---

## The 94% Stat That Changes Everything

A recent [GitHub Blog post by Cassidy Williams](https://github.blog/ai-and-ml/llms/why-ai-is-pushing-developers-toward-typed-languages/) drops a bombshell: 94% of LLM-generated compilation errors are type-check failures. Not logic errors. Not syntax mistakes. Type mismatches.

This single data point explains why TypeScript just overtook both Python and JavaScript as the most used language on GitHub. When AI tools generate more of our code, type systems transform from a nice-to-have into our primary defense against subtle bugs we didn't personally introduce.

## The Classic Debate Just Got Reframed

We've all participated in the "typed vs. untyped" religious war at some point. Dynamic languages like Python and JavaScript offered us speed and flexibility. Static typing gave us safety and tooling. Both sides had valid points - it really did depend on our project needs and team preferences.

But AI changed the fundamental assumption underlying that debate. The argument was always about code _we_ wrote. Now? A significant portion of our codebase comes from AI assistants, and that changes everything.

Think of it like this: when we cook our own meal, we know exactly what ingredients went in. But when we order delivery, we want food safety standards. Type systems are those standards for AI-generated code.

## What Octoverse 2025 Reveals

The data from [Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/) tells a compelling story. TypeScript reached 2.6 million developers as of August 2025, adding over 1 million contributors in just one year (+66% YoY). This wasn't gradual adoption - this was acceleration driven by AI-assisted development.

But TypeScript isn't alone. Other typed languages are seeing massive growth too:

*   **Luau** (Roblox's gradually typed scripting language): >194% YoY growth
*   **Typst** (a strongly typed alternative to LaTeX): >108% YoY growth
*   **Traditional typed languages** (Java, C++, C#): Renewed momentum across the board

The pattern is clear: gradual typing, optional typing, and strong typing are all benefiting from the AI coding revolution. Each offers different levels of guardrails depending on what we're building and how much we want AI to automate.

### Why Type Systems Work So Well With AI

Type systems serve as a contract between developers, frameworks, and AI tools. They catch the exact class of errors that AI-generated code tends to introduce:

*   **Mismatched function signatures** - When an AI tool generates a function call with the wrong parameter types
*   **Unexpected null/undefined values** - Type systems force us to handle these cases explicitly
*   **Property access errors** - Catching typos and wrong property names at compile time
*   **Return type confusion** - Ensuring functions return what our code expects

When frameworks like Next.js, Astro, and Angular scaffold projects in TypeScript by default, they're essentially saying: "We expect AI tools to generate code for this project, so we're including the safety net from day one."

### A Practical Example

Here's what this looks like in practice. Consider an AI tool generating an API integration:

```
// Without types (JavaScript)
function fetchUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => data.user); // What if data.user doesn't exist?
}

// With types (TypeScript)
interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse {
  user: User;
  timestamp: string;
}

async function fetchUserData(userId: number): Promise {
  const response = await fetch(`/api/users/${userId}`);
  const data: ApiResponse = await response.json();
  return data.user; // Compiler verifies this exists
}
```

The typed version catches issues at compile time that would've been runtime surprises in JavaScript. When an AI assistant generates this code, we get immediate feedback if something doesn't match our expectations.

## From My Experience as a GitHub Star

Working with GitHub Copilot and other AI coding tools daily, I've noticed this shift firsthand. Projects that start with TypeScript configuration have fewer "wait, what type is this?" moments during code review. The AI suggestions are more accurate because the type context gives the model better information about what we're trying to accomplish.

Here's something the article doesn't mention but I've observed: type systems also make AI-generated code more maintainable. Six months from now, when we're debugging that AI-generated feature, the type annotations serve as documentation. We instantly understand what data flows through the system.

The trade-off? Initial setup takes slightly longer. But that upfront cost pays dividends when AI tools generate hundreds of lines of scaffolding that Just Work™ because the types caught edge cases we didn't think about.

## This Doesn't Mean Dynamic Languages Are Dead

Let's be clear: Python, JavaScript, Ruby - they're not going anywhere. Dynamic languages still excel for rapid prototyping, scripting, data analysis, and countless other use cases. The article acknowledges this: untyped code can still be great for projects where we control every line.

But the calculus changes when AI becomes a significant contributor to our codebase. It's about matching our tools to our workflow. If we're leaning heavily on AI assistants, type safety becomes increasingly valuable. If we're writing everything ourselves and moving fast on a side project, dynamic languages might still be the better choice.

Many teams are adopting gradual typing strategies - starting with JavaScript but adding TypeScript in critical areas. Python has type hints. Ruby has Sorbet. The industry is converging on "types where they matter most" rather than all-or-nothing approaches.

## My Take

In my view, this trend represents a maturation of AI-assisted development. We're moving past the initial excitement of "wow, AI can write code!" into the more nuanced question of "how do we safely integrate AI-generated code into production systems?"

Type systems answer that question. They're not perfect - they can't catch logic errors or architectural mistakes. But they eliminate an entire class of bugs that become more common when we don't write every line ourselves. That 94% statistic isn't just interesting - it's a roadmap for how we should structure our projects in an AI-assisted world.

I'm adjusting my own approach based on this. New projects now start with TypeScript unless there's a specific reason not to. When mentoring developers, I emphasize type safety earlier in the learning path. The skills that matter in 2025 include understanding how to design type-safe interfaces that AI tools can work with effectively.

The "typed vs. untyped" debate isn't settled by ideology anymore. It's being settled by data, by our daily experience with AI tools, and by the simple reality that we need guardrails for code we didn't personally write. Type systems provide those guardrails without slowing us down.

Read Cassidy Williams' full analysis and explore the Octoverse 2025 data: [Why AI is pushing developers toward typed languages](https://github.blog/ai-and-ml/llms/why-ai-is-pushing-developers-toward-typed-languages/)