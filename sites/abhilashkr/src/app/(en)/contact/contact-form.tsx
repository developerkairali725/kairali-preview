"use client";

import React, { useState } from "react";
import { Check, Mail } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "enterprise",
    message: ""
  });
  const [draftPrepared, setDraftPrepared] = useState(false);

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
    setDraftPrepared(true);
  };

  return (
    <div className="md:col-span-7 border border-border p-6 bg-card">
      <h3 className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-6">
        Institutional Routing Form
      </h3>

      <p data-form-delivery-note className="mb-6 border-l border-primary pl-4 font-sans text-xs leading-relaxed text-ink-muted">
        This form does not send or store your message. It prepares an email to info@kairali.com in
        your email app; you must review it and press Send there.
      </p>

      {draftPrepared ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="size-12 rounded-full border border-primary flex items-center justify-center text-primary">
            <Check className="h-6 w-6" />
          </div>
          <h4 className="font-display text-2xl italic text-ink">Email Draft Ready</h4>
          <p className="font-sans text-xs text-ink-muted max-w-xs">
            The site has requested your email app to open a draft addressed to info@kairali.com.
            Nothing has been sent or stored by this website. Review the draft and press Send in your
            email app.
          </p>
          <a
            href="mailto:info@kairali.com"
            className="font-mono text-[10px] uppercase tracking-widest text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Email info@kairali.com directly
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 font-mono text-xs">
          <div className="flex flex-col space-y-1">
            <label htmlFor="contact-name" className="text-ink-muted uppercase">Your Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              className="w-full bg-background border border-border text-ink p-3 outline-none focus:border-primary transition-colors font-sans text-sm rounded-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="contact-email" className="text-ink-muted uppercase">Email Address</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              className="w-full bg-background border border-border text-ink p-3 outline-none focus:border-primary transition-colors font-sans text-sm rounded-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="contact-subject" className="text-ink-muted uppercase">Subject Division</label>
            <select
              id="contact-subject"
              name="subject"
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
            <label htmlFor="contact-message" className="text-ink-muted uppercase">Message Details</label>
            <textarea
              id="contact-message"
              name="message"
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
            className="mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 font-mono text-xs uppercase tracking-widest text-background transition-colors hover:bg-transparent hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <Mail className="h-3 w-3" />
            <span>Prepare Email Draft</span>
          </button>
        </form>
      )}
    </div>
  );
}
