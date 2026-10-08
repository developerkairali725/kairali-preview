// Client behavior is limited to existing form anchors and the existing Priya launcher.
'use client';
import { useEffect, useRef } from 'react';
import { contact, whatsappLink } from '../lib/site';

export default function CampaignExperience() {
  const askAnything = useRef<HTMLButtonElement>(null);
  const launchedHere = useRef(false);
  useEffect(() => {
    document.body.dataset.ahvActualCampaign = 'true';
    const wide = window.matchMedia('(min-width: 761px)');
    const syncIntros = () => document.querySelectorAll<HTMLDetailsElement>('#ahv-campaign-page .campaign-mobile-detail').forEach(detail => { detail.open = wide.matches; });
    syncIntros();
    wide.addEventListener('change', syncIntros);
    function sync() {
      const enquiry = document.querySelector<HTMLAnchorElement>('#ahv-cta-bar .ahv-cta-enquire');
      if (enquiry && enquiry.getAttribute('href') !== '#campaign-consultation') enquiry.setAttribute('href', '#campaign-consultation');
    }
    function click(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !['#consult', '#enquiry', '#campaign-consultation'].includes(url.hash)) return;
      const target = document.getElementById('campaign-consultation');
      if (!target) return;
      event.preventDefault();
      // A hash-only update preserves the existing campaign attribution query.
      history.replaceState(null, '', location.pathname + location.search + '#campaign-consultation');
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      target.querySelector<HTMLInputElement>('input:not([type=hidden]):not([name=company])')?.focus({ preventScroll: true });
    }
    sync();
    const form = document.getElementById('campaign-consultation');
    const formObserver = new IntersectionObserver(entries => {
      document.body.dataset.ahvCampaignFormVisible = String(entries.some(entry => entry.isIntersecting));
    });
    if (form) formObserver.observe(form);
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    let chatWasOpen = document.body.dataset.ahvChatOpen === 'true';
    const chatObserver = new MutationObserver(() => {
      const open = document.body.dataset.ahvChatOpen === 'true';
      if (chatWasOpen && !open && launchedHere.current) {
        const active = document.activeElement;
        const stranded = !active || active === document.body || active.closest('#chatbase-bubble-window, #ahv-contact-controls');
        if (stranded && askAnything.current?.getClientRects().length) askAnything.current.focus({ preventScroll: true });
        launchedHere.current = false;
      }
      chatWasOpen = open;
    });
    chatObserver.observe(document.body, { attributes: true, attributeFilter: ['data-ahv-chat-open'] });
    document.addEventListener('click', click, true);
    return () => { observer.disconnect(); formObserver.disconnect(); chatObserver.disconnect(); wide.removeEventListener('change', syncIntros); document.removeEventListener('click', click, true); delete document.body.dataset.ahvActualCampaign; delete document.body.dataset.ahvCampaignFormVisible; };
  }, []);
  return <aside className="campaign-bottom-help" aria-label="Patient care support">
    <button ref={askAnything} type="button" onClick={() => { launchedHere.current = true; document.querySelector<HTMLButtonElement>('#ahv-contact-controls .ahv-contact-chat')?.click(); }}>Ask Anything</button>
    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp patient care ${contact.whatsapp.display}`}>WhatsApp</a>
  </aside>;
}
