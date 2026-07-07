import React from "react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Active jobs", value: "3,200+" },
  { label: "Freelancers", value: "18,400+" },
  { label: "Paid out", value: "$9.2M" }
];

const categories = ["Web Development", "Design & Creative", "Writing", "Marketing", "Data & AI", "Video & Audio"];

export default function Home() {
  return (
    <div>
      <section className="border-b border-ink/10 bg-white">
        <div className="container-page grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              Work, on your terms
            </span>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Hire skilled freelancers. Do work you're proud of.
            </h1>
            <p className="mt-4 max-w-md text-base text-ink/60">
              Forge connects clients with vetted freelance talent across design, development,
              writing, and marketing — with transparent budgets and no guesswork.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/jobs" className="btn-primary">
                Browse jobs
              </Link>
              <Link to="/post-job" className="btn-secondary">
                Post a job
              </Link>
            </div>
            <div className="mt-10 flex gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-semibold text-ink">{s.value}</p>
                  <p className="text-xs text-ink/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="card p-6">
              <p className="text-xs font-medium text-ink/50">Featured job</p>
              <h3 className="mt-1 text-lg font-semibold">Redesign a SaaS onboarding flow</h3>
              <p className="mt-2 text-sm text-ink/60">
                Looking for a product designer to simplify our five-step signup into something
                delightful and fast.
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
                <span className="font-semibold text-ink">$2,500 budget</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  open
                </span>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 -z-10 h-full w-full rounded-xl2 bg-brand-100 sm:-right-6 sm:-top-6" />
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-2xl font-semibold text-ink">Popular categories</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c}
              to="/jobs"
              className="card p-4 text-center text-sm font-medium text-ink/70 transition hover:border-brand-300 hover:text-brand-700"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/10 bg-white py-16">
        <div className="container-page grid gap-6 sm:grid-cols-3">
          {[
            ["1. Post or browse", "Clients post jobs with clear budgets; freelancers browse and apply in minutes."],
            ["2. Collaborate", "Message directly, share files, and track progress in one place."],
            ["3. Get paid securely", "Funds are held safely and released when the work is approved."]
          ].map(([title, body]) => (
            <div key={title} className="card p-6">
              <h3 className="font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-ink/60">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
