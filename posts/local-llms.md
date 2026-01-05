---
title: "Self-Hosting LLMs with Ollama"
date: "2025-12-20"
excerpt: "Stop paying OpenAI. Run Llama 3 on your MacBook Pro and keep your data private."
coverImage: "/images/local_llms_cover.png"
tags: ["AI", "Tutorials"]
author: "Yuval Avidani"
---

## Why You Should Run LLMs Locally (And How Ollama Makes It Dead Simple)

The project [Ollama](https://github.com/ollama/ollama) solves the problem of running large language models on your own hardware without needing a PhD in machine learning infrastructure. If you've been paying monthly bills to OpenAI or Anthropic and wondering if there's a better way, or if you're concerned about sending sensitive data to third-party APIs, local LLMs are the answer you've been looking for.

This matters to all of us as developers because we're building AI-powered features into everything. Customer support bots reading sensitive tickets. Code assistants processing proprietary codebases. Data analysis tools working with private business metrics. Every API call to a cloud LLM is a potential data leak, a cost that scales with usage, and a dependency on external services that can change pricing or terms at any moment.

## The Problem With Cloud LLMs

Here's the current reality: you build an amazing AI feature. You integrate with OpenAI's API, and everything works beautifully in development. Then you launch. Users love it. Usage explodes. Your API bill goes from $50 to $5,000 to $50,000 per month. Now you're stuck - you can't raise prices without losing users, but your margins are being destroyed by LLM costs.

Or consider the privacy angle. You're a healthcare startup building an AI assistant for doctors. Patient data cannot legally leave your infrastructure. Cloud LLMs are off the table. You need something that runs on-premise, responds quickly, and doesn't require a team of ML engineers to maintain.

We've tried existing solutions. Deploying models with raw PyTorch or Hugging Face Transformers works, but requires deep knowledge of model quantization, GPU memory management, and inference optimization. Cloud providers like AWS SageMaker or Google Vertex AI offer managed endpoints, but you're still paying per-token costs and dealing with network latency. Running your own inference server with vLLM or TGI is powerful but complex - you need to configure batching, manage model loading, handle scaling, and debug CUDA errors at 3 AM.

## How Ollama Actually Works

Ollama treats running LLMs like running Docker containers - it abstracts away all the complexity and gives you a simple CLI. Under the hood, it uses llama.cpp (a highly optimized C++ inference engine originally built for Meta's Llama models) to run models efficiently on CPUs and consumer GPUs. But you interact with it through commands that feel natural, like installing an app or starting a service.

Here's the key insight: instead of managing Python environments, installing CUDA drivers, downloading model weights manually, and writing custom inference code, Ollama packages everything into a single binary. You say "I want to run Llama 3," and Ollama downloads the optimized model, loads it into memory, and exposes a local API endpoint. That's it.

The framework handles model quantization automatically - converting models from 16-bit or 32-bit precision down to 4-bit or 8-bit (dramatically reducing memory requirements while maintaining quality). It manages context windows, streaming responses, and concurrent requests. It even handles model updates and caching. You write the application logic, and Ollama handles the LLM infrastructure.

## Getting Started - The 2-Minute Setup

Installation is genuinely this simple:

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download from ollama.ai
```

Start the Ollama service (on macOS/Linux it runs as a background service automatically):

```bash
ollama serve  # Optional - service auto-starts on macOS
```

Now pull and run a model:

```bash
# Download and run Llama 3 (8B parameter model)
ollama run llama3

# Or try other models
ollama run codellama      # Optimized for code
ollama run mistral        # Fast, smaller model
ollama run llama3:70b     # Larger, more capable (needs more RAM)
```

That's it. You now have a cutting-edge LLM running locally. The first run downloads the model (a few gigabytes), then subsequent runs start instantly.

## Real-World Integration

The power of Ollama comes from its OpenAI-compatible API. Here's how I integrate it into production applications:

```typescript
// Using LangChain.js - drop-in replacement for OpenAI
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatOllama({
  baseUrl: "http://localhost:11434", // Ollama's default endpoint
  model: "llama3",
  temperature: 0.7,
});

const messages = [
  new HumanMessage("Explain quantum computing in simple terms")
];

const response = await model.invoke(messages);
console.log(response.content);
```

Or with vanilla JavaScript/fetch:

```javascript
const response = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "llama3",
    prompt: "Write a Python function to parse JSON",
    stream: false
  })
});

const data = await response.json();
console.log(data.response);
```

### Streaming Responses

For chat applications where you want real-time token-by-token output:

```typescript
const response = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  body: JSON.stringify({
    model: "llama3",
    prompt: "Explain React hooks",
    stream: true  // Enable streaming
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split("\n").filter(Boolean);
  
  for (const line of lines) {
    const data = JSON.parse(line);
    process.stdout.write(data.response);  // Stream to user
  }
}
```

## Model Selection Guide

Different tasks need different models. Here's what I use:

| Model | Size | Use Case | Performance |
|-------|------|----------|-------------|
| llama3:8b | 4.7GB | General chat, summarization | Fast, good quality |
| llama3:70b | 40GB | Complex reasoning, writing | Slower, excellent quality |
| codellama:7b | 3.8GB | Code generation, debugging | Fast, code-optimized |
| mistral:7b | 4.1GB | Quick queries, classification | Very fast, efficient |
| phi3:mini | 2.3GB | Edge devices, mobile | Ultra-fast, decent quality |
| llama3-vision | 5.2GB | Image understanding | Multimodal capabilities |

Pull any model with: `ollama pull <model-name>`

List installed models: `ollama list`

Remove models you don't need: `ollama rm <model-name>`

## Advanced Use Cases

### Custom Model Configurations

Create a `Modelfile` to customize behavior:

```dockerfile
FROM llama3

# Set custom parameters
PARAMETER temperature 0.8
PARAMETER top_p 0.95
PARAMETER top_k 40

# Set system prompt
SYSTEM """
You are an expert Python developer specializing in web scraping.
Always provide working code with error handling.
Use requests and BeautifulSoup libraries.
"""
```

Build your custom model:

```bash
ollama create python-expert -f ./Modelfile
ollama run python-expert
```

### Running Multiple Models Concurrently

Ollama can serve multiple models simultaneously (if you have the RAM/VRAM):

```bash
# Terminal 1
ollama run llama3

# Terminal 2 (new session)
ollama run codellama
```

Access them via different API calls by specifying the model name.

### RAG (Retrieval-Augmented Generation)

Build a local knowledge base without cloud APIs:

```typescript
import { Ollama } from "@langchain/community/llms/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { RetrievalQAChain } from "langchain/chains";

// Generate embeddings locally
const embeddings = new OllamaEmbeddings({
  model: "llama3",
  baseUrl: "http://localhost:11434",
});

// Store your documents
const vectorStore = await MemoryVectorStore.fromTexts(
  ["Your document text 1", "Your document text 2"],
  [{ source: "doc1" }, { source: "doc2" }],
  embeddings
);

// Query with local LLM
const model = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "llama3",
});

const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
const response = await chain.call({ query: "What does the document say?" });
```

## Hardware Requirements and Performance

**Minimum Requirements:**
- 8GB RAM for 7B parameter models (quantized)
- 16GB RAM for 13B models
- 32GB+ RAM for 70B models
- No GPU required (CPU inference works)

**Optimal Setup:**
- 16GB+ RAM
- NVIDIA GPU with 8GB+ VRAM (RTX 3060 or better)
- M1/M2/M3 Mac (excellent performance via Metal)
- SSD for fast model loading

**Real-World Benchmarks** (on MacBook Pro M3 Max, 64GB):
- Llama 3 8B: ~50 tokens/second
- Llama 3 70B: ~10 tokens/second
- CodeLlama 7B: ~55 tokens/second

Compare this to cloud APIs with network latency (typically 100-500ms first token, then streaming).

## Cost Analysis: Local vs Cloud

Let's do the math. Say your application generates 10 million tokens per month:

**Cloud (OpenAI GPT-3.5):**
- Input: $0.50 per 1M tokens
- Output: $1.50 per 1M tokens
- Total: ~$10,000/month (assuming 50/50 split)

**Local (Ollama on dedicated server):**
- AWS EC2 g5.2xlarge (GPU instance): ~$1,200/month
- Or self-hosted server: ~$2,000 upfront, ~$50/month electricity
- Total: $1,200/month (or $50/month after hardware cost)

**Savings: ~88% reduction** in ongoing costs. Plus unlimited usage.

## Why This Is Different From Running Models Manually

You could run models with raw llama.cpp, Hugging Face Transformers, or vLLM. But Ollama gives you:

- **Zero configuration**: No Python environments, no dependency hell
- **Automatic quantization**: Models are pre-optimized for your hardware
- **Model library**: One-command downloads from curated collection
- **Version management**: Update models like updating software
- **API compatibility**: Works with existing LLM libraries (LangChain, etc.)

You'd choose Ollama when you want the simplest path to local LLMs. You'd use vLLM or TGI when you need maximum throughput for production serving at scale. You'd use Hugging Face directly when you need fine-grained control over model internals or are doing research.

## My Take - Should You Actually Use This?

In my opinion, Ollama is the Docker moment for local LLMs. Just as Docker made containerization accessible to every developer (not just infrastructure specialists), Ollama makes local LLM deployment trivial. This matters enormously for the industry.

This project ([https://github.com/ollama/ollama](https://github.com/ollama/ollama)) is perfect if you're building AI features for sensitive data (healthcare, finance, legal), if you want to eliminate cloud API costs, if you need guaranteed response times without network dependency, or if you're prototyping and iterating quickly without burning through API credits.

The catch? You need decent hardware. Running 70B models requires serious RAM. And while smaller models (7B-13B) are surprisingly good, they're not quite GPT-4 level for complex reasoning. Also, you're responsible for keeping models updated and managing the infrastructure (though Ollama makes this easy).

But bottom line, if you're spending $1,000+ per month on LLM APIs or if data privacy is a concern, test Ollama in your stack. Start with Llama 3 8B for general tasks or CodeLlama for code generation. Measure quality against your needs. From my perspective, the combination of cost savings, data privacy, and elimination of external dependencies makes this a no-brainer for many applications.

The gap between open models and GPT-4 has narrowed dramatically. For 80% of use cases, local LLMs with Ollama are now the smarter choice.

Check it out here: [https://ollama.ai](https://ollama.ai)
