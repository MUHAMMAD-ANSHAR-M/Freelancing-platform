import React from "react";
import ProfileCard from "../components/ProfileCard";

const freelancer = {
  name: "Muhammad Anshar M",
  title: "Full-stack Developer & UI Engineer",
  avatarInitials: "AC",
  rating: 4.8,
  reviewsCount: 62,
  hourlyRate: 45,
  skills: ["React", "Node.js", "Tailwind CSS", "PostgreSQL", "TypeScript"]
};

const portfolio = [
  { title: "FinTrack Dashboard", tag: "Web App", blurb: "Analytics dashboard for a personal finance startup." },
  { title: "Loop Marketplace", tag: "E-commerce", blurb: "Multi-vendor storefront with Stripe checkout." },
  { title: "Roast & Co. Site", tag: "Landing Page", blurb: "Brand site and ordering flow for a coffee roaster." }
];

const reviews = [
  { client: "Nova Labs", rating: 5, comment: "Delivered ahead of schedule with excellent communication throughout." },
  { client: "FlowStack", rating: 4.5, comment: "Strong technical work; would definitely hire again for future projects." },
  { client: "Ledger Analytics", rating: 5, comment: "Understood the brief immediately and asked all the right questions." }
];

function Section({ title, children }) {
  return (
    <section className="card p-6">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function Profile() {
  return (
    <div className="container-page max-w-4xl py-12">
      <ProfileCard freelancer={freelancer} />

      <div className="mt-8 grid gap-6">
        <Section title="About">
          <p className="text-sm leading-relaxed text-ink/70">
            I'm a full-stack developer with six years of experience helping startups ship reliable,
            good-looking products — from marketing sites to internal dashboards. I work closely with
            clients to keep scope realistic and communication frequent.
          </p>
        </Section>

        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {freelancer.skills.map((s) => (
              <span key={s} className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">
                {s}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Portfolio">
          <div className="grid gap-4 sm:grid-cols-3">
            {portfolio.map((p) => (
              <div key={p.title} className="rounded-xl border border-ink/10 p-4">
                <span className="text-xs font-medium text-brand-600">{p.tag}</span>
                <h4 className="mt-1 font-semibold text-ink">{p.title}</h4>
                <p className="mt-1 text-xs text-ink/60">{p.blurb}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Ratings & reviews">
          <div className="flex flex-col divide-y divide-ink/10">
            {reviews.map((r) => (
              <div key={r.client} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">{r.client}</p>
                  <span className="text-sm text-accent">★ {r.rating}</span>
                </div>
                <p className="mt-1 text-sm text-ink/60">{r.comment}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
