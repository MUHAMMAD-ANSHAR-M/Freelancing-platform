import React from "react";

export default function FormField({ label, error, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>
      <input className={`input-field ${error ? "input-error" : ""}`} {...inputProps} />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
