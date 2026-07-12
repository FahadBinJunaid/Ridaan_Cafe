export default function MenuItemLoading() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 h-4 w-24 animate-pulse rounded bg-muted" />
      <article>
        <div className="mb-6 flex h-64 w-full animate-pulse items-center justify-center overflow-hidden rounded-lg bg-muted" />
        <div className="space-y-4">
          <div>
            <div className="mb-2 h-3 w-32 animate-pulse rounded bg-muted" />
            <div className="h-8 w-72 animate-pulse rounded bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="h-14 w-full animate-pulse rounded-lg bg-muted" />
        </div>
      </article>
    </main>
  );
}
