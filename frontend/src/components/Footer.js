import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-sm text-white">F</span>
            Forge
          </div>
          <p className="mt-3 text-sm text-ink/60">
            A calmer place to hire freelance talent and find meaningful work.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">For clients</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li><Link to="/post-job" className="hover:text-ink">Post a job</Link></li>
            <li><Link to="/jobs" className="hover:text-ink">Browse freelancers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">For freelancers</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li><Link to="/jobs" className="hover:text-ink">Find work</Link></li>
            <li><Link to="/profile" className="hover:text-ink">Build your profile</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li><a href="#" className="hover:text-ink">About</a></li>
            <li><a href="#" className="hover:text-ink">Support</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10 py-5 text-center text-xs text-ink/50">
        © {new Date().getFullYear()} Forge. All rights reserved.
      </div>
    </footer>
  );
}
