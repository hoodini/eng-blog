---
title: "98.7% Accuracy on Length Generalization: What RewriteNets Reveals About Transformers"
date: "2026-01-14"
excerpt: "## Key Finding **According to the paper \"RewriteNets: End-to-End Trainable String-Rewriting for Generative Sequence Modeling\" by Harshil Vejendla, explicit stri..."
coverImage: "https://yuv-ai-images.s3.us-west-2.amazonaws.com/iUJnaZT3D47d7M8Pisrp4Ac.jpg"
tags: ["arxiv"]
author: "Yuval Avidani"
---

## Key Finding

**According to the paper "RewriteNets: End-to-End Trainable String-Rewriting for Generative Sequence Modeling" by Harshil Vejendla, explicit string rewriting rules achieve 98.7% accuracy on the SCAN benchmark's length generalization split while Transformers typically achieve only 15-25%.** This has significant implications for how we architect models that need to apply learned rules systematically to new contexts.

## What Does Compositional Generalization Mean?

Compositional generalization refers to a model's ability to understand and apply learned patterns to new combinations or contexts it hasn't seen during training. The paper ["RewriteNets: End-to-End Trainable String-Rewriting for Generative Sequence Modeling"](https://arxiv.org/abs/2601.07868) tackles the core problem that we all face when deploying language models: they work brilliantly on training distributions but often collapse when asked to generalize compositionally - applying known rules to novel lengths, structures, or combinations.

## The Problem We All Face

We've all experienced this frustration: our carefully trained Transformer models ace every benchmark during development, then fail spectacularly in production when users throw slightly different input structures at them. A model that perfectly understands "jump once after running" during training completely breaks down when asked to execute "jump twice after running" - even though it knows both "jump" and "twice" independently.

This isn't just an academic curiosity. Our production systems face compositional challenges constantly. Customer service bots trained on common query patterns struggle when users phrase requests in novel ways. Code generation models that work perfectly on short functions fail to maintain logical consistency in longer programs. Translation systems that handle simple sentences produce nonsensical outputs for complex grammatical structures they haven't seen in exact training configurations.

The SCAN benchmark (Simplified Commands Action Navigation) perfectly captures this challenge - it tests whether models can execute compositional commands like "jump around left twice" after learning simpler primitives. Most Transformer architectures, despite billions of parameters, achieve only 15-25% accuracy on length generalization splits where test commands are systematically longer than training examples.

## What the Researchers Found

Harshil Vejendla introduces RewriteNets, a neural architecture that replaces the implicit structure learning of Transformer attention with explicit, learnable string rewriting rules. Think of it like this: instead of learning dense correlation matrices between all token pairs (what Transformers do), RewriteNets learn specific Find-and-Replace rules that execute in parallel - except these rules and their patterns are discovered through end-to-end training rather than hand-coded.

The architecture operates through four parallel steps in each layer. First, fuzzy pattern matching identifies where each learned rule could potentially apply in the input sequence - meaning "pattern matching" here uses learned embeddings rather than exact string matches, allowing flexibility. Second, conflict resolution uses a differentiable assignment operator (specifically, a straight-through Gumbel-Sinkhorn estimator) to decide which rules fire when multiple rules match the same position - this ensures stable gradient flow during training. Third, rule application replaces matched segments with learned output patterns. Fourth, propagation passes through any tokens that weren't modified by rules.

### Practical Implementation

Here's what this looks like in practice:

```
# Example: Basic RewriteNet layer structure
from rewritenets import RewriteNetLayer
import torch

# Initialize layer with learnable rewriting rules
layer = RewriteNetLayer(
    num_rules=64,          # Number of parallel rewriting rules
    pattern_length=5,      # Maximum pattern length to match
    replacement_length=5,  # Maximum replacement length
    hidden_dim=512,        # Embedding dimension
    vocab_size=10000
)

# Process sequence through rewriting rules
input_ids = torch.tensor([[1, 45, 67, 89, 12, 34]])
output_ids = layer(input_ids)

# Each rule operates in parallel - linear O(n) complexity
# vs Transformer's quadratic O(n²) attention
print(f"Input shape: {input_ids.shape}")
print(f"Output shape: {output_ids.shape}")
```

The key innovation is making these rewriting rules differentiable and trainable. Traditional formal language theory uses deterministic rewriting systems with hand-crafted rules. RewriteNets learn both the patterns to match and the replacements to apply through backpropagation, while maintaining the explicit structure that makes systematic generalization possible.

Another practical example based on the paper's approach:

```
# Implementing compositional rule application
class CompositionTester:
    def __init__(self, model):
        self.model = model
    
    def test_length_generalization(self, base_command, extensions):
        """
        Test if our model can apply learned rules to new lengths
        based on RewriteNets' systematic approach
        """
        results = {}
        
        # Test base command (seen during training)
        base_output = self.model.generate(base_command)
        results['base'] = base_output
        
        # Test extended versions (unseen lengths)
        for ext in extensions:
            extended_command = f"{base_command} {ext}"
            extended_output = self.model.generate(extended_command)
            
            # Check if rule application is consistent
            is_compositional = self.verify_composition(
                base_output, extended_output, ext
            )
            results[extended_command] = {
                'output': extended_output,
                'compositional': is_compositional
            }
        
        return results
    
    def verify_composition(self, base, extended, extension):
        """Verify that extension follows compositional rules"""
        # Implementation would check if extended output
        # correctly composes base actions with new modifiers
        return True  # Simplified for example

# Usage
tester = CompositionTester(rewritenet_model)
results = tester.test_length_generalization(
    base_command="jump left",
    extensions=["twice", "thrice", "four times"]
)
```

## Key Results & Numbers

*   **98.7% accuracy on SCAN length split** - that's near-perfect systematic generalization compared to 15-25% for standard Transformers. This isn't a marginal improvement; it's solving a problem Transformers fundamentally struggle with.
*   **81% generalization accuracy on COGS** - the semantic parsing benchmark where models must understand compositional structure in natural language commands. Transformer baselines typically achieve 60-70% on similar splits.
*   **Linear O(n) computational complexity** - while Transformer attention scales quadratically with sequence length as O(n²), parallel rewriting maintains linear complexity. For a 1000-token sequence, that's roughly 1000x fewer operations compared to full attention.
*   **Explicit rule representation** - unlike Transformers that encode structure implicitly in billions of dense parameters, RewriteNets learn interpretable rewriting rules that we can inspect and understand.

## How This Fits Our Toolkit

RewriteNets complement rather than replace Transformers in our production toolkit. Transformers excel at tasks requiring broad contextual understanding and pattern matching across long documents - think document classification, semantic search, or open-ended text generation where flexibility matters more than perfect systematic consistency.

RewriteNets shine in domains where compositional structure dominates: semantic parsing (converting natural language to formal queries), program synthesis (generating code that must follow strict compositional rules), theorem proving, or any task where we need models to apply learned rules systematically to new combinations. The linear computational complexity also makes them attractive for extremely long sequences where Transformer attention becomes prohibitively expensive.

GitHub Copilot and similar tools that help us write code already leverage compositional understanding, though primarily through Transformer architectures. The research here suggests we might achieve better systematic generalization - especially for longer, more complex code structures - by incorporating explicit rewriting mechanisms alongside attention. This isn't about replacing what works, but augmenting our approaches where systematic rule application matters most.

## My Take - Should We Pay Attention?

In my view, this paper represents a fundamental challenge to the assumption that bigger Transformers with more attention heads will eventually solve compositional generalization. We've been scaling Transformers for years, yet the SCAN benchmark's length split remains stubbornly difficult - suggesting the issue is architectural, not just a matter of model size or training data.

The explicit rule learning in RewriteNets offers something genuinely different: interpretable, systematic generalization that we can verify and reason about. This matters tremendously for production systems where we need to understand why a model makes specific decisions, not just whether it achieves high average accuracy.

The limitation is scope. We don't yet know how RewriteNets perform on open-ended generation tasks where Transformers dominate - tasks like creative writing, summarization, or conversational dialogue where strict compositional rules matter less than flexible contextual understanding. The paper focuses on synthetic benchmarks (SCAN, COGS) specifically designed to test compositional generalization. Real-world evaluation on diverse production workloads will reveal where this architecture truly adds value versus where Transformers remain superior.

For practitioners, this research suggests we should match architecture to task requirements more carefully. If our production system needs perfect systematic generalization - applying learned patterns consistently to new lengths or combinations - RewriteNets warrant serious investigation. If we need flexible, context-aware generation across diverse domains, Transformers remain our best bet. Often, we'll want both capabilities in different parts of our systems.

Full paper: [RewriteNets: End-to-End Trainable String-Rewriting for Generative Sequence Modeling](https://arxiv.org/abs/2601.07868)

## Frequently Asked Questions

### What does RewriteNets find?

RewriteNets achieves 98.7% accuracy on SCAN length generalization by using explicit, learnable string rewriting rules instead of Transformer attention, while maintaining linear computational complexity compared to attention's quadratic cost.

### Who conducted this research?

The paper was authored by Harshil Vejendla and published on arXiv in January 2025. The research focuses on developing neural architectures that achieve systematic compositional generalization.

### Why does this matter for production systems?

Our production models frequently fail when they need to apply learned patterns to new contexts, lengths, or combinations they haven't seen during training - RewriteNets directly address this systematic generalization challenge with an architecture designed for compositional reasoning.

### What should we do based on this research?

Evaluate RewriteNets on tasks where your Transformer models show poor compositional generalization - particularly semantic parsing, program synthesis, or any domain requiring systematic rule application to novel combinations or lengths.

### What are the limitations of this study?

The paper demonstrates results primarily on synthetic benchmarks designed to test compositional generalization (SCAN, COGS). We need broader evaluation on real-world production tasks to understand where RewriteNets excel versus where Transformers remain superior for flexible, open-ended generation.