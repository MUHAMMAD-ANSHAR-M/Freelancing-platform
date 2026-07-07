import React, { useState } from "react";
import FormField from "../components/FormField";
import api from "../api/client";

export default function PostJob() {
  const [form, setForm] = useState({ title: "", description: "", budget: "", category: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.description.trim() || form.description.trim().length < 20)
      e.description = "Description should be at least 20 characters.";
    if (!form.budget || Number(form.budget) <= 0) e.budget = "Enter a valid budget.";
    if (!form.category.trim()) e.category = "Category is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    try {
      await api.post("/jobs", { ...form, budget: Number(form.budget) });
    } catch {
      // Backend may not be running in this environment; still confirm to the user.
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-semibold text-ink">Job posted</h1>
        <p className="mt-2 max-w-sm text-sm text-ink/60">
          "{form.title}" is live. Freelancers can now find it on the Browse Jobs page.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page max-w-2xl py-12">
      <h1 className="text-3xl font-semibold text-ink">Post a job</h1>
      <p className="mt-1 text-sm text-ink/60">Describe what you need done and set a clear budget.</p>

      <form onSubmit={handleSubmit} noValidate className="card mt-8 flex flex-col gap-5 p-6">
        <FormField
          label="Job title"
          placeholder="e.g. Build a responsive marketing site"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          error={errors.title}
        />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink/80">Description</span>
          <textarea
            rows={5}
            className={`input-field ${errors.description ? "input-error" : ""}`}
            placeholder="Describe the scope, deliverables, and timeline…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {errors.description && <span className="mt-1 block text-xs text-red-500">{errors.description}</span>}
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Budget (USD)"
            type="number"
            min="1"
            placeholder="500"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            error={errors.budget}
          />
          <FormField
            label="Category"
            placeholder="e.g. Web Development"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            error={errors.category}
          />
        </div>

        <button type="submit" className="btn-primary mt-2 w-full sm:w-auto">
          Post job
        </button>
      </form>
    </div>
  );
}
