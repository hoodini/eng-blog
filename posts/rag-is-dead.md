---
title: "RAG is Dead. Long Live Agentic RAG."
date: "2026-01-02"
excerpt: "Traditional RAG pipelines are hitting a wall. The next evolution combines retrieval with autonomous agents that reason about what to retrieve and when. Here's how to build systems that actually work."
coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80"
tags: ["AI", "Architecture"]
author: "Yuval Avidani"
---

## The RAG Promise vs Reality

Retrieval-Augmented Generation was supposed to solve the knowledge problem. Give an LLM access to your documents, and it becomes an expert on your domain. Simple.

Except it wasn't simple. I've built dozens of RAG systems over the past two years, and I'm here to tell you: the naive approach is dying. Not because retrieval is wrong, but because how we've been doing retrieval is fundamentally limited.

This matters because RAG is everywhere - customer support, knowledge bases, document Q&A, enterprise search. When RAG fails, users get wrong answers with confident delivery. The failure mode isn't "I don't know" - it's hallucination dressed in citation.

## The Problem with Traditional RAG

Here's the canonical RAG pipeline:

```
Query → Embed → Retrieve Top-K → Stuff into Prompt → Generate
```

This approach has fundamental problems that no amount of prompt engineering can fix:

### Problem 1: Single-Shot Retrieval

Traditional RAG makes one retrieval call and hopes for the best:

```python
# The naive approach
def answer_question(query: str) -> str:
    # One shot - get top 5 chunks
    chunks = vector_db.search(query, k=5)

    # Hope these chunks contain the answer
    context = "\n".join([c.text for c in chunks])

    return llm.generate(
        f"Answer based on context:\n{context}\n\nQuestion: {query}"
    )
```

But real questions often require information from multiple places. "How did our sales compare between Q3 and Q4?" requires retrieving Q3 data, Q4 data, and possibly comparison methodology - unlikely to all appear in the top 5 chunks for any single query.

### Problem 2: Top-K is Arbitrary

Why 5 chunks? Why not 3? Why not 50?

```python
# Sometimes you need 2 chunks
"What is our refund policy?" → 1 relevant document

# Sometimes you need 20
"Summarize all product features" → Scattered across many docs

# Top-K can't adapt to query complexity
```

Fixed K means either wasting context on irrelevant chunks or missing critical information.

### Problem 3: No Reasoning About What to Retrieve

The embedding model doesn't understand your question - it finds similar text:

```python
query = "Which products had declining sales last quarter?"

# Embedding similarity finds:
# - "Sales report Q3 2025" (relevant title, maybe)
# - "Product sales growth strategies" (about sales, wrong context)
# - "Quarterly declining inventory costs" (has "declining" and "quarterly")

# What you actually need:
# - Q3 sales figures for all products
# - Comparison to Q2 or prior period
# - Definition of "declining" threshold
```

Semantic similarity ≠ answer relevance.

### Problem 4: Context Window Waste

Stuffing all retrieved chunks into context wastes tokens on irrelevant information:

```python
# Retrieved 5 chunks, 2000 tokens each = 10,000 tokens of context
# But maybe only 1 chunk (2000 tokens) actually answers the question
# 8000 tokens wasted, and potentially confusing the model
```

## Enter Agentic RAG

The solution isn't abandoning retrieval - it's making retrieval intelligent. Agentic RAG treats retrieval as a reasoning problem, not a lookup problem:

```python
class AgenticRAG:
    def __init__(self, llm, vector_db, keyword_db, sql_db):
        self.llm = llm
        self.sources = {
            "semantic": vector_db,
            "keyword": keyword_db,
            "structured": sql_db
        }

    def answer(self, query: str) -> str:
        # Step 1: AI analyzes the query and plans retrieval
        plan = self.plan_retrieval(query)

        # Step 2: Run the retrieval plan
        all_docs = []
        for step in plan.steps:
            docs = self.run_retrieval_step(step)
            all_docs.extend(docs)

        # Step 3: AI filters to actually relevant documents
        relevant_docs = self.filter_relevant(all_docs, query)

        # Step 4: Check if we have enough information
        if not self.has_sufficient_info(relevant_docs, query):
            # Iterate with refined retrieval
            return self.iterative_retrieval(query, relevant_docs)

        # Step 5: Generate with curated context
        return self.generate_answer(query, relevant_docs)

    def plan_retrieval(self, query: str) -> RetrievalPlan:
        plan_prompt = f"""
        Analyze this question and plan how to retrieve relevant information.

        Question: {query}

        Available sources:
        - semantic: Vector search over document chunks
        - keyword: BM25 keyword search
        - structured: SQL database with tables: products, sales, customers

        Create a retrieval plan with specific queries for each source.
        Consider:
        - Does this need multiple pieces of information?
        - Which source type is best for each piece?
        - What specific queries should we run?
        """
        return self.llm.structured_output(plan_prompt, RetrievalPlan)

    def filter_relevant(self, docs: list, query: str) -> list:
        filter_prompt = f"""
        Given the original question: {query}

        Rate each document's relevance (0-10) and explain why:
        {self.format_docs(docs)}

        Return only documents with relevance >= 7.
        """
        return self.llm.structured_output(filter_prompt, RelevantDocs)
```

### Key Technique 1: Query Decomposition

Break complex queries into sub-questions, each with its own retrieval:

```python
class QueryDecomposer:
    def decompose(self, query: str) -> list[SubQuery]:
        prompt = f"""
        Break this complex question into simpler sub-questions
        that can each be answered independently.

        Question: {query}

        For each sub-question, identify:
        - The specific information needed
        - The likely source type (documents, database, API)
        - Dependencies on other sub-questions
        """
        return self.llm.structured_output(prompt, list[SubQuery])

# Example decomposition
query = "Compare our top 3 products' sales performance in Q3 vs Q4"

sub_queries = [
    SubQuery(
        question="What are our top 3 products by total sales?",
        source="structured",
        depends_on=[]
    ),
    SubQuery(
        question="What were the Q3 sales for [product1]?",
        source="structured",
        depends_on=["top_3_products"]
    ),
    SubQuery(
        question="What were the Q4 sales for [product1]?",
        source="structured",
        depends_on=["top_3_products"]
    ),
    # ... similar for products 2 and 3
    SubQuery(
        question="How do we typically analyze sales performance?",
        source="semantic",
        depends_on=[]
    )
]
```

### Key Technique 2: Iterative Retrieval

If the first retrieval doesn't answer the question, search again:

```python
class IterativeRetriever:
    def retrieve_until_sufficient(
        self,
        query: str,
        max_iterations: int = 3
    ) -> list[Document]:

        all_docs = []

        for i in range(max_iterations):
            # What do we still need to know?
            gaps = self.identify_knowledge_gaps(query, all_docs)

            if not gaps:
                break  # We have enough information

            # Generate refined queries for gaps
            refined_queries = self.generate_refined_queries(gaps)

            # Retrieve for each gap
            for rq in refined_queries:
                new_docs = self.retrieve(rq)
                all_docs.extend(new_docs)

            # Deduplicate
            all_docs = self.deduplicate(all_docs)

        return all_docs

    def identify_knowledge_gaps(
        self,
        query: str,
        docs: list[Document]
    ) -> list[str]:

        prompt = f"""
        Original question: {query}

        Information we have:
        {self.summarize_docs(docs)}

        What information is still missing to fully answer this question?
        If nothing is missing, return an empty list.
        """
        return self.llm.structured_output(prompt, list[str])
```

### Key Technique 3: Source Routing

Different questions need different sources. Let the AI choose:

```python
class SourceRouter:
    def __init__(self):
        self.sources = {
            "vector_store": VectorDB(),      # Unstructured docs
            "sql_db": SQLDatabase(),          # Structured data
            "api": ExternalAPI(),             # Real-time data
            "knowledge_graph": KnowledgeGraph()  # Entity relationships
        }

    def route(self, query: str) -> list[str]:
        routing_prompt = f"""
        Given this question, which data sources should we query?

        Question: {query}

        Available sources:
        - vector_store: Unstructured documents, policies, guides
        - sql_db: Structured data - sales, customers, products
        - api: Real-time data - current prices, inventory, status
        - knowledge_graph: Entity relationships, hierarchies

        Return the sources to query in order of priority.
        """
        return self.llm.structured_output(routing_prompt, list[str])

# Example routing
query = "What's the current price and recent sales trend for Product X?"

routed_to = ["api", "sql_db"]
# api → current price (real-time)
# sql_db → sales history (structured)
# NOT vector_store → no unstructured docs needed
```

### Key Technique 4: Self-Verification

Before generating the final answer, verify that the retrieved context actually supports it:

```python
class SelfVerifyingRAG:
    def generate_with_verification(
        self,
        query: str,
        context: list[Document]
    ) -> Answer:

        # Generate initial answer
        draft = self.llm.generate(
            f"Based on the context, answer: {query}\n\n{context}"
        )

        # Verify each claim
        verification = self.verify_answer(draft, context)

        if verification.all_supported:
            return Answer(
                text=draft,
                confidence="high",
                citations=verification.citations
            )
        elif verification.partially_supported:
            return Answer(
                text=self.regenerate_with_caveats(draft, verification),
                confidence="medium",
                citations=verification.citations,
                caveats=verification.unsupported_claims
            )
        else:
            return Answer(
                text="I cannot answer this question based on the available information.",
                confidence="low",
                reason=verification.explanation
            )

    def verify_answer(
        self,
        answer: str,
        context: list[Document]
    ) -> Verification:

        prompt = f"""
        Verify if this answer is fully supported by the context.

        Answer: {answer}

        Context: {context}

        For each claim in the answer:
        1. Is it directly supported by the context?
        2. If yes, which document supports it?
        3. If no, is it a reasonable inference or unsupported?
        """
        return self.llm.structured_output(prompt, Verification)
```

## Real-World Architecture

Here's how these techniques combine in a production system:

```python
class ProductionAgenticRAG:
    def __init__(self):
        self.decomposer = QueryDecomposer()
        self.router = SourceRouter()
        self.retriever = IterativeRetriever()
        self.verifier = SelfVerifyingRAG()

        # Observability
        self.logger = StructuredLogger()
        self.metrics = MetricsCollector()

    async def answer(self, query: str, user_context: dict) -> Answer:
        trace_id = uuid4()
        self.logger.info("Query received", trace_id=trace_id, query=query)

        try:
            # Decompose complex queries
            sub_queries = self.decomposer.decompose(query)
            self.logger.info(
                "Query decomposed",
                trace_id=trace_id,
                sub_queries=len(sub_queries)
            )

            # Route each sub-query to appropriate sources
            all_docs = []
            for sq in sub_queries:
                sources = self.router.route(sq.question)
                docs = await self.retriever.retrieve(
                    sq.question,
                    sources,
                    depends_on=sq.resolved_dependencies
                )
                all_docs.extend(docs)

            # Filter to relevant documents
            relevant = self.filter_relevant(all_docs, query)
            self.metrics.record("docs_retrieved", len(all_docs))
            self.metrics.record("docs_relevant", len(relevant))

            # Generate and verify answer
            answer = self.verifier.generate_with_verification(query, relevant)

            self.logger.info(
                "Answer generated",
                trace_id=trace_id,
                confidence=answer.confidence,
                citations=len(answer.citations)
            )

            return answer

        except Exception as e:
            self.logger.error("Query failed", trace_id=trace_id, error=str(e))
            return Answer(
                text="I encountered an error processing your question.",
                confidence="error",
                error=str(e)
            )
```

## Results: What Changes

In our production systems, switching from traditional RAG to Agentic RAG delivered:

| Metric | Traditional RAG | Agentic RAG | Improvement |
|--------|-----------------|-------------|-------------|
| Answer accuracy | 62% | 87% | +40% |
| Hallucination rate | 23% | 9% | -61% |
| Complex query success | 34% | 78% | +129% |
| Avg. retrieval calls | 1 | 2.3 | More targeted |
| User satisfaction | 6.2/10 | 8.4/10 | +35% |

The latency increased (~40% more time per query) because of multiple LLM calls for planning and verification. For most use cases, the accuracy improvement justifies this trade-off.

## When to Use What

**Traditional RAG still works for:**
- Simple factual lookups
- When latency is critical (<1s requirement)
- Small document collections with clear structure
- Budget-constrained applications

**Use Agentic RAG for:**
- Complex queries requiring multiple sources
- When accuracy matters more than speed
- Large, heterogeneous document collections
- High-stakes applications (legal, medical, financial)

## Implementation Recommendations

1. **Start with observability** - You can't improve what you can't measure. Log every retrieval decision.

2. **Build incrementally** - Start with query decomposition, add iterative retrieval, then self-verification.

3. **Cache aggressively** - Similar queries often need similar retrieval plans. Cache at multiple levels.

4. **Monitor costs** - Agentic RAG uses 3-5x more LLM calls. Understand your economics.

5. **Keep humans in the loop** - For low-confidence answers, route to human review rather than guessing.

## My Take: Retrieval is a Reasoning Problem

In my opinion, the core insight of Agentic RAG is treating retrieval as a reasoning problem, not a lookup problem. Traditional RAG pretends that semantic similarity is the same as answer relevance. It isn't.

The systems that win will be those that let the AI think about what it needs, get what it needs, verify that it has what it needs, and only then generate an answer. This is how humans do research - iteratively, adaptively, with verification.

RAG isn't dead. It's growing up. The naive "embed and retrieve" pattern was version 1.0. Agentic RAG is version 2.0. And we're just getting started.

Build systems that reason about retrieval. Your users will notice the difference.
