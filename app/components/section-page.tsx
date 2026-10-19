export default function SectionPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="mx-auto w-full max-w-content px-5 py-9 desktop:px-9">
      <p className="mb-3 text-small font-bold text-accent">
        REPOSITORY WORKSPACE
      </p>
      <h1 className="text-2xl font-bold leading-heading tracking-tight text-text desktop:text-heading1">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-body leading-body text-text-muted">
        {description}
      </p>
    </main>
  );
}
