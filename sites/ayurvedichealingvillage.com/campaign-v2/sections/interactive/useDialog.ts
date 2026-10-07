"use client";

// Shared modal-dialog behaviour for AskAnything, LocaleSwitcher and Gallery, on a native <dialog>:
//   - showModal() → the rest of the page is inert (top layer) and the dialog sits above the bar and banner;
//   - aria-modal="true" on the element (spread `dialogProps`);
//   - focus trap: Tab / Shift+Tab wrap inside the dialog (call `trapKeyDown` from the dialog's onKeyDown);
//   - Escape → onEscape ?? onClose (the native `cancel` is prevented so React state stays the source of truth);
//   - body scroll lock while open, released on close AND on unmount;
//   - focus returns to the trigger (the element focused at open, or the one passed to `setTrigger`).
// Render dialog CONTENT only while open, so nothing inside (images) downloads before the visitor asks.

import { useCallback, useEffect, useRef, type KeyboardEvent } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])';

let locks = 0;
let saved: { html: string; body: string } | null = null;
function lockScroll() {
  if (locks++ === 0) {
    saved = { html: document.documentElement.style.overflow, body: document.body.style.overflow };
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
}
function unlockScroll() {
  if (locks === 0) return;
  if (--locks === 0 && saved) {
    document.documentElement.style.overflow = saved.html;
    document.body.style.overflow = saved.body;
    saved = null;
  }
}

function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
}

/** `onEscape` (optional) handles Escape instead of onClose, e.g. the gallery closes its lightbox first. */
export function useDialog(open: boolean, onClose: () => void, onEscape?: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const returnFocus = useRef(true);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    const dlg = ref.current;
    if (!open || !dlg) return;
    if (!trigger.current) {
      const a = document.activeElement;
      trigger.current = a instanceof HTMLElement && a !== document.body ? a : null;
    }
    returnFocus.current = true;
    try { if (!dlg.open) dlg.showModal(); } catch { dlg.setAttribute("open", ""); }
    lockScroll();
    // Initial focus: an explicit [data-autofocus], else the first focusable, else the dialog itself.
    const first = dlg.querySelector<HTMLElement>("[data-autofocus]") ?? focusables(dlg)[0] ?? dlg;
    first.focus();

    const onCancel = (e: Event) => { e.preventDefault(); (onEscapeRef.current ?? onCloseRef.current)(); };
    // Some browsers can force-close a modal (repeated Escape); keep React state in step.
    const onNativeClose = () => onCloseRef.current();
    dlg.addEventListener("cancel", onCancel);
    dlg.addEventListener("close", onNativeClose);
    return () => {
      dlg.removeEventListener("cancel", onCancel);
      dlg.removeEventListener("close", onNativeClose);
      try { if (dlg.open) dlg.close(); } catch { dlg.removeAttribute("open"); }
      unlockScroll();
      const t = trigger.current;
      trigger.current = null;
      if (returnFocus.current && t && t.isConnected) t.focus();
    };
  }, [open]);

  /** Tab / Shift+Tab wrap. Call from the dialog's onKeyDown (compose with your own keys). */
  const trapKeyDown = useCallback((e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Tab" || !ref.current) return;
    const list = focusables(ref.current);
    if (!list.length) { e.preventDefault(); return; }
    const first = list[0];
    const last = list[list.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === ref.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  }, []);

  /** The element focus returns to (e.g. the clicked #chat link, which Safari does not focus on click). */
  const setTrigger = useCallback((el: Element | null) => {
    trigger.current = el instanceof HTMLElement ? el : null;
  }, []);

  /** Skip the focus return for this close (e.g. the lightbox CTA moves focus to #enquiry itself). */
  const skipFocusReturn = useCallback(() => { returnFocus.current = false; }, []);

  return { ref, trapKeyDown, setTrigger, skipFocusReturn, dialogProps: { "aria-modal": true as const } };
}
