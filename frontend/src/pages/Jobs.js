import React, { useEffect, useMemo, useState } from "react";
import JobCard from "../components/JobCard";
import api from "../api/client";

const FALLBACK_JOBS = [
  {
    _id: "1",
    title: "Build a marketing landing page",
    description:
      "Need a responsive, conversion-focused landing page built in React and Tailwind for a product launch.",
    budget: 800,
    category: "Web Development",
    postedBy: "Nova Labs",
    status: "open"
  },
  {
    _id: "2",
    title: "Logo and brand identity",
    description: "Looking for a designer to create a logo, color palette, and brand guidelines for a coffee brand.",
    budget: 450,
    category: "Design & Creative",
    postedBy: "Roast & Co.",
    status: "open"
  },
  {
    _id: "3",
    title: "Weekly blog writer for SaaS",
    description: "Ongoing role writing 2 SEO-optimized blog posts per week on productivity and remote work.",
    budget: 1200,
    category: "Writing",
    postedBy: "FlowStack",
    status: "in-progress"
  },
  {
    _id: "4",
    title: "Data pipeline cleanup",
    description: "Refactor an existing Python ETL pipeline for better reliability and add basic monitoring.",
    budget: 1600,
    category: "Data & AI",
    postedBy: "Ledger Analytics",
    status: "open"
  }
];

export default function Jobs() {
  const [jobs, setJobs] = useState(FALLBACK_JOBS);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let active = true;
    api
      .get("/jobs")
      .then((res) => {
        if (active && Array.isArray(res.data) && res.data.length) setJobs(res.data);
      })
      .catch(() => {
        // Backend not reachable yet — keep sample jobs so the UI stays usable.
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(jobs.map((j) => j.category).filter(Boolean))],
    [jobs]
  );

  const filtered = jobs.filter((j) => {
    const matchesQuery = `${j.title} ${j.description}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || j.category === category;
    return matchesQuery && matchesCategory;
  });

  const handleApply = (job) => {
    alert(`Application started for "${job.title}". Connect the /api/proposals endpoint to submit it for real.`);
  };

  return (
    <div className="container-page py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Browse jobs</h1>
          <p className="mt-1 text-sm text-ink/60">{filtered.length} open opportunities{loading ? " · loading…" : ""}</p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs…"
          className="input-field sm:w-72"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === c ? "bg-brand-600 text-white" : "bg-white text-ink/70 border border-ink/10 hover:border-ink/30"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((job) => (
          <JobCard key={job._id} job={job} onApply={handleApply} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-sm text-ink/50">No jobs match your search yet. Try another keyword.</p>
      )}
    </div>
  );
}
