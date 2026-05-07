import { useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/blog", label: "Blog", end: false },
  { to: "/app/start", label: "App starten", end: false, cta: true },
];

export function WebsiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="siteShell">
      <header className="siteHeader">
        <div className="siteHeaderInner">
          <Link to="/" className="siteLogo">
            <span className="siteLogoIcon">🥗</span>
            <span className="siteLogoText">Smart Meal Planner</span>
          </Link>

          {/* Desktop nav */}
          <nav className="siteNav desktopOnly">
            {NAV_LINKS.map((l) =>
              l.cta ? (
                <Link key={l.to} to={l.to} className="siteNavCta">
                  {l.label}
                </Link>
              ) : (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) => `siteNavLink ${isActive ? "siteNavLinkActive" : ""}`}
                >
                  {l.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="siteHamburger mobileOnly"
            onClick={() => setOpen((v) => !v)}
            aria-label="Navigation öffnen"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <nav className="siteMobileMenu">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `siteMobileItem ${isActive ? "siteMobileItemActive" : ""} ${l.cta ? "siteMobileItemCta" : ""}`
                }
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="siteMain">{children}</main>

      <footer className="siteFooter">
        <div className="siteFooterInner">
          <div className="siteFooterBrand">
            <span className="siteLogoIcon">🥗</span>
            <span className="siteLogoText">Smart Meal Planner</span>
          </div>
          <div className="siteFooterLinks">
            <Link to="/" className="siteFooterLink">Home</Link>
            <Link to="/blog" className="siteFooterLink">Blog</Link>
            <Link to="/app/start" className="siteFooterLink">App</Link>
          </div>
          <p className="siteFooterCopy">© {new Date().getFullYear()} Smart Meal Planner – Besser planen, besser essen.</p>
        </div>
      </footer>
    </div>
  );
}
