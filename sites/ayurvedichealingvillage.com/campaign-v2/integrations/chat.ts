// Chat hooks. The chat widget slot (Task 13) and any vendor script call these; they only call track().
// A vendor script that cannot import modules can use window.lpChat.onChatOpen("floating") etc.
// Never pass message text, names, emails or phone numbers: only the fixed params below.

import { track } from "./track.ts";

export type ChatSource = "ask_sheet" | "floating" | "success";

export function onChatOpen(source: ChatSource = "floating"): void {
  track("chat_open", { source });
}

export function onChatMessage(role: "user" = "user"): void {
  track("chat_message", { role });
}

/** ref = our opaque lead reference, if the vendor has one. Never a name, email or phone. */
export function onChatLeadCaptured(ref?: string): void {
  track("chat_lead", ref ? { ref } : {});
}

export type LpChat = { onChatOpen: typeof onChatOpen; onChatMessage: typeof onChatMessage; onChatLeadCaptured: typeof onChatLeadCaptured };

/** Exposes window.lpChat for vendor callbacks. Returns a cleanup that removes it. No-op on the server. */
export function installChatHooks(): () => void {
  if (typeof window === "undefined") return () => {};
  const w = window as unknown as { lpChat?: LpChat };
  const hooks: LpChat = { onChatOpen, onChatMessage, onChatLeadCaptured };
  w.lpChat = hooks;
  return () => {
    if (w.lpChat === hooks) delete w.lpChat;
  };
}
