---
title: "Structured Outputs: The End of JSON Parsing Nightmares"
date: "2025-12-28"
excerpt: "Stop wrestling with regex and pray-parsing. Modern LLMs guarantee valid JSON output. Here's how structured outputs work, why they matter, and how to use them effectively in production."
coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80"
tags: ["AI", "Tutorials"]
author: "Yuval Avidani"
---

## The Pain We've All Experienced

If you've built any LLM-powered feature, you know this pain intimately. You need structured data from the model - maybe a sentiment score, extracted entities, or a classification result. So you craft a prompt:

```javascript
const prompt = `Analyze this review and return JSON with sentiment and keywords:
"The product was amazing but shipping took forever"`;

const response = await llm.complete(prompt);

// Now what? The model might return:
// - Valid JSON
// - JSON wrapped in markdown code blocks
// - A conversational response with JSON somewhere in it
// - Completely malformed JSON
// - Something that looks like JSON but isn't quite

// So you write this nightmare:
const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
let data;
try {
  data = JSON.parse(jsonMatch?.[1] ?? response);
} catch (e) {
  // Try to extract JSON some other way...
  const braceMatch = response.match(/\{[\s\S]*\}/);
  data = JSON.parse(braceMatch?.[0]);
}
// Pray it works...
```

This pattern is fragile, error-prone, and breaks in production with embarrassing frequency. Every LLM developer has war stories of parsing failures at 2 AM.

This matters because structured outputs are fundamental to building reliable AI applications. If you can't trust that your LLM returns valid, schema-conforming data, you can't build robust systems. You're always one malformed response away from a crash.

## The Solution: Guaranteed Structured Outputs

Modern LLMs now support **constrained decoding** - the model's output tokens are literally constrained to only produce valid JSON matching your schema. This isn't a prompt engineering trick; it's a fundamental change in how generation works.

### How It Works Under the Hood

During normal LLM generation, the model predicts probability distributions over all possible next tokens. With structured outputs:

1. You provide a JSON schema
2. The inference engine tracks the current position in the schema
3. At each decoding step, impossible tokens (those that would violate the schema) are masked out
4. The model can only select from tokens that keep the output valid

This means:
- **100% valid JSON** - Syntactically correct every time
- **Schema compliance** - Required fields are present, types are correct
- **Type safety** - Full TypeScript inference from your schema

### The Modern API Pattern

Here's how structured outputs work with the Vercel AI SDK and Zod:

```typescript
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

// Define your schema with Zod
const ReviewAnalysisSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  confidence: z.number().min(0).max(1).describe("Confidence score from 0-1"),
  keywords: z.array(z.string()).max(10).describe("Key topics mentioned"),
  summary: z.string().max(200).describe("Brief summary of the review"),
  aspects: z.array(z.object({
    aspect: z.string().describe("e.g., 'shipping', 'quality', 'price'"),
    sentiment: z.enum(["positive", "negative", "neutral"]),
    quote: z.string().optional().describe("Relevant quote from review"),
  })).describe("Sentiment broken down by aspect"),
});

// Type is automatically inferred
type ReviewAnalysis = z.infer<typeof ReviewAnalysisSchema>;

const { object } = await generateObject({
  model: openai("gpt-4-turbo"),
  schema: ReviewAnalysisSchema,
  prompt: `Analyze this customer review:
    "The product was amazing but shipping took forever.
     Great quality for the price, will buy again despite delivery issues."`,
});

// object is fully typed as ReviewAnalysis
console.log(object.sentiment);        // TypeScript knows this is string
console.log(object.aspects[0].quote); // TypeScript knows this might be undefined
```

No parsing. No try/catch. No regex. Just typed data.

## Provider Comparison: Who Supports What

| Provider | Support | Method | Notes |
|----------|---------|--------|-------|
| OpenAI | Native | `response_format: { type: "json_schema" }` | Best support, fastest |
| Anthropic | Native | `tool_use` with single tool | Works well, slightly different pattern |
| Google (Gemini) | Native | `generationConfig.responseSchema` | Good support |
| Mistral | Native | `response_format` | Similar to OpenAI |
| Ollama | Via guidance | External library | Works but slower |
| Together AI | Native | `response_format` | Good support |
| Groq | Native | `response_format` | Fast inference |

### OpenAI Native Example

```typescript
import OpenAI from "openai";

const openai = new OpenAI();

const completion = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [
    { role: "user", content: "Extract person info from: John Doe, 35, engineer at Google" }
  ],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "person_info",
      strict: true,
      schema: {
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "integer" },
          occupation: { type: "string" },
          company: { type: "string" },
        },
        required: ["name", "age", "occupation", "company"],
        additionalProperties: false,
      },
    },
  },
});

const person = JSON.parse(completion.choices[0].message.content);
// { name: "John Doe", age: 35, occupation: "engineer", company: "Google" }
```

### Anthropic via Tool Use

Anthropic's approach uses tool calling with a single tool:

```typescript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  tools: [{
    name: "extract_person",
    description: "Extract person information from text",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "integer" },
        occupation: { type: "string" },
        company: { type: "string" },
      },
      required: ["name", "age", "occupation", "company"],
    },
  }],
  tool_choice: { type: "tool", name: "extract_person" },
  messages: [
    { role: "user", content: "Extract person info from: John Doe, 35, engineer at Google" }
  ],
});

// Access structured data from tool use
const toolUse = response.content.find(block => block.type === "tool_use");
const person = toolUse.input;
// { name: "John Doe", age: 35, occupation: "engineer", company: "Google" }
```

## Advanced Schema Patterns

### Recursive Schemas

For tree-like structures:

```typescript
// Define base type first
type TreeNode = {
  value: string;
  children?: TreeNode[];
};

// Create recursive Zod schema
const TreeNodeSchema: z.ZodType<TreeNode> = z.object({
  value: z.string(),
  children: z.lazy(() => z.array(TreeNodeSchema)).optional(),
});

// Use for org charts, file systems, nested categories
const { object: orgChart } = await generateObject({
  model: openai("gpt-4-turbo"),
  schema: TreeNodeSchema,
  prompt: "Create an org chart for a small startup",
});
```

### Discriminated Unions

For polymorphic responses:

```typescript
const ResponseSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("success"),
    data: z.object({
      id: z.string(),
      createdAt: z.string().datetime(),
    }),
  }),
  z.object({
    type: z.literal("error"),
    errorCode: z.string(),
    message: z.string(),
    retryable: z.boolean(),
  }),
  z.object({
    type: z.literal("pending"),
    estimatedCompletion: z.string().datetime(),
    currentStep: z.string(),
  }),
]);

const { object: result } = await generateObject({
  model: openai("gpt-4-turbo"),
  schema: ResponseSchema,
  prompt: "Process this order and return the appropriate status...",
});

// TypeScript narrows the type based on discriminator
if (result.type === "success") {
  console.log(result.data.id); // TypeScript knows this exists
} else if (result.type === "error") {
  console.log(result.message); // TypeScript knows this exists
}
```

### Optional Fields with Defaults

```typescript
const ConfigSchema = z.object({
  name: z.string(),
  retries: z.number().default(3),
  timeout: z.number().default(5000),
  features: z.array(z.string()).default([]),
  metadata: z.record(z.string()).optional(),
});

// Model can omit optional/default fields
// Your code receives complete objects with defaults applied
```

### Constrained Values

```typescript
const ProductSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive().multipleOf(0.01), // Valid currency
  quantity: z.number().int().min(0).max(10000),
  category: z.enum(["electronics", "clothing", "food", "other"]),
  sku: z.string().regex(/^[A-Z]{3}-\d{6}$/), // Format: ABC-123456
  tags: z.array(z.string()).min(1).max(5),
});
```

## Streaming Structured Data

For long-running generations, stream partial objects:

```typescript
import { streamObject } from "ai";

const { partialObjectStream } = await streamObject({
  model: openai("gpt-4-turbo"),
  schema: z.object({
    title: z.string(),
    sections: z.array(z.object({
      heading: z.string(),
      content: z.string(),
    })),
    conclusion: z.string(),
  }),
  prompt: "Write a detailed article about climate change",
});

for await (const partial of partialObjectStream) {
  // Update UI with partial data
  // { title: "Climate" }
  // { title: "Climate Change", sections: [{ heading: "Int" }] }
  // { title: "Climate Change", sections: [{ heading: "Introduction", content: "Climate..." }] }
  updateUI(partial);
}
```

The UI updates as the object builds, providing instant feedback while maintaining type safety.

## Error Handling and Edge Cases

Structured outputs are reliable, but you still need error handling:

```typescript
import { generateObject, JSONParseError, TypeValidationError } from "ai";

try {
  const { object } = await generateObject({
    model: openai("gpt-4-turbo"),
    schema: MySchema,
    prompt: userInput,
  });
  return object;
} catch (error) {
  if (error instanceof JSONParseError) {
    // Model produced invalid JSON (rare with native support)
    console.error("JSON parse failed:", error.text);
    return fallbackValue;
  }
  if (error instanceof TypeValidationError) {
    // JSON valid but doesn't match schema (rare with strict mode)
    console.error("Schema validation failed:", error.value);
    return fallbackValue;
  }
  // Network error, rate limit, etc.
  throw error;
}
```

### Common Pitfalls

**1. Schema Too Complex**

Deeply nested schemas with many constraints slow inference. Simplify where possible:

```typescript
// Slow: Deep nesting, many constraints
const ComplexSchema = z.object({
  level1: z.object({
    level2: z.object({
      level3: z.object({
        level4: z.array(z.object({...})),
      }),
    }),
  }),
});

// Better: Flatter structure
const SimpleSchema = z.object({
  items: z.array(z.object({
    path: z.string(), // "level1.level2.level3"
    value: z.string(),
  })),
});
```

**2. Overly Strict Enums**

If your enum doesn't cover all cases, the model struggles:

```typescript
// Problematic: What if sentiment is mixed?
const schema = z.object({
  sentiment: z.enum(["positive", "negative"]),
});

// Better: Include edge cases
const schema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral", "mixed"]),
});
```

**3. Missing Descriptions**

Schema descriptions help the model understand intent:

```typescript
// Without descriptions: Model guesses
const schema = z.object({
  score: z.number(),
  text: z.string(),
});

// With descriptions: Model understands
const schema = z.object({
  score: z.number()
    .min(0).max(100)
    .describe("Quality score from 0-100, where 100 is perfect"),
  text: z.string()
    .max(500)
    .describe("Human-readable explanation of the score"),
});
```

## Performance Considerations

Structured outputs add overhead compared to free-form generation:

| Aspect | Impact | Mitigation |
|--------|--------|------------|
| Latency | +5-15% | Use simpler schemas |
| Token usage | Similar | Schemas don't count as tokens |
| Error rate | Much lower | Worth the trade-off |
| Development time | Much lower | Worth the trade-off |

The latency increase is minimal compared to the reliability gains. In my production systems, structured outputs eliminated ~15% of my error handling code and reduced LLM-related bugs by 90%.

## Real-World Use Cases

### Content Classification

```typescript
const ClassificationSchema = z.object({
  category: z.enum([
    "technical_support",
    "billing",
    "feature_request",
    "bug_report",
    "general_inquiry"
  ]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  sentiment: z.enum(["positive", "neutral", "negative"]),
  language: z.string().describe("ISO 639-1 language code"),
  suggestedTags: z.array(z.string()).max(5),
});

// Classify incoming support tickets
const { object: classification } = await generateObject({
  model: openai("gpt-4-turbo"),
  schema: ClassificationSchema,
  prompt: `Classify this support ticket: "${ticketContent}"`,
});

// Route based on classification
routeToQueue(classification.category, classification.priority);
```

### Entity Extraction

```typescript
const EntitiesSchema = z.object({
  people: z.array(z.object({
    name: z.string(),
    role: z.string().optional(),
    organization: z.string().optional(),
  })),
  organizations: z.array(z.object({
    name: z.string(),
    type: z.enum(["company", "government", "nonprofit", "other"]),
  })),
  locations: z.array(z.object({
    name: z.string(),
    type: z.enum(["city", "country", "region", "address"]),
  })),
  dates: z.array(z.object({
    original: z.string().describe("As mentioned in text"),
    normalized: z.string().describe("ISO 8601 format if possible"),
  })),
});

// Extract structured entities from documents
const { object: entities } = await generateObject({
  model: openai("gpt-4-turbo"),
  schema: EntitiesSchema,
  prompt: `Extract all entities from: "${documentText}"`,
});
```

### Data Transformation

```typescript
const NormalizedProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(100),
  description: z.string().max(1000),
  price: z.object({
    amount: z.number().positive(),
    currency: z.enum(["USD", "EUR", "GBP"]),
  }),
  categories: z.array(z.string()),
  attributes: z.record(z.string()),
});

// Normalize messy product data
const { object: normalized } = await generateObject({
  model: openai("gpt-4-turbo"),
  schema: NormalizedProductSchema,
  prompt: `Normalize this product data into our schema:
    ${JSON.stringify(messyProductData)}`,
});
```

## Best Practices

### 1. Start Simple, Add Complexity

Begin with minimal schemas and add fields as needed:

```typescript
// Start here
const v1 = z.object({
  result: z.string(),
});

// Add fields based on actual needs
const v2 = z.object({
  result: z.string(),
  confidence: z.number(),
  reasoning: z.string().optional(),
});
```

### 2. Use Descriptions Liberally

Descriptions are free and improve quality:

```typescript
const schema = z.object({
  recommendation: z.enum(["approve", "reject", "review"])
    .describe("Final recommendation for the application"),
  riskScore: z.number().min(0).max(100)
    .describe("Risk assessment score, higher means more risky"),
  factors: z.array(z.string())
    .describe("Key factors that influenced the recommendation"),
});
```

### 3. Handle Edge Cases in Schema

Anticipate what the model might need to express:

```typescript
const schema = z.object({
  answer: z.string().nullable()
    .describe("The answer, or null if the question cannot be answered"),
  confidence: z.enum(["high", "medium", "low", "unknown"]),
  sources: z.array(z.string())
    .describe("Sources used, empty array if none"),
});
```

### 4. Test with Adversarial Inputs

Verify your schema handles edge cases:

```typescript
const testCases = [
  "Normal input that should work fine",
  "", // Empty input
  "🎉🎊🎈", // Unicode
  "A".repeat(10000), // Very long input
  "<script>alert('xss')</script>", // Potentially malicious
];

for (const input of testCases) {
  const { object } = await generateObject({ schema, prompt: input });
  validateOutput(object);
}
```

## My Take: This Changes Everything

In my opinion, structured outputs are the most important LLM feature for production applications since function calling. They eliminate an entire class of bugs and make LLM integration feel as reliable as calling any other API.

Before structured outputs, I spent 20-30% of my LLM integration code on parsing and validation. Now it's essentially zero. The reliability improvement is dramatic - from ~95% success rate with careful prompt engineering to effectively 100% with structured outputs.

If you're building LLM-powered features and not using structured outputs, you're making your life unnecessarily difficult. Every major provider supports them now. The migration is straightforward. The benefits are immediate.

Make the switch. Your on-call rotation will thank you.
