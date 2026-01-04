---
title: "Prompt Caching Cut Our AI Costs by 70%"
date: "2025-12-15"
excerpt: "We were spending $50K/month on AI. One architectural change dropped it to $15K. Here's exactly how."
coverImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80"
tags: ["AI", "Cost Optimization"]
author: "Yuval Avidani"
---

# Prompt Caching Cut Our AI Costs by 70%

We were bleeding money on AI API costs. Then we discovered prompt caching.

## The Problem

Our AI customer service bot was handling 100K conversations/month. Each conversation:
- 4KB system prompt
- 2KB few-shot examples
- 1KB user context
- Variable user messages

**Cost: $50,000/month** 💸

## The Insight

90% of our tokens were **static**:
- System prompt: Same for everyone
- Few-shot examples: Rarely change
- User context: Same within a session

We were paying to send the same tokens over and over.

## Solution: Prompt Caching

### Anthropic's Cache

```typescript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: systemPrompt, // 4KB of instructions
      cache_control: { type: "ephemeral" } // 👈 Cache this
    },
    {
      type: "text", 
      text: fewShotExamples, // 2KB of examples
      cache_control: { type: "ephemeral" } // 👈 Cache this too
    }
  ],
  messages: [{ role: "user", content: userMessage }]
});

// Cache hit = 90% cost reduction on cached tokens!
```

### OpenAI's Approach

```typescript
// OpenAI uses automatic caching for identical prefixes
// Just structure your prompts consistently:

const messages = [
  { role: "system", content: STATIC_SYSTEM_PROMPT },
  { role: "user", content: STATIC_CONTEXT },
  { role: "user", content: dynamicUserInput }, // Only this varies
];

// OpenAI automatically caches the static prefix
```

### Self-Hosted with Semantic Cache

```typescript
import { SemanticCache } from "ai-cache";

const cache = new SemanticCache({
  redis: redisClient,
  embedding: openai.embeddings,
  threshold: 0.95, // Similarity threshold
});

async function query(prompt: string) {
  // Check semantic cache
  const cached = await cache.get(prompt);
  if (cached) return cached;
  
  // Miss - call API
  const response = await llm.complete(prompt);
  await cache.set(prompt, response);
  return response;
}
```

## Advanced Strategies

### 1. Prompt Deduplication

```typescript
// Before: Redundant context in every message
messages.push({ role: "user", content: `Context: ${ctx}\n\nQuestion: ${q1}` });
messages.push({ role: "user", content: `Context: ${ctx}\n\nQuestion: ${q2}` });

// After: Context once, questions reference it
messages.push({ role: "system", content: `Context: ${ctx}` });
messages.push({ role: "user", content: q1 });
messages.push({ role: "user", content: q2 });
```

### 2. Response Caching

```typescript
// Cache entire responses for common queries
const cacheKey = hash(prompt + model + temperature);
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
```

### 3. Tiered Models

```typescript
// Use cheaper models for simple queries
const complexity = await classifier.analyze(query);
const model = complexity > 0.7 ? "gpt-4" : "gpt-3.5-turbo";
```

## Results

| Metric | Before | After |
|--------|--------|-------|
| Monthly cost | $50,000 | $15,000 |
| Avg latency | 2.1s | 0.8s |
| Cache hit rate | 0% | 73% |

## Key Takeaways

1. **Audit your prompts** - Find the static parts
2. **Structure for caching** - Put static content first
3. **Monitor hit rates** - Optimize based on data
4. **Combine strategies** - Caching + model routing + response cache

The best AI cost optimization doesn't sacrifice quality. It eliminates waste.
