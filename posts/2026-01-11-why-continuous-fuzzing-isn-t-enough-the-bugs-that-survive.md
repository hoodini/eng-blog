---
title: "Why Continuous Fuzzing Isn't Enough: The Bugs That Survive"
date: "2026-01-11"
excerpt: "## The Fuzzer Ran for 18 Months. The Bug Was Still There. A recent [GitHub Blog post by Antonio Morales](https://github.blog/security/vulnerability-research/bug..."
coverImage: "https://yuv-ai-images.s3.us-west-2.amazonaws.com/3XpjaZH1OJmskdUP2diqyAk.jpg"
tags: ["github"]
author: "Yuval Avidani"
---

## The Fuzzer Ran for 18 Months. The Bug Was Still There.

A recent [GitHub Blog post by Antonio Morales](https://github.blog/security/vulnerability-research/bugs-that-survive-the-heat-of-continuous-fuzzing/) reveals a uncomfortable truth about our security practices: continuous fuzzing isn't the silver bullet we thought it was. Even world-class initiatives like OSS-Fuzz, which have been hammering mature open source projects for years, keep missing critical vulnerabilities.

This matters to all of us because we've been operating under a dangerous assumption - that if a codebase has been continuously fuzzed, especially by something as comprehensive as OSS-Fuzz, the hard bugs are gone. We deploy these libraries with confidence. We build our applications on top of them. And we're wrong.

## The Uncomfortable Reality

Morales found critical vulnerabilities in heavily-fuzzed projects like Gstreamer, Poppler, and Exiv2 - all of which have been under continuous fuzzing for extended periods. These aren't obscure edge cases in rarely-used code. These are real vulnerabilities that survived millions of test cases and months of automated testing.

The most striking example: Gstreamer sits at just 19% code coverage despite continuous fuzzing efforts, while projects like OpenSSL achieve much higher coverage rates. But here's the twist - even high coverage doesn't guarantee we'll find all bugs. The problem runs deeper than coverage percentages.

## Why Standard Fuzzing Misses Bugs

The core issue lies in what standard fuzzers actually measure. Most fuzzers, including popular tools like AFL++, track "edge coverage" - essentially, did we execute this line of code? Think of it like checking if we opened every door in a building without looking at what's inside the rooms.

Here's a concrete example. A fuzzer might execute a division operation a million times:

```
int result = numerator / denominator;
```

The fuzzer sees: "Great! We hit this line a million times with different inputs. Moving on." But if it never tried dividing by values close to zero, or never tested the specific range where integer overflow occurs, it misses the crash entirely. The coverage metric says 100%, but the value space is barely explored.

### The Three Failure Modes

Morales identifies three key reasons why bugs survive continuous fuzzing:

*   **Weak External Dependencies** - When our code relies on external libraries with poor fuzzing coverage, we inherit blind spots. Our code might be well-fuzzed, but the dependency it calls isn't.
*   **Insufficient Coverage** - Many projects hover around 20-30% code coverage. Large swaths of code simply never get executed during fuzzing, creating safe havens for bugs.
*   **Edge Coverage Limitations** - This is the fundamental problem. Edge coverage tracks control flow (which paths we took) but ignores data flow (what values flowed through those paths).

## The Five-Step Fuzzing Workflow

The research proposes a systematic approach that goes beyond standard fuzzing practices. Here's how we should be thinking about fuzzing mature codebases:

### Step 1: Preparation

Optimize our code for fuzzing before we start. This means:

*   Removing or mocking expensive operations (network calls, file I/O) that slow down fuzzing
*   Creating focused harnesses for different components
*   Setting up proper sanitizers (AddressSanitizer, UndefinedBehaviorSanitizer)

### Step 2: Coverage

Aim for >90% code coverage as a baseline. This isn't negotiable. If we're sitting at 20-30%, we haven't even started finding the hard bugs yet. Use coverage-guided fuzzing to systematically explore our codebase.

### Step 3: Context (The Game Changer)

This is where it gets interesting. Context-Sensitive coverage tracks the ORDER in which we execute code, not just which code we executed. We use techniques like N-Gram coverage or Branch coverage.

Think of it like recording not just which rooms you visited in a building, but the specific path you took. The bug might only trigger when you go from Room A → Room C → Room B, not when you go A → B → C, even though both paths visit all three rooms.

```
// Standard edge coverage treats these the same
// Path 1: A() -> B() -> C()
// Path 2: A() -> C() -> B()

// But with N-Gram coverage, we track sequences:
// Path 1 generates: [A,B], [B,C]
// Path 2 generates: [A,C], [C,B]
// Different paths = different coverage!
```

### Step 4: Value Coverage (The Missing Piece)

This is the technique that catches bugs standard fuzzers miss. Value Coverage tracks the RANGES of values that flow through our code. Instead of just "did we execute this division?", we ask "did we execute this division with values near zero? With maximum integers? With negative numbers?"

Implementation requires custom LLVM FunctionPass instrumentation. Here's the concept:

```
// Traditional fuzzing sees:
void process(int x) {
  if (x < 100) {
    // Branch A - covered ✓
  } else {
    // Branch B - covered ✓
  }
}

// Value coverage tracks:
// Did we try x = 0? x = 99? x = 100? x = 101?
// Did we try negative values? MAX_INT? MIN_INT?
// Each range gets tracked separately
```

### Step 5: Triaging

Once we find crashes, we need to determine which are exploitable vulnerabilities versus harmless assertion failures. This step requires manual analysis but is crucial for prioritizing fixes.

## The Technical Implementation

The article dives deep into implementing Value Coverage using LLVM. The basic approach:

```
// Custom LLVM pass to instrument variables
class ValueCoveragePass : public FunctionPass {
  void instrumentVariable(Value *V) {
    // Track value ranges for this variable
    // Generate unique ID for this variable
    // Insert callback to record value at runtime
  }
};

// At runtime, track ranges:
void __value_coverage_callback(uint64_t var_id, int64_t value) {
  // Bucket the value into ranges
  // Update coverage bitmap for this range
  // Guide fuzzer toward unexplored ranges
}
```

## From My Experience

I've seen this play out in production more times than I'd like to admit. We fuzz a component thoroughly, achieve high coverage, ship it with confidence - and then get a crash report from production with input combinations we never tested. The fuzzer hit every line of code but never tried THAT specific combination of values.

The focus on Value Coverage addresses a blind spot we've had for years in the fuzzing community. We've been optimizing for breadth (hitting all code paths) without sufficient depth (exploring the value space within those paths). It's like testing a lock by checking that all the tumblers move, without actually trying different key combinations.

One practical tip from my work: when implementing Value Coverage, start with the most critical functions - parsers, validators, anything touching external input. The instrumentation overhead is significant, so we can't realistically apply it everywhere. But targeted Value Coverage on high-risk code paths has found bugs for us that sat there for years.

## My Take

In my view, this research should fundamentally change how we approach fuzzing mature codebases. We need to move beyond the simplistic "we fuzzed it, ship it" mentality to a more nuanced understanding of what different fuzzing techniques can and cannot catch.

The five-step workflow isn't just academic theory - it's a practical blueprint for finding the bugs that survive continuous fuzzing. The combination of high coverage, context sensitivity, and value tracking gives us a much more complete picture of our code's behavior space.

What I'll do differently: For any critical component we're fuzzing, I'm now asking these questions: What's our coverage percentage? Are we tracking execution context? Are we exploring the value space for critical variables? If the answer to any of these is no, we're not done fuzzing yet.

Read the full technical analysis with detailed implementation examples: [Bugs that survive the heat of continuous fuzzing](https://github.blog/security/vulnerability-research/bugs-that-survive-the-heat-of-continuous-fuzzing/)