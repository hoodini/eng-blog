---
title: "Testing AI Applications: A Practical Framework"
date: "2025-12-18"
excerpt: "Your AI app works in demos but fails in production. Here's how to test non-deterministic systems."
coverImage: "/images/ai_testing.png"
tags: ["AI", "Testing"]
author: "Yuval Avidani"
---

# Testing AI Applications: Beyond Vibes

"It works on my prompt" is not a testing strategy. Here's how to actually test AI apps.

## The Challenge

AI systems are:
- **Non-deterministic**: Same input, different outputs
- **Subjective**: "Good" is hard to define
- **Expensive**: Every test costs API credits
- **Slow**: Latency makes test suites painful

## The Testing Pyramid for AI

```
        /\
       /  \  Human Evaluation
      /----\  
     /      \  LLM-as-Judge
    /--------\
   /          \  Assertion Tests
  /------------\
 /              \  Unit Tests
/________________\
```

## Level 1: Unit Tests

Test your deterministic code:

```typescript
describe("PromptBuilder", () => {
  it("should include system message", () => {
    const prompt = buildPrompt({ task: "summarize", context: "..." });
    expect(prompt).toContain("You are a summarization assistant");
  });

  it("should truncate long contexts", () => {
    const longContext = "x".repeat(100000);
    const prompt = buildPrompt({ task: "summarize", context: longContext });
    expect(prompt.length).toBeLessThan(50000);
  });
});
```

## Level 2: Assertion Tests

Test structural properties of outputs:

```typescript
describe("AI Responses", () => {
  it("should return valid JSON", async () => {
    const response = await ai.analyze(testInput);
    expect(() => JSON.parse(response)).not.toThrow();
  });

  it("should include required fields", async () => {
    const response = await ai.extractEntities(testInput);
    expect(response).toHaveProperty("entities");
    expect(response.entities).toBeInstanceOf(Array);
  });

  it("should not hallucinate URLs", async () => {
    const response = await ai.generateArticle(topic);
    const urls = extractUrls(response);
    for (const url of urls) {
      const exists = await checkUrlExists(url);
      expect(exists).toBe(true);
    }
  });
});
```

## Level 3: LLM-as-Judge

Use a model to evaluate another model:

```typescript
async function evaluateResponse(input: string, output: string) {
  const evaluation = await judge.evaluate({
    input,
    output,
    criteria: [
      "Accuracy: Is the information factually correct?",
      "Relevance: Does it answer the question?",
      "Completeness: Are all aspects covered?",
      "Clarity: Is it easy to understand?",
    ],
  });
  
  return evaluation.scores; // { accuracy: 0.9, relevance: 0.95, ... }
}

describe("Response Quality", () => {
  it("should score above threshold", async () => {
    const output = await ai.answer(testQuestion);
    const scores = await evaluateResponse(testQuestion, output);
    
    expect(scores.accuracy).toBeGreaterThan(0.8);
    expect(scores.relevance).toBeGreaterThan(0.9);
  });
});
```

## Level 4: Human Evaluation

For critical paths, there's no substitute:

```typescript
// Flag responses for human review
if (confidence < 0.7 || containsSensitiveTopics(response)) {
  await queueForHumanReview(response);
}
```

## CI/CD Integration

```yaml
name: AI Tests

on: [push]

jobs:
  test:
    steps:
      - name: Unit & Assertion Tests
        run: npm test
        
      - name: AI Evaluation (sampling)
        run: npm run test:ai -- --sample=50
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          
      - name: Cost Check
        run: |
          if [ "$TEST_COST" -gt "10" ]; then
            echo "Tests exceeded $10 budget"
            exit 1
          fi
```

## Key Metrics to Track

- **Pass rate** over time
- **Latency** p50, p95, p99
- **Cost per test**
- **Regression detection**

Testing AI is hard. But shipping untested AI is harder.
