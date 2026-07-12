"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md">
        <p className="text-7xl font-bold text-destructive">500</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-muted-foreground">
          An unexpected error occurred. Please try again or contact support.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
