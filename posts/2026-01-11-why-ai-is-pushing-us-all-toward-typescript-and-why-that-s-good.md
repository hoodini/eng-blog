---
title: "Why AI Is Pushing Us All Toward TypeScript (And Why That's Good)"
date: "2026-01-11"
excerpt: "## The 94% Statistic That's Changing How We Code A recent [GitHub Blog post by Cassidy Williams](https://github.blog/ai-and-ml/llms/why-ai-is-pushing-developers..."
coverImage: "https://yuv-ai-images.s3.us-west-2.amazonaws.com/4HdjaY3xDsSBkdUPiJOd4Ak.jpg"
tags: ["github"]
author: "Yuval Avidani"
---

## The 94% Statistic That's Changing How We Code

A recent [GitHub Blog post by Cassidy Williams](https://github.blog/ai-and-ml/llms/why-ai-is-pushing-developers-toward-typed-languages/) reveals a striking finding: 94% of compilation errors in LLM-generated code are type-check failures. This single data point explains a massive shift happening across our industry - TypeScript has overtaken both Python and JavaScript to become the most-used language on GitHub, precisely as AI coding assistants became mainstream tools.

This matters to all of us because we're no longer just writing code - we're integrating, reviewing, and maintaining massive volumes of AI-generated code. That fundamental change in our workflow is forcing us to rethink decades-old assumptions about programming languages.

## The Trust Problem With AI-Generated Code

The most striking insight from Williams' analysis is about trust, not technology. When we write our own code, we internalize the logic. We catch edge cases through experience. We develop an intuition for what might break. That intimate knowledge creates confidence.

But AI agents scaffold entire features in seconds. They generate boilerplate, implement patterns, and produce outputs at a scale that makes traditional line-by-line code review impractical. We're suddenly responsible for code we didn't write, didn't think through, and often don't fully understand until something breaks in production.

This is where type systems stop being a preference and become a necessity. Think of it like building with LEGO versus modeling clay. Clay (dynamic typing) lets us mold anything quickly and change shape on the fly. But structures can collapse unexpectedly. LEGO (static typing) constrains us to compatible pieces, but what we build stays solid. When an AI generates a thousand lines of code, those type constraints become our quality assurance.

## What The Data Actually Shows

The 94% statistic isn't just dramatic - it's diagnostic. It tells us exactly where AI-generated code fails most often. Not logic errors. Not algorithm inefficiencies. Type mismatches. The AI confidently generates code that treats a string as a number, passes an object where an array is expected, or returns undefined when we need a specific structure.

The GitHub Octoverse 2025 report backs this up with adoption trends. TypeScript's rise correlates directly with the mainstream adoption of tools like GitHub Copilot. We're also seeing gradual typing systems explode across other ecosystems - Luau gaining traction in game development, Typst emerging for document generation, and Python developers embracing type hints more aggressively than ever.

This isn't developers suddenly discovering type safety after decades. We've known the benefits. This is us responding to a new reality where significant portions of our codebase come from sources that don't have our context, don't know our architecture, and can't intuit our edge cases.

## What This Means for Our Daily Work

The practical implications affect every aspect of how we build software:

### Immediate Feedback Loops

In typed languages, when AI generates code, our editor immediately highlights type mismatches. We catch issues before running tests, before commits, before code review. In dynamic languages, we discover problems at runtime - often in production, often in edge cases the AI didn't consider. That difference in feedback timing changes everything about our confidence in AI-generated code.

### Here's What This Looks Like

```
// TypeScript: AI generates this
interface UserData {
  id: number;
  name: string;
  email: string;
}

function processUser(user: UserData) {
  // Our editor immediately flags if AI passes wrong types
  return {
    displayName: user.name.toUpperCase(),
    contactInfo: user.email
  };
}

// If AI tries this:
processUser({ id: "123", name: "John" }); // Error caught immediately
// Missing email property, id is string not number

// JavaScript: Same AI-generated code
function processUser(user) {
  // No immediate feedback
  return {
    displayName: user.name.toUpperCase(),
    contactInfo: user.email
  };
}

// This silently accepts bad data:
processUser({ id: "123", name: "John" }); // Runs fine
// Runtime error later when we access user.email
```

### Practical Implications for Our Projects

*   **Architecture as Contract** - Type definitions become the specification our AI assistants must follow. We define interfaces first, then let AI implement within those constraints.
*   **Refactoring Confidence** - When we change a type definition, the compiler shows us every place AI-generated code needs updating. In dynamic languages, we discover breaks through tests or production incidents.
*   **Documentation Built-In** - Types serve as always-current documentation. We see what functions expect and return without reading implementation details or hunting for comments.

## From My Experience

Working with GitHub Copilot and other AI coding assistants across both TypeScript and JavaScript projects, the difference is dramatic. In TypeScript, I treat AI suggestions with more confidence. The type system catches the obvious mistakes instantly. I can accept larger code suggestions knowing the compiler will flag integration issues.

In JavaScript projects, I'm more conservative. I review AI suggestions more carefully, write more tests, and still catch type-related bugs in code review or QA. The feedback loop is longer and more expensive.

Here's a tip not in the original article: Consider starting new projects with strict TypeScript configuration even if you're used to allowing implicit any types. When AI is generating significant code, strict mode catches far more issues. Yes, it's more work upfront defining types, but that work happens once during setup. The payoff comes every time AI generates code that integrates cleanly because it respects those type boundaries.

### The Migration Reality

We're also seeing teams gradually adopt typing in existing codebases. Not rewriting everything overnight, but adding type definitions to modules where AI assistance is most valuable. Then expanding those typed boundaries as they see the benefits. Tools like TypeScript's allowJs option make this incremental approach practical.

## My Take

In my view, this isn't about TypeScript being objectively "better" than JavaScript, or static typing being superior to dynamic typing in all contexts. It's about matching our tools to our actual workflow.

When we write every line ourselves, when we hold the entire codebase in our head, when we have intimate knowledge of every function - dynamic languages offer genuine productivity gains. The flexibility, the speed, the lack of ceremony - these are real advantages.

But that's not how we build software anymore. We integrate libraries we didn't write, frameworks we only partially understand, and now massive amounts of AI-generated code we didn't personally review. In that reality, type systems stop being optional guardrails and become essential infrastructure.

We're not abandoning flexibility - we're adding structure where it matters most. The AI revolution didn't make typed languages better. It made the safety nets they provide necessary.

Read the full analysis: [Why AI is pushing developers toward typed languages](https://github.blog/ai-and-ml/llms/why-ai-is-pushing-developers-toward-typed-languages/) by Cassidy Williams on the GitHub Blog.