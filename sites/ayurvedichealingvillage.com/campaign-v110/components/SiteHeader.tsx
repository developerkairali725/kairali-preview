import Image from "next/image";
import logo from "../../public/campaign-v110/images/kairali-colorful-logo.webp";
import { ENQUIRY_HREF, contact, site } from "../lib/site";
import styles from "./SiteHeader.module.css";

// CTA placement 1: sticky header — phone number as quiet text + one Enquire
// button. Carries the staging hero's brand logo (lp-brand-link).
export default function SiteHeader({ enquireLabel = "Enquire" }: { enquireLabel?: string }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="/">
          <Image src={logo} alt={site.name} width={180} height={42} priority />
        </a>
        <div className={styles.actions}>
          <a className={styles.phone} href={contact.phone.href}>
            {contact.phone.display}
          </a>
          <a className={`btn btn-primary ${styles.enquire}`} href={ENQUIRY_HREF}>
            {enquireLabel}
          </a>
        </div>
      </div>
    </header>
  );
}
