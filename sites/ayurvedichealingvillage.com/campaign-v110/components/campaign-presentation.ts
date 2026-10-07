import './campaign-experience.css';
import { Element, Text, htmlToDOM, type DOMNode } from 'html-react-parser';
import routes from '../routes.json';

/** Offers and partnerships share the document, but are not PPC campaigns. */
export const campaignRoutes = routes.filter(route => !route.startsWith('/offers/') && route !== '/kairali-air-india-maharaja-club.html');
export const isCampaign = (route: string) => campaignRoutes.includes(route);
export const FREE_CONSULTATION = 'Get Free Doctor Consultation';

export function elements(nodes: DOMNode[], test: (node: Element) => boolean): Element[] {
  return nodes.flatMap(node => node instanceof Element ? [...(test(node) ? [node] : []), ...elements(node.children as DOMNode[], test)] : []);
}
export const textContent = (node: DOMNode): string => node instanceof Text ? node.data : node instanceof Element ? node.children.map(child => textContent(child as DOMNode)).join('') : '';
const has = (node: Element, name: string) => (node.attribs.class || '').split(/\s+/).includes(name);
const add = (node: Element, name: string) => { node.attribs.class = [node.attribs.class, name].filter(Boolean).join(' '); };
function children(node: Element, items: DOMNode[]) {
  node.children = items as Element['children'];
  items.forEach((child, index) => { child.parent = node; child.prev = items[index - 1] || null; child.next = items[index + 1] || null; });
}
function detach(node: Element) {
  if (node.parent instanceof Element) children(node.parent, node.parent.children.filter(child => child !== node) as DOMNode[]);
}
function wrap(name: string, attrs: Record<string, string>, items: DOMNode[]) {
  const node = new Element(name, attrs, []); children(node, items); return node;
}

function programmeIntro(paragraph: Element, stable: boolean): Element {
  const summary = wrap('summary', {}, [new Text('About this programme')]);
  if (!stable) return wrap('details', {class:'campaign-mobile-detail',open:''}, [summary, paragraph]);
  // CSS selects one native presentation before first paint. The mobile disclosure
  // starts closed without waiting for hydration; desktop keeps the full paragraph.
  const mobileParagraph = paragraph.cloneNode(true) as Element;
  return wrap('div', {class:'campaign-responsive-intro'}, [
    wrap('div', {class:'campaign-desktop-intro'}, [paragraph]),
    wrap('details', {class:'campaign-mobile-detail'}, [summary, mobileParagraph]),
  ]);
}

/** Presentation only: preserve source, programme bodies and form contracts. */
export function campaignPresentation(nodes: DOMNode[], legacy = false, stableIntro = false): DOMNode[] {
  for (const node of elements(nodes, n => n.name === 'a')) {
    const href = node.attribs.href || '';
    if (href === '#consult' || href === '#enquiry') {
      node.attribs.href = '#campaign-consultation';
      if (!node.attribs['aria-label'] && /^(?:enquire(?: now)?|request a consultation|plan my programme|book (?:a )?consultation)$/i.test(textContent(node).replace(/[↗→]/g, '').trim())) children(node, [new Text(FREE_CONSULTATION)]);
    }
    if (/(?:rate|price)[ -]?list|\/(?:pdf|documents)\/.*(?:rate|tariff)|kairali-documents[^\s]*(?:rate|tariff)|(?:INR|USD|EURO?|€|₹).*(?:rate|tariff)|(?:rate|tariff).*(?:INR|USD|EURO?)/i.test(href + ' ' + textContent(node))) node.attribs.hidden = '';
  }
  // Hide the complete presentation unit, never alter the approved price source.
  for (const node of elements(nodes, n => has(n, 'hero-price') || has(n, 'tariff-links') || has(n, 'price-links') || has(n, 'rate-downloads') || has(n, 'programme-price') || has(n, 'programme-rates') || has(n, 'villa-rates') || has(n, 'price-table') || has(n, 'price-strip') || has(n, 'rate-grid'))) node.attribs.hidden = '';
  for (const node of elements(nodes, n => ['p','li','td','th','dd','span','strong','small'].includes(n.name))) {
    if (/(?:₹|\bINR\s*|\bUSD\s*|\bEUR\s*|[€$])\s*[\d,]+/.test(textContent(node))) node.attribs.hidden = '';
  }
  if (!legacy) {
    const hero = elements(nodes, n => has(n, 'form-cover') || has(n, 'tl-hero') || has(n, 'p26-hero'))[0];
    if (hero) {
      add(hero, 'ahv-campaign-hero');
      if (hero.parent instanceof Element) {
        const parent = hero.parent, index = parent.children.indexOf(hero);
        const recognition = htmlToDOM('<div class="campaign-credentials" aria-label="Kairali credentials"><a href="/awards-and-accreditations/">NABH-accredited hospital</a><a href="https://whyayurveda.org/5-times-in-row-certificate-of-excellence-by-trip-advisor/" target="_blank" rel="noopener noreferrer">Tripadvisor Hall of Fame</a></div>') as DOMNode[];
        children(parent, [...parent.children.slice(0,index+1), ...recognition, ...parent.children.slice(index+1)] as DOMNode[]);
      }
      const copy = elements([hero], n => has(n, 'cover-copy') || has(n, 'hero-copy'))[0];
      if (copy) {
        add(copy, 'ahv-hero-copy');
        const longIntro = elements([copy], n => n.name === 'p' && textContent(n).length > 90)[0];
        if (longIntro) {
          const parent = longIntro.parent;
          if (parent instanceof Element) {
            const index = parent.children.indexOf(longIntro);
            const detail = programmeIntro(longIntro, stableIntro);
            const updated = [...parent.children] as DOMNode[]; updated[index] = detail; children(parent, updated);
          }
        }
      }
    }
    return nodes;
  }
  const h1 = elements(nodes, n => n.name === 'h1')[0];
  const form = elements(nodes, n => n.attribs['data-slot'] === 'enquiry-form')[0];
  if (!h1 || !form) return nodes;
  let hero: Element | null = h1.parent instanceof Element ? h1.parent : null;
  while (hero && hero.name !== 'header' && hero.name !== 'section') hero = hero.parent instanceof Element ? hero.parent : null;
  if (!hero) return nodes;
  const photo = elements([hero], n => n.name === 'img' && n.attribs['data-dc-kind'] === 'photo')[0];
  detach(form);
  const oldEnquiry = elements(nodes, n => has(n, 'campaign-enquiry'))[0];
  if (oldEnquiry) {
    oldEnquiry.attribs.id = 'campaign-planning';
    children(oldEnquiry, [...oldEnquiry.children as DOMNode[], wrap('a', { href: '#campaign-consultation', class: 'btn btn-primary' }, [new Text(FREE_CONSULTATION)])]);
  }
  if (photo) { detach(photo); photo.attribs.class = 'ahv-hero-photo'; delete photo.attribs.style; }
  const copy = wrap('div', { class: 'ahv-hero-copy' }, hero.children as DOMNode[]);
  const intro = elements([copy], n => n.name === 'p' && textContent(n).length > 70)[0];
  if (intro?.parent instanceof Element) {
    const parent = intro.parent, index = parent.children.indexOf(intro);
    const detail = wrap('details', {class:'campaign-mobile-detail',open:''}, [wrap('summary', {}, [new Text('About this programme')]), intro]);
    const updated = [...parent.children] as DOMNode[]; updated[index] = detail; children(parent, updated);
  }
  const reviews = elements([copy], n => n.attribs['aria-label'] === 'Review platforms')[0];
  if (reviews && hero.parent instanceof Element) {
    detach(reviews);
    const parent = hero.parent, index = parent.children.indexOf(hero);
    const proof = wrap('div', {class:'campaign-credentials'}, [reviews]);
    children(parent, [...parent.children.slice(0,index+1),proof,...parent.children.slice(index+1)] as DOMNode[]);
  }

  const card = wrap('div', { id: 'campaign-consultation', class: 'ahv-hero-form', tabindex: '-1' }, [wrap('span', {id:'consult','aria-hidden':'true'}, []), form]);
  hero.attribs = { ...hero.attribs, class: 'ahv-campaign-hero', id: 'campaign-introduction' };
  delete hero.attribs.style;
  children(hero, [...(photo ? [photo] : []), copy, card]);
  return nodes;
}
