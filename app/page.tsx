const stats = [
  { value: "48", label: "Files indexed" },
  { value: "312", label: "Chunks embedded" },
  { value: "TypeScript", label: "Main language" },
  { value: "Ready", label: "Analysis status" },
];

const indexingSteps = [
  "Validate URL",
  "Fetch files from GitHub",
  "Split into chunks",
  "Create local embeddings",
  "Index ready",
];

const languages = [
  { label: "TypeScript", percent: 72, color: "bg-chart-typescript" },
  { label: "Markdown", percent: 14, color: "bg-chart-markdown" },
  { label: "JSON", percent: 9, color: "bg-chart-json" },
  { label: "Other", percent: 5, color: "bg-chart-other" },
];

export default function Home() {
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

      <section aria-label="Repository statistics" className="mb-4">
        <dl className="grid grid-cols-2 gap-3 desktop:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-card border border-border bg-surface p-4 desktop:p-5"
            >
              <dt className="text-body font-bold leading-heading tracking-tight text-text desktop:text-stat">
                {stat.value}
              </dt>
              <dd className="mt-1 text-small text-text-muted desktop:text-body">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-4 desktop:grid-cols-2">
        <section
          aria-labelledby="indexing-title"
          className="rounded-card border border-border bg-surface p-4 desktop:p-5"
        >
          <h2
            id="indexing-title"
            className="mb-3 text-heading2 font-bold leading-heading text-text"
          >
            Indexing progress
          </h2>
          <ol className="flex flex-col gap-2.5">
            {indexingSteps.map((step) => (
              <li
                key={step}
                className="flex items-center gap-3 text-body text-text"
              >
                <span
                  aria-hidden="true"
                  className="flex size-6 shrink-0 items-center justify-center rounded-pill bg-accent text-sm font-bold text-accent-on"
                >
                  <svg
                    className="size-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <path d="m4 10 4 4 8-8" />
                  </svg>
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="languages-title"
          className="rounded-card border border-border bg-surface p-4 desktop:p-5"
        >
          <h2
            id="languages-title"
            className="mb-3 text-heading2 font-bold leading-heading text-text"
          >
            Languages
          </h2>
          <div
            role="img"
            aria-label="Language distribution: TypeScript 72%, Markdown 14%, JSON 9%, Other 5%"
            className="mb-3 flex h-3 overflow-hidden rounded-pill bg-code-background"
          >
            {languages.map((language) => (
              <span
                key={language.label}
                className={language.color}
                style={{ width: `${language.percent}%` }}
              />
            ))}
          </div>
          <ul className="mb-3 flex flex-wrap gap-x-3 gap-y-1 text-small text-text-muted desktop:text-body">
            {languages.map((language) => (
              <li key={language.label} className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={`size-2.5 rounded-pill ${language.color}`}
                />
                {language.label} {language.percent}%
              </li>
            ))}
          </ul>
          <p className="text-small leading-body text-text-muted desktop:text-body">
            Skipped: binaries, .env files, lockfiles, generated and oversized
            files.
          </p>
        </section>
      </div>
    </main>
  );
}
