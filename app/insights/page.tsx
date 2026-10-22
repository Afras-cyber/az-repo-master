const architecture = [
  {
    name: "Next.js UI",
    detail: "Repository browser, chat, citations",
  },
  {
    name: "FastAPI service",
    detail: "Validation, GitHub fetch, chunking, retrieval, provider adapter",
  },
  {
    name: "Chroma + local embeddings",
    detail: "Chunks carry file path and line range",
  },
  {
    name: "Ollama (OpenAI optional)",
    detail: "Answers only from retrieved context",
  },
];

const metrics = [
  { value: "12", label: "Test questions" },
  { value: "83%", label: "Right file in top 3" },
  { value: "2/2", label: "Refused with no evidence" },
];

const testQuestions = [
  {
    question: "How does authentication work?",
    evidence: "src/auth.ts",
    result: "Pass",
    status: "pass",
  },
  {
    question: "How is the API client configured?",
    evidence: "src/api/client.ts",
    result: "Pass",
    status: "pass",
  },
  {
    question: "What does this project do?",
    evidence: "README.md",
    result: "Pass",
    status: "pass",
  },
  {
    question: "Which payment provider is used?",
    evidence: "None in repo",
    result: "Refused correctly",
    status: "pass",
  },
  {
    question: "Where are retries handled?",
    evidence: "src/api/client.ts",
    result: "Missed: wrong chunk",
    status: "miss",
  },
] as const;

function EvidenceTag({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-control border border-border bg-code-background px-2.5 py-1 font-mono text-small text-text">
      {children}
    </span>
  );
}

export default function InsightsPage() {
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

      <form className="mb-4 flex flex-col gap-3 desktop:flex-row">
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

      <div className="grid gap-4 desktop:grid-cols-2">
        <section
          aria-labelledby="architecture-title"
          className="rounded-card border border-border bg-surface p-4 desktop:p-5"
        >
          <h2
            id="architecture-title"
            className="mb-3 text-heading2 font-bold leading-heading text-text"
          >
            How it works
          </h2>
          <ol className="flex flex-col gap-2">
            {architecture.map((item, index) => (
              <li
                key={item.name}
                className="flex items-start gap-3 rounded-control border border-border bg-code-background/60 p-3"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-pill bg-accent/15 text-caption font-bold text-accent">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-medium text-text">{item.name}</h3>
                  <p className="mt-0.5 text-body leading-body text-text-muted">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="evaluation-title"
          className="rounded-card border border-border bg-surface p-4 desktop:p-5"
        >
          <h2
            id="evaluation-title"
            className="mb-2 text-heading2 font-bold leading-heading text-text"
          >
            Evaluation results
          </h2>
          <p className="mb-5 text-body leading-body text-text-muted">
            Sample numbers for this design. Replace them with results from a
            real test run.
          </p>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 desktop:grid-cols-1 desktop:gap-5">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-control border border-border bg-code-background/60 p-3 desktop:border-0 desktop:bg-transparent desktop:p-0"
              >
                <dd className="text-stat font-bold leading-heading tracking-tight text-text">
                  {metric.value}
                </dd>
                <dt className="mt-1 text-body text-text-muted">
                  {metric.label}
                </dt>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section
        aria-labelledby="test-questions-title"
        className="mt-4 rounded-card border border-border bg-surface p-4 desktop:p-5"
      >
        <h2
          id="test-questions-title"
          className="mb-3 text-heading2 font-bold leading-heading text-text"
        >
          Test questions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-body">
            <thead>
              <tr className="border-b border-border text-text">
                <th scope="col" className="px-2.5 pb-2.5 font-bold">
                  Question
                </th>
                <th scope="col" className="px-2.5 pb-2.5 font-bold">
                  Expected evidence
                </th>
                <th scope="col" className="px-2.5 pb-2.5 font-bold">
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              {testQuestions.map((test) => (
                <tr
                  key={test.question}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-2.5 py-2.5 text-text">
                    {test.question}
                  </td>
                  <td className="px-2.5 py-2.5 font-mono text-small text-text-muted">
                    {test.evidence}
                  </td>
                  <td
                    className={`whitespace-nowrap px-2.5 py-2.5 font-semibold ${
                      test.status === "pass"
                        ? "text-status-pass"
                        : "text-status-concern"
                    }`}
                  >
                    {test.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        aria-labelledby="quality-report-title"
        className="mt-4 rounded-card border border-border bg-surface p-4 desktop:p-5"
      >
        <h2
          id="quality-report-title"
          className="mb-2 text-heading2 font-bold leading-heading text-text"
        >
          Quality report
          <span className="ml-2 text-small font-medium text-text-muted">
            (sample findings)
          </span>
        </h2>
        <p className="mb-4 text-body leading-body text-text-muted">
          Each concern links to evidence. Findings below are illustrative and
          should be verified in the repository.
        </p>
        <ul className="flex flex-col items-start gap-2">
          <li>
            <EvidenceTag>
              Token stored in module variable
              <span className="font-semibold text-accent">
                src/api/client.ts:6
              </span>
            </EvidenceTag>
          </li>
          <li>
            <EvidenceTag>
              No rate limit on login
              <span className="font-semibold text-accent">src/auth.ts:9</span>
            </EvidenceTag>
          </li>
        </ul>
      </section>
    </main>
  );
}
