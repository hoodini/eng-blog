---
title: "Self-Hosting LLMs with Ollama"
date: "2025-12-20"
excerpt: "Stop paying OpenAI. Run Llama 3 on your MacBook Pro and keep your data private."
coverImage: "/images/local_llms_cover.png"
tags: ["AI", "Tutorials"]
author: "Yuval Avidani"
---

# Local LLMs

With the release of Llama 3, the gap between open models and GPT-4 has narrowed significantly.
And formatting it with **Ollama** makes it trivial to run.

```bash
brew install ollama
ollama run llama3
```

That's it. You have a cutting-edge LLM running locally.

## Integrating with Code

I use `LangChain.js` to talk to my local Ollama instance. It's a drop-in replacement for the OpenAI API.
