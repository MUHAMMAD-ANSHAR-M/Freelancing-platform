import React from "react";

export default function JobCard({ job, onApply }) {
  const { title, description, budget, category, postedBy, status = "open" } = job;

  return (
    <div className="card flex flex-col gap-4 p-6 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          {postedBy && <p className="text-xs text-ink/50">Posted by {postedBy}</p>}
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            status === "open"
              ? "bg-emerald-50 text-emerald-700"
              : status === "in-progress"
              ? "bg-amber-50 text-amber-700"
              : "bg-ink/10 text-ink/60"
          }`}
        >
          {status}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-ink/70 line-clamp-3">{description}</p>

      <div className="flex flex-wrap items-center gap-2">
        {category && (
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            {category}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-4">
        <div>
          <p className="text-xs text-ink/50">Budget</p>
          <p className="text-base font-semibold text-ink">
            ${budget?.toLocaleString?.() ?? budget}
          </p>
        </div>
        <button onClick={() => onApply?.(job)} className="btn-primary !px-5 !py-2.5 text-sm">
          Apply
        </button>
      </div>
    </div>
  );
}
