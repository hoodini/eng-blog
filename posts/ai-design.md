---
title: "Design Systems for AI"
date: "2025-12-18"
excerpt: "How do you design a UI for a non-deterministic system? Trust indicators and graceful failure states are key."
coverImage: "https://placehold.co/1200x630/6b2c91/ffffff?text=AI+Design"
tags: ["Design", "UX"]
author: "Yuval Avidani"
---

# Desiging for Uncertainty

When you design a standard form, you know exactly what can go wrong. A field is empty. An email is invalid.

When you design for an AI Agent, you have no idea what it might output.
* It might hallucinate.
* It might refuse to answer.
* It might write a poem instead of JSON.

## The Trust Battery

Your UI must display the "confidence" of the AI.
- Use **Streaming UI** to show thinking.
- Allow **User Correction** easily.
- **Cite Sources** prominently.
