"use client";

import { useState, type FormEvent } from "react";

const suggestedQuestions = [
  "How does authentication work?",
  "How is the API client configured?",
  "What does this project do?",
  "Which payment provider is used?",
];

export default function ChatInterface() {
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");

  function askQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) return;

    setSubmittedQuestion(trimmedQuestion);
    setQuestion("");
  }

  return (
    <main className="mx-auto w-full max-w-content px-5 py-6 desktop:px-9 desktop:py-7">
      <header className="mb-5">
        <h1 className="text-2xl font-bold leading-heading tracking-tight text-text desktop:text-heading1">
          Understand any public repository
        </h1>
        <p className="mt-1 text-body leading-body text-text-muted desktop:text-heading2">
          Ask questions and get answers that point to the exact source lines.
        </p>
      </header>

      <form className="mb-0 flex flex-col gap-3 desktop:flex-row">
        <label className="sr-only" htmlFor="repository-url">
          Public GitHub repository URL
        </label>
        <input
          id="repository-url"
          type="url"
          defaultValue="https://github.com/acme/shop-api"
          placeholder="https://github.com/owner/repository"
          className="min-w-0 flex-1 rounded-control border border-border bg-surface px-4 py-3 text-body text-text outline-none transition placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="button"
          className="shrink-0 rounded-control bg-accent px-5 py-3 text-body font-bold text-accent-on transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Analyze repository
        </button>
      </form>

      <section aria-label="Ask about the repository" className="max-w-5xl">
        <p className="rounded-card border border-border bg-surface px-4 py-3 text-body leading-body text-text desktop:px-4">
          Ask about how this repository works. I answer only from retrieved code
          and show where each answer came from.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {suggestedQuestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setQuestion(suggestion)}
              className="rounded-pill border border-border bg-surface px-3.5 py-2 text-body text-text transition hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form
          onSubmit={askQuestion}
          className="mt-5 flex flex-col gap-3 desktop:flex-row"
        >
          <label className="sr-only" htmlFor="repository-question">
            Ask about this repository
          </label>
          <input
            id="repository-question"
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask about this repository"
            className="min-w-0 flex-1 rounded-control border border-border bg-surface px-4 py-3 text-body text-text outline-none transition placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <button
            type="submit"
            disabled={!question.trim()}
            className="rounded-control bg-accent px-5 py-3 text-body font-bold text-accent-on transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ask
          </button>
        </form>

        {submittedQuestion ? (
          <p
            role="status"
            className="mt-4 rounded-card border border-border bg-surface px-4 py-3 text-body leading-body text-text-muted"
          >
            “{submittedQuestion}” is ready to send. Connect a repository
            assistant to generate a source-backed answer.
          </p>
        ) : null}
      </section>
    </main>
  );
}
