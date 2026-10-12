"use client";

import { useEffect, useRef } from "react";
import type { Channel } from "../../kit/types.ts";
import { channelLink } from "../../kit/handoff.ts";
import { CHANNELS } from "../../forms/schema.ts";
import { contact } from "../../../campaign-v110/lib/site.ts";

// Spec §7b / canvas Form-Flow "Done". Shown ONLY after the adapter confirmed the lead is stored.
// Every link carries only the opaque ref code (channelLink), never a name, email, phone or program.
// No reply-time wording anywhere on this screen.

const PRIMARY: Record<Channel, string> = {
  whatsapp: "Continue on WhatsApp now",
  instagram: "Continue on Instagram now",
  messenger: "Continue on Messenger now",
  chat: "Open chat now",
  call: `Call us now · ${contact.phone.display}`,
  email: "Open chat now while you wait",
};
const TEXT: Record<Channel, string> = {
  whatsapp: "Tap below to open WhatsApp. Your reference code tells our assistant who you are.",
  instagram: "Tap below to open our Instagram chat. Your reference code tells our assistant who you are.",
  messenger: "Tap below to open Messenger. Your reference code tells our assistant who you are.",
  chat: "Open the chat on this page and share your reference code.",
  call: "Our patient team will call you to arrange your free consultation — or call us now.",
  email: "Our patient team will email you to arrange your free consultation. Prefer to talk now? Open the chat.",
};
export const AI_LINE = "Our AI assistant replies first; a member of the patient team follows up. The chat link carries only your reference code — never your personal details.";

function href(ch: Channel, ref: string): string {
  return channelLink(ch, ref) ?? "#chat";
}
const external = (h: string) => h.startsWith("https://");

/** The live campaign form's success: its own thank-you line, then the channel buttons (ref code only). */
const SIMPLE_CHANNELS: readonly Channel[] = ["whatsapp", "instagram", "messenger", "call"];

export default function Success({ channel, refCode, headingId, successText, plain }:
  { channel: Channel; refCode: string; headingId: string; successText?: string; plain?: boolean }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);

  // Live ad routes: the existing form's received line only. No ref code or extra channel links; the site's
  // lead receipt then hands the visitor to /thanks/.
  if (plain && successText) {
    return (
      <div className="lp-enq__done" role="status">
        <h3 id={headingId} className="lp-enq__done-h" tabIndex={-1} ref={heading}>
          <span className="lp-enq__thanks">{successText}</span>
        </h3>
      </div>
    );
  }

  if (successText) {
    return (
      <div className="lp-enq__done" role="status">
        <h3 id={headingId} className="lp-enq__done-h" tabIndex={-1} ref={heading}>
          <span className="lp-enq__ref">Ref {refCode}</span>
          <span className="lp-enq__thanks">{successText}</span>
        </h3>
        <p className="lp-enq__or">Or continue on</p>
        <ul className="lp-enq__others">
          {SIMPLE_CHANNELS.map((id) => {
            const h = href(id, refCode);
            const label = id === "call" ? "Phone call" : CHANNELS.find((c) => c.id === id)?.label ?? id;
            return (
              <li key={id}>
                <a className="lp-enq__other" href={h} {...(external(h) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  data-track="channel_handoff" data-track-channel={id} data-track-ref={refCode}>
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
        <p className="lp-enq__ai">{AI_LINE}</p>
      </div>
    );
  }

  // Email has no instant link, so its primary action is the on-page chat.
  const primaryChannel: Channel = channel === "email" ? "chat" : channel;
  const others = CHANNELS.filter((c) => c.id !== channel && c.id !== "email" && c.id !== primaryChannel).slice(0, 4);
  const primaryHref = href(primaryChannel, refCode);

  return (
    <div className="lp-enq__done">
      {/* One heading holds both lines, so moving focus here announces the ref and the thank-you together. */}
      <h3 id={headingId} className="lp-enq__done-h" tabIndex={-1} ref={heading}>
        <span className="lp-enq__ref">Enquiry received · ref {refCode}</span>
        <span className="lp-enq__thanks">Thank you. Let’s talk now — no waiting.</span>
      </h3>
      <p className="lp-enq__done-text">{TEXT[channel]}</p>
      <a
        className={`lp-btn ${channel === "whatsapp" ? "lp-btn--wa" : "lp-btn--primary"} lp-enq__primary`}
        href={primaryHref}
        {...(external(primaryHref) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        data-track="channel_handoff" data-track-channel={primaryChannel} data-track-ref={refCode}
      >
        {PRIMARY[channel]}
      </a>
      <p className="lp-enq__or">Or continue on</p>
      <ul className="lp-enq__others">
        {others.map((o) => {
          const h = href(o.id, refCode);
          return (
            <li key={o.id}>
              <a className="lp-enq__other" href={h} {...(external(h) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                data-track="channel_handoff" data-track-channel={o.id} data-track-ref={refCode}>
                {o.id === "call" ? "Phone call" : o.label}
              </a>
            </li>
          );
        })}
      </ul>
      <p className="lp-enq__ai">{AI_LINE}</p>
    </div>
  );
}
