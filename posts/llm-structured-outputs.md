---
title: "Structured Outputs: The End of JSON Parsing Nightmares"
date: "2025-12-28"
excerpt: "Stop wrestling with regex and pray-parsing. Modern LLMs guarantee valid JSON output. Here's how."
coverImage: "/images/structured_outputs.png"
tags: ["AI", "Tutorials"]
author: "Yuval Avidani"
---

# Structured Outputs: Guaranteed JSON from LLMs

If you've ever written code like this, you know the pain:

```javascript
// The old way 😭
const response = await llm.complete(prompt);
const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
const data = JSON.parse(jsonMatch?.[1] ?? response);
// Pray it works...
```

## The New Way: Structured Outputs

Modern LLMs now support **guaranteed** structured outputs:

```typescript
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const schema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  confidence: z.number().min(0).max(1),
  keywords: z.array(z.string()),
  summary: z.string().max(200),
});

const { object } = await generateObject({
  model: openai("gpt-4-turbo"),
  schema,
  prompt: "Analyze this customer review: ...",
});

// object is fully typed and validated!
console.log(object.sentiment); // TypeScript knows this exists
```

## How It Works

1. **Constrained Decoding**: The model's output tokens are constrained to only produce valid JSON
2. **Schema Validation**: The structure is validated against your schema in real-time
3. **Type Safety**: Full TypeScript inference from your Zod schema

## Supported Providers

| Provider | Support |
|----------|---------|
| OpenAI | ✅ Native |
| Anthropic | ✅ Native |
| Google | ✅ Native |
| Ollama | ✅ With guidance |
| Together AI | ✅ Native |

## Advanced Patterns

### Recursive Schemas

```typescript
const TreeNode = z.object({
  value: z.string(),
  children: z.lazy(() => z.array(TreeNode)).optional(),
});
```

### Union Types

```typescript
const Response = z.discriminatedUnion("type", [
  z.object({ type: z.literal("success"), data: DataSchema }),
  z.object({ type: z.literal("error"), message: z.string() }),
]);
```

### Streaming Structured Data

```typescript
const { partialObjectStream } = await streamObject({
  model: openai("gpt-4-turbo"),
  schema: ProductSchema,
  prompt: "Generate a product listing",
});

for await (const partial of partialObjectStream) {
  // Update UI with partial data as it streams
  updateUI(partial);
}
```

## Best Practices

1. **Keep schemas focused** - One schema per task
2. **Use descriptions** - Help the model understand fields
3. **Set reasonable limits** - Max lengths prevent runaway generation
4. **Handle edge cases** - Use optional fields and defaults

Structured outputs eliminated an entire class of bugs from my applications. Make the switch.
