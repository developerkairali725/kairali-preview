"use client";

export default function CookiePreferences() {
  return (
    <button
      type="button"
      className="cookie-reopen-btn"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("kairali:reopen-consent"));
        }
      }}
      style={{ background: "none", border: "none", padding: 0, font: "inherit", color: "inherit", cursor: "pointer" }}
    >
      Cookie preferences
    </button>
  );
}
