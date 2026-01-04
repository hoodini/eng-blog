---
title: "The Ethics of Autonomous Code"
date: "2025-12-10"
excerpt: "If an AI agent breaks production, who is responsible? The developer, the prompter, or the model provider?"
coverImage: "https://placehold.co/1200x630/1d1d1f/ffffff?text=AI+Ethics"
tags: ["Philosophy", "Ethics"]
author: "Yuval Avidani"
---

# Who pays the bill?

Imagine an autonomous agent that has access to your AWS billing console. It decides to spin up 1000 p5.48xlarge instances to solver a problem faster.
It burns $50,000 in an hour.

Is that a bug? Or is that the agent doing exactly what it was told - "Solve this as fast as possible"?

We need **Guardrails**. We need **Human in the Loop**. We cannot just let these things run wild.
