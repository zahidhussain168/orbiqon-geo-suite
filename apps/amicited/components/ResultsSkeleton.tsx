/** Loading placeholder shown while a scan runs (>1s operation → skeleton, not a blank spinner). */
export function ResultsSkeleton() {
  return (
    <section className="space-y-6" aria-hidden>
      <div className="card flex flex-col items-center gap-8 p-8 sm:flex-row">
        <div className="skeleton h-[168px] w-[168px] rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="skeleton h-3 w-32" />
          <div className="skeleton h-7 w-48" />
          <div className="skeleton h-4 w-full max-w-md" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card space-y-3 p-4">
            <div className="skeleton h-5 w-28" />
            <div className="skeleton h-4 w-40" />
            <div className="skeleton h-2 w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
