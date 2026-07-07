import React from "react";

function Stars({ rating = 0 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i <= Math.round(rating) ? "fill-accent" : "fill-ink/15"}`}
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.9l-5.21 2.62 1-5.8-4.21-4.1 5.82-.85z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProfileCard({ freelancer }) {
  const { name, title, avatarInitials, rating, reviewsCount, hourlyRate, skills = [] } = freelancer;

  return (
    <div className="card flex items-center gap-4 p-5">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-100 font-display text-lg font-semibold text-brand-700">
        {avatarInitials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="truncate font-semibold text-ink">{name}</h4>
          <span className="text-sm font-semibold text-ink">${hourlyRate}/hr</span>
        </div>
        <p className="truncate text-sm text-ink/60">{title}</p>
        <div className="mt-1 flex items-center gap-2">
          <Stars rating={rating} />
          <span className="text-xs text-ink/50">({reviewsCount})</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((s) => (
            <span key={s} className="rounded-full bg-ink/5 px-2.5 py-0.5 text-xs text-ink/70">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
