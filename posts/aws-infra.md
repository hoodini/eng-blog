---
title: "Why I Switched to Custom AWS Infra"
date: "2025-12-01"
excerpt: "Vercel is great, but when you're running heavy inference, you need the raw power and cost control of AWS."
coverImage: "https://placehold.co/1200x630/f56300/ffffff?text=AWS+Infra"
tags: ["AWS", "Infrastructure"]
author: "Yuval Avidani"
---

# Leaving the Nest

I love Vercel. It's the best DX in the world. But for my latest project, involving heavy local LLM inference and long-running agent loops, I had to go bare metal (well, virtualized metal).

## The Cost of Serverless

Serverless functions have timeouts. They have cold starts. And they get expensive when you just need a persistent process listening to a WebSocket.

## Enter ECS and Fargate

I moved my agent swarm to **AWS ECS with Fargate**. 
1. **Predictable Pricing**: I pay for vCPU and RAM per hour.
2. **Long-running processes**: My agents can think for 10 minutes if they need to.
3. **Control**: I can fine-tune the container exactly how I want.

It was a weekend of pain setting up the VPCs and Load Balancers, but totally worth it.
