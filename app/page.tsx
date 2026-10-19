import Link from "next/link";

const highlights = [
  {
    label: "Code",
    description: "Browse files and understand how your project is organized.",
    href: "/code",
    icon: "</>",
  },
  {
    label: "Ask",
    description: "Get answers to questions about your repository.",
    href: "/ask",
    icon: "?",
  },
  {
    label: "Insights",
    description: "Find useful context and patterns across your project.",
    href: "/insights",
    icon: "↗",
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-content px-5 py-9 desktop:px-9">
      <div className="mb-9 max-w-2xl">
        <p className="mb-3 text-small font-bold text-accent">
          REPOSITORY WORKSPACE
        </p>
        <h1 className="text-2xl font-bold leading-heading tracking-tight text-text desktop:text-heading1">
          Your repository, in focus.
        </h1>
        <p className="mt-3 text-body leading-body text-text-muted">
          Explore your code, ask questions, and uncover insights from one
          workspace.
        </p>
      </div>

      <section aria-labelledby="workspace-sections">
        <h2
          id="workspace-sections"
          className="mb-4 text-small font-bold text-text"
        >
          Explore your workspace
        </h2>
        <div className="grid gap-4 desktop:grid-cols-3">
          {highlights.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group rounded-card border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-lg hover:shadow-text/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="mb-8 flex size-10 items-center justify-center rounded-control bg-accent-soft text-small font-bold text-accent">
                {item.icon}
              </span>
              <h3 className="text-body font-bold text-text group-hover:text-accent">
                {item.label}
              </h3>
              <p className="mt-2 text-small leading-body text-text-muted">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
