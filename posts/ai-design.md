---
title: "Design Systems for AI"
date: "2025-12-18"
excerpt: "How do you design a UI for a non-deterministic system? Trust indicators, graceful failure states, and human-in-the-loop patterns are key to building AI interfaces users actually trust."
coverImage: "/images/ai_design_cover.png"
tags: ["Design", "UX"]
author: "Yuval Avidani"
---

## Designing for Uncertainty

When you design a standard form, you know exactly what can go wrong. A field is empty. An email is invalid. A number is out of range. The error states are finite, predictable, and testable.

When you design for an AI Agent, you have no idea what it might output:
- It might hallucinate facts with complete confidence
- It might refuse to answer for opaque reasons
- It might write a poem instead of JSON
- It might loop endlessly attempting and failing
- It might produce something 90% correct with a critical error in the remaining 10%

This matters to all of us building AI-powered products because the interface is the trust surface. Users can't see the model, can't understand the inference, can't verify the training data. They experience the UI. If your interface fails to communicate uncertainty, handle failures gracefully, or enable correction, even a capable AI becomes unusable.

## The Trust Battery Concept

Think of user trust as a battery. Every successful interaction charges it. Every unexpected failure, hallucination, or confusing response drains it. Your UI design directly controls the charging and draining rates.

**Trust Chargers:**
- Accurate responses that meet expectations
- Clear communication of limitations
- Easy correction when AI is wrong
- Consistent behavior over time
- Transparency about what the AI can and cannot do

**Trust Drainers:**
- Confident-sounding hallucinations
- Unexplained failures or refusals
- Inconsistent behavior for similar inputs
- Hidden limitations that surprise users
- Inability to correct or guide the AI

Your interface design determines how gracefully you handle both scenarios.

## Core Pattern 1: Streaming UI for Transparency

Streaming responses serve multiple purposes beyond perceived speed:

### Show Thinking, Not Just Results

```tsx
function AIResponse({ stream }: { stream: AsyncIterable<string> }) {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'thinking' | 'generating' | 'done'>('thinking');

  useEffect(() => {
    async function consume() {
      setStatus('thinking');

      // Show thinking indicator
      await delay(500);
      setStatus('generating');

      for await (const chunk of stream) {
        setContent(prev => prev + chunk);
      }

      setStatus('done');
    }
    consume();
  }, [stream]);

  return (
    <div className="ai-response">
      {status === 'thinking' && (
        <div className="thinking-indicator">
          <SparkleAnimation />
          <span>Analyzing your request...</span>
        </div>
      )}

      <div className="content">
        <MarkdownRenderer content={content} />
        {status === 'generating' && <BlinkingCursor />}
      </div>

      {status === 'done' && (
        <div className="response-actions">
          <CopyButton content={content} />
          <RegenerateButton />
          <FeedbackButtons />
        </div>
      )}
    </div>
  );
}
```

**Why this matters:**
- "Thinking" phase sets expectations (not instant)
- Character-by-character generation shows active work
- Users can read while generation happens
- Clear transition to "done" state with action options

### Progressive Enhancement

Stream additional context after the main response:

```tsx
function EnhancedResponse({ response, citations }) {
  return (
    <div>
      {/* Main content streams first */}
      <StreamingContent content={response} />

      {/* Citations load after main content */}
      <Suspense fallback={<CitationSkeleton />}>
        <Citations sources={citations} />
      </Suspense>

      {/* Related suggestions load last */}
      <Suspense fallback={<SuggestionsSkeleton />}>
        <RelatedQuestions />
      </Suspense>
    </div>
  );
}
```

Users get the answer immediately, with supporting information loading progressively.

## Core Pattern 2: User Correction as First-Class Feature

AI will be wrong. Design for easy correction, not as an edge case but as a core workflow.

### Inline Editing

```tsx
function EditableAIOutput({ content, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = async () => {
    await onUpdate(editedContent);
    setIsEditing(false);

    // Track correction for model improvement
    trackCorrection({
      original: content,
      corrected: editedContent,
      type: 'user_edit'
    });
  };

  return (
    <div className="editable-output">
      {isEditing ? (
        <div className="edit-mode">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="edit-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <div className="content">{content}</div>
          <button
            className="edit-trigger"
            onClick={() => setIsEditing(true)}
          >
            <EditIcon /> Edit
          </button>
        </div>
      )}
    </div>
  );
}
```

### Partial Acceptance

Let users accept parts of a response and regenerate others:

```tsx
function SegmentedResponse({ segments }) {
  const [acceptedSegments, setAcceptedSegments] = useState({});

  return (
    <div className="segmented-response">
      {segments.map((segment, i) => (
        <div
          key={i}
          className={`segment ${acceptedSegments[i] ? 'accepted' : ''}`}
        >
          <div className="segment-content">{segment.content}</div>
          <div className="segment-actions">
            <button onClick={() => acceptSegment(i)}>
              <CheckIcon /> Accept
            </button>
            <button onClick={() => regenerateSegment(i)}>
              <RefreshIcon /> Regenerate
            </button>
            <button onClick={() => editSegment(i)}>
              <EditIcon /> Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Feedback Loops

Every AI interaction should offer feedback options:

```tsx
function FeedbackButtons({ responseId }) {
  const [feedback, setFeedback] = useState(null);

  const submitFeedback = async (type: 'good' | 'bad', details?: string) => {
    await api.submitFeedback({ responseId, type, details });
    setFeedback(type);
  };

  if (feedback) {
    return <span className="feedback-received">Thanks for your feedback!</span>;
  }

  return (
    <div className="feedback-buttons">
      <button
        onClick={() => submitFeedback('good')}
        aria-label="This was helpful"
      >
        <ThumbsUpIcon />
      </button>
      <button
        onClick={() => openDetailedFeedback('bad')}
        aria-label="This wasn't helpful"
      >
        <ThumbsDownIcon />
      </button>
    </div>
  );
}
```

Negative feedback should prompt for more detail - what was wrong helps improve the system.

## Core Pattern 3: Citation and Source Display

Grounding AI responses in verifiable sources builds trust and enables verification.

### Inline Citations

```tsx
function CitedContent({ content, citations }) {
  const citedContent = parseContentWithCitations(content);

  return (
    <div className="cited-content">
      {citedContent.map((segment, i) => (
        segment.type === 'text' ? (
          <span key={i}>{segment.content}</span>
        ) : (
          <CitationReference
            key={i}
            citation={citations[segment.citationId]}
          />
        )
      ))}

      <div className="sources-section">
        <h4>Sources</h4>
        {citations.map((citation, i) => (
          <SourceCard key={i} source={citation} />
        ))}
      </div>
    </div>
  );
}

function CitationReference({ citation }) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <span
      className="citation-ref"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <sup>[{citation.id}]</sup>
      {showPreview && (
        <div className="citation-preview">
          <strong>{citation.title}</strong>
          <p>{citation.excerpt}</p>
          <a href={citation.url} target="_blank" rel="noopener">
            View source →
          </a>
        </div>
      )}
    </span>
  );
}
```

### Confidence Indicators

When appropriate, show how confident the AI is:

```tsx
function ConfidenceIndicator({ confidence }: { confidence: number }) {
  const level =
    confidence > 0.9 ? 'high' :
    confidence > 0.7 ? 'medium' :
    confidence > 0.5 ? 'low' : 'very-low';

  const labels = {
    'high': 'High confidence',
    'medium': 'Moderate confidence - verify important details',
    'low': 'Low confidence - please verify',
    'very-low': 'Very uncertain - treat as starting point only'
  };

  return (
    <div className={`confidence-indicator ${level}`}>
      <ConfidenceMeter value={confidence} />
      <span>{labels[level]}</span>
    </div>
  );
}
```

## Core Pattern 4: Graceful Failure States

AI fails in unique ways. Design for each failure mode:

### Refusal Handling

```tsx
function RefusalState({ reason, alternatives }) {
  return (
    <div className="refusal-state">
      <div className="refusal-header">
        <InfoIcon />
        <span>I can't help with this request</span>
      </div>

      <p className="refusal-reason">{reason}</p>

      {alternatives.length > 0 && (
        <div className="alternatives">
          <p>Here are some things I can help with instead:</p>
          <ul>
            {alternatives.map((alt, i) => (
              <li key={i}>
                <button onClick={() => tryAlternative(alt)}>
                  {alt.suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="rephrase-button">
        Rephrase your request
      </button>
    </div>
  );
}
```

### Hallucination Warnings

When the AI generates information that can't be verified:

```tsx
function UnverifiedContent({ content, canVerify }) {
  return (
    <div className="unverified-content">
      {!canVerify && (
        <div className="warning-banner">
          <WarningIcon />
          <span>
            This response includes information I couldn't verify.
            Please double-check important facts.
          </span>
        </div>
      )}

      <div className="content">{content}</div>

      <div className="verification-prompt">
        <span>Was this information accurate?</span>
        <button onClick={() => reportAccurate()}>Yes</button>
        <button onClick={() => reportInaccurate()}>No, report issue</button>
      </div>
    </div>
  );
}
```

### Timeout and Error States

```tsx
function AIError({ error, onRetry }) {
  const errorMessages = {
    'timeout': {
      title: 'This is taking longer than expected',
      message: 'The request is still processing. You can wait or try again.',
      actions: ['wait', 'retry', 'simplify']
    },
    'overloaded': {
      title: 'High demand right now',
      message: 'Please try again in a moment.',
      actions: ['retry']
    },
    'context_too_long': {
      title: 'Too much information at once',
      message: 'Try breaking your request into smaller parts.',
      actions: ['simplify']
    },
    'unknown': {
      title: 'Something went wrong',
      message: 'We encountered an unexpected issue.',
      actions: ['retry', 'contact_support']
    }
  };

  const { title, message, actions } = errorMessages[error.type] || errorMessages.unknown;

  return (
    <div className="ai-error">
      <div className="error-header">
        <ErrorIcon />
        <h3>{title}</h3>
      </div>
      <p>{message}</p>
      <div className="error-actions">
        {actions.includes('retry') && (
          <button onClick={onRetry}>Try again</button>
        )}
        {actions.includes('simplify') && (
          <button onClick={() => openSimplifyDialog()}>
            Help me simplify
          </button>
        )}
        {actions.includes('wait') && (
          <button onClick={() => continueWaiting()}>
            Keep waiting
          </button>
        )}
      </div>
    </div>
  );
}
```

## Core Pattern 5: Human-in-the-Loop Workflows

For high-stakes AI actions, build approval workflows:

### Preview and Confirm

```tsx
function AIActionPreview({ action, onConfirm, onCancel }) {
  return (
    <div className="action-preview">
      <div className="preview-header">
        <AlertIcon />
        <span>Review before executing</span>
      </div>

      <div className="action-details">
        <h4>The AI wants to:</h4>
        <div className="action-description">
          {action.description}
        </div>

        <h4>This will affect:</h4>
        <ul className="affected-items">
          {action.affectedItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        {action.reversible ? (
          <span className="reversible-badge">
            <UndoIcon /> This can be undone
          </span>
        ) : (
          <span className="irreversible-badge">
            <WarningIcon /> This cannot be undone
          </span>
        )}
      </div>

      <div className="preview-actions">
        <button
          className="confirm-button"
          onClick={onConfirm}
        >
          Confirm and execute
        </button>
        <button
          className="cancel-button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button onClick={() => editAction()}>
          Modify first
        </button>
      </div>
    </div>
  );
}
```

### Staged Execution

For complex operations, show progress and allow intervention:

```tsx
function StagedExecution({ stages }) {
  return (
    <div className="staged-execution">
      {stages.map((stage, i) => (
        <div key={i} className={`stage ${stage.status}`}>
          <div className="stage-header">
            <StageIcon status={stage.status} />
            <span>{stage.name}</span>
          </div>

          {stage.status === 'in_progress' && (
            <div className="stage-progress">
              <ProgressBar value={stage.progress} />
              <button onClick={() => pauseExecution()}>
                Pause
              </button>
            </div>
          )}

          {stage.status === 'awaiting_approval' && (
            <div className="stage-approval">
              <p>{stage.approvalMessage}</p>
              <button onClick={() => approveStage(i)}>
                Continue
              </button>
              <button onClick={() => rejectStage(i)}>
                Stop here
              </button>
            </div>
          )}

          {stage.status === 'completed' && stage.result && (
            <div className="stage-result">
              <span>{stage.result.summary}</span>
              <button onClick={() => showDetails(i)}>
                View details
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Design Principles for AI UX

### 1. Set Expectations Early

Before users interact with AI, tell them what to expect:
- What the AI can and cannot do
- What kinds of inputs work best
- When to trust output versus verify
- How to get help when AI fails

### 2. Make the AI's State Visible

Users should always know:
- Is the AI working or idle?
- How far along is a long operation?
- Did something fail or succeed?
- What can be done next?

### 3. Preserve User Agency

The user is in control, not the AI:
- Always provide escape hatches
- Never force users to accept AI output
- Make correction as easy as generation
- Allow users to override AI decisions

### 4. Design for Error Recovery

Every failure mode needs a recovery path:
- Clear error messages (not technical jargon)
- Suggested next steps
- Easy retry mechanisms
- Fallback to human assistance

### 5. Build Trust Gradually

Start with low-stakes, high-visibility operations:
- Show AI work before it executes
- Require confirmation for impactful actions
- Track and display accuracy over time
- Let users adjust AI autonomy based on trust

## My Take: UX Is the Bottleneck

In my opinion, AI capability is outpacing AI UX. We have models that can do remarkable things, but interfaces that fail to communicate those capabilities, handle failures gracefully, or build user trust.

The teams that win in AI products won't just have the best models - they'll have interfaces that make those models usable, trustworthy, and delightful. Design for uncertainty. Build for correction. Communicate confidence. Show your work.

The AI can be brilliant, but if users don't trust it, don't understand it, and can't correct it - it doesn't matter. UX is the bottleneck.

Design accordingly.
