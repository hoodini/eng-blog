---
title: "Beads: Git-Backed Memory for AI Agents That Actually Remembers"
date: "2026-01-13"
excerpt: "## How We Finally Got AI Agents That Remember Across Git Branches The project [Beads](https://github.com/steveyegge/beads) by Steve Yegge solves the persistent ..."
coverImage: "https://yuv-ai-images.s3.us-west-2.amazonaws.com/6J9maeieOru0xN8Psv-ewQ0.jpg"
tags: ["github"]
author: "Yuval Avidani"
---

## How We Finally Got AI Agents That Remember Across Git Branches

The project [Beads](https://github.com/steveyegge/beads) by Steve Yegge solves the persistent memory problem we all face when working with AI coding agents. Instead of agents forgetting everything when our context window fills up or when we switch branches, Beads stores agent thoughts and task dependencies as versioned files right inside our Git repository.

## The Problem We All Know Too Well

We've all experienced this frustration. We start a coding session with our AI agent, it understands the task, makes good progress, writes some code, updates files. Then 50 interactions later, the agent has completely forgotten the architectural decisions we made together 30 minutes ago. It's asking us to explain things we already covered. It's suggesting approaches we explicitly rejected earlier.

We try different solutions. We paste everything into markdown files to track the plan, but those files get stale and out of sync with reality. We rely on chat history, but that's ephemeral and doesn't survive when we close the session or switch to a different branch. We try external memory databases, but keeping them synchronized with our actual Git state becomes its own problem. Our agents essentially have short-term memory only, and we end up being the external hard drive, manually reminding them of context.

The core issue is that agent memory lives separately from our code versioning. When we branch our code to try an experiment, our agent's context doesn't branch with it. When we merge code from different branches, the agent's understanding doesn't merge. We lose the reasoning behind decisions, the dependency relationships between tasks, and the historical context of what we tried and why.

## How Beads Works - Git as a Memory Database

Beads takes a fundamentally different approach by treating Git itself as the persistence layer for agent memory. All agent thoughts, plans, and task dependencies get stored as JSONL (JSON Lines) files in a \`.beads/\` directory within our project. Think of it like giving our agent a lab notebook that gets versioned alongside the code it produces.

When we branch our code to try a new feature, we automatically branch the agent's entire context and task graph with it. When we merge code changes, we merge the agent's memory too. The agent's understanding of what it's doing becomes a first-class part of our repository, not a separate external system we have to keep in sync.

### Quick Start

Here's how we get started with Beads:

```
# Install Beads
pip install beads-ai

# Initialize in our project
cd our-project
beads init

# The agent can now create and track tasks
beads task create "Implement user authentication"
beads task create "Add password hashing" --parent bd-a1b2

# View the task graph
beads graph
```

### A Real Example - Multi-Step Refactoring

Let's say we're doing a complex refactoring that spans multiple sessions:

```
# Session 1: Agent creates the plan
beads task create "Refactor database layer" --id bd-db01
beads task create "Extract connection pooling" --parent bd-db01
beads task create "Add migration scripts" --parent bd-db01
beads task create "Update all queries" --parent bd-db01 --blocked-by bd-db02

# We commit this plan with our code
git add .beads/
git commit -m "Planning database refactor"

# Session 2 (next day): Agent picks up exactly where we left off
beads task list --open
# Shows our full dependency graph, knows what's blocking what

# We branch to try a different approach
git checkout -b alternative-approach
# The .beads/ directory branches too - agent context is isolated

# Later we merge back
git checkout main
git merge alternative-approach
# Beads merges task updates without conflicts thanks to hash-based IDs
```

## Key Technical Features

*   **Zero-Conflict IDs** - Uses hash-based identifiers like \`bd-a1b2\` instead of sequential numbers. This means multiple agents or branches can create tasks simultaneously, and when we merge, there are no ID collisions. Think of it like Git commit hashes - they're designed to be unique even when created independently.
*   **Dependency Graph** - Maintains parent-child relationships and blocking dependencies between tasks. Our agent actually understands that task A blocks task B, and won't try to complete B until A is done. This is way more sophisticated than a flat todo list.
*   **Compaction Mechanism** - Implements what they call 'semantic memory decay'. Closed tasks get summarized to free up context window space, but the reasoning and decisions are preserved in compressed form. Like how our brain consolidates short-term memories into long-term storage.
*   **Invisible Infrastructure** - Uses a local SQLite cache for fast queries while the source of truth remains the JSONL files. A background daemon keeps the cache synced. We get database-level performance without actually running a database server.
*   **Stealth Mode** - We can use Beads to track our own thoughts and decisions even when working without an agent, or track what the agent is doing without it being aware. Useful for personal task management or observability.

## When to Use Beads vs. Other Memory Solutions

Tools like LangChain memory modules or vector databases are great for semantic search over past conversations. They excel at "what did we discuss about authentication?" type queries. Beads serves a different purpose - it's about maintaining structured task state and dependency relationships that need to survive branching and merging.

We'd use Beads when we're doing multi-session, complex engineering work where the agent needs to maintain a coherent long-term plan. We'd use traditional memory systems when we need semantic retrieval over historical conversations. In practice, we might use both - Beads for task/dependency tracking, and vector memory for conversational context.

If we're already happy with external task tracking tools like Linear or Jira and they integrate well with our agent workflows, Beads might be overkill. But if we want our agent's memory to be a native part of our codebase versioning, this is a compelling approach.

## My Take - Will I Use This?

In my view, this addresses a real gap in our AI agent infrastructure. The idea of versioning agent memory alongside code is elegant and solves genuine problems we face in multi-session agent work. The hash-based ID system is clever - it's the same insight that makes distributed version control work, applied to task management.

The use cases I'm most excited about: long-horizon refactoring projects where we work with an agent over days or weeks, experimental branches where we want isolated agent context, and code review scenarios where we want to preserve the reasoning behind changes. Being able to see the agent's thought process in Git history alongside the code changes it made is genuinely valuable.

The limitation to watch: this requires discipline. We need to actually use the task graph structure instead of just freestyle prompting the agent. It's additional overhead during the flow. But for serious engineering work where we need agents to maintain coherent long-term plans, that overhead pays off.

I'm planning to try Beads on our next major refactoring project. The ability to branch agent context with code, and merge both together, feels like the right abstraction. Check it out: [Beads on GitHub](https://github.com/steveyegge/beads)