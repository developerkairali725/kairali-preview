"use client";

import { useEffect } from "react";
import { installDomTracking } from "../integrations/dom.ts";
import { installChatHooks } from "../integrations/chat.ts";
import { installCookieChoices } from "../integrations/consent.ts";

/** Installs the delegated data-track listener, scroll depth, window.lpChat and the footer "Cookie preferences" listener once per page. Renders nothing. */
export default function Tracking() {
  useEffect(() => {
    const offChat = installChatHooks();
    const offDom = installDomTracking();
    const offCookies = installCookieChoices();
    return () => {
      offCookies();
      offDom();
      offChat();
    };
  }, []);
  return null;
}
