"use client";

import React, { useState } from "react";
import { Check, Send } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "enterprise",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const SUBJECT_LABELS: Record<string, string> = {
    enterprise: "Kairali Group Operations",
    ayushexcil: "AYUSHEXCIL Export Sourcing",
    investing: "Angel Sourcing Pitch",
    speaking: "Speaking Engagement",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Route via the visitor's own email client to the institutional inbox —
    // no backend exists for this form, so a mailto compose is the honest path.
    const subject = `[abhilashkr.com] ${SUBJECT_LABELS[formData.subject] ?? formData.subject}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`;
    window.location.href = `mailto:info@kairali.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <div className="md:col-span-7 border border-border p-6 bg-card">
      <h3 className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-6">
        Institutional Routing Form
      </h3>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="size-12 rounded-full border border-primary flex items-center justify-center text-primary">
            <Check className="h-6 w-6" />
          </div>
          <h4 className="font-display text-2xl italic text-ink">Draft Prepared</h4>
          <p className="font-sans text-xs text-ink-muted max-w-xs">
            Your email client has opened with the message addressed to info@kairali.com.
            Press send there and our office will route it to the appropriate division.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 font-mono text-xs">
          <div className="flex flex-col space-y-1">
            <label className="text-ink-muted uppercase">Your Name</label>
            <input 
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              className="w-full bg-background border border-border text-ink p-3 outline-none focus:border-primary transition-colors font-sans text-sm rounded-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-ink-muted uppercase">Email Address</label>
            <input 
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              className="w-full bg-background border border-border text-ink p-3 outline-none focus:border-primary transition-colors font-sans text-sm rounded-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-ink-muted uppercase">Subject Division</label>
            <select 
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-background border border-border text-ink p-3 outline-none focus:border-primary transition-colors font-sans text-sm rounded-none"
            >
              <option value="enterprise">Kairali Group Operations</option>
              <option value="ayushexcil">AYUSHEXCIL Export Sourcing</option>
              <option value="investing">Angel Sourcing Pitch</option>
              <option value="speaking">Speaking Engagement</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-ink-muted uppercase">Message Details</label>
            <textarea 
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Specify brief inquiry details..."
              className="w-full bg-background border border-border text-ink p-3 outline-none focus:border-primary transition-colors font-sans text-sm rounded-none"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-xs tracking-widest uppercase border border-primary bg-primary text-background hover:bg-transparent hover:text-primary transition-colors cursor-pointer mt-4"
          >
            <Send className="h-3 w-3" />
            <span>Send Message</span>
          </button>
        </form>
      )}
    </div>
  );
}
