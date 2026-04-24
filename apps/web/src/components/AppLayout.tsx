import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/start", label: "Start" },
  { to: "/", label: "Wochenplan" },
  { to: "/recipes", label: "Rezepte" },
  { to: "/shopping", label: "Einkauf" },
] as const;

type Props = {
  children: ReactNode;
};

export function AppLayout({ children }: Props) {
  const { user, isGuest, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div className="appShell">
      <div className="container pageWithBottomNav">
        <header className="stickyTopNav plannerHeader">
          <div className="plannerHeaderInner">
            <div>
              <div className="brandKicker">Wochenplanung</div>
              <div className="brandText">Meal Planner</div>
            </div>

            {/* Desktop nav */}
            <nav className="plannerNav desktopOnly" aria-label="Hauptnavigation">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/" || item.to === "/start"}
                  className={({ isActive }) => `plannerNavLink ${isActive ? "plannerNavLinkActive" : ""}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="headerRight">
              {/* Hamburger (mobile only) */}
              <div className="hamburgerWrap mobileOnly" ref={menuRef}>
                <button
                  className="hamburgerBtn"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Navigation öffnen"
                >
                  {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                {menuOpen && (
                  <nav className="hamburgerMenu" aria-label="Mobile Navigation">
                    {NAV_ITEMS.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/" || item.to === "/start"}
                        className={({ isActive }) => `hamburgerItem ${isActive ? "hamburgerItemActive" : ""}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </nav>
                )}
              </div>

              {/* User chip */}
              {(user || isGuest) && (
                <div className="userChip">
                  {isGuest ? (
                    <div className="userAvatarFallback">G</div>
                  ) : user?.photoURL ? (
                    <img
                      className="userAvatar"
                      src={user.photoURL}
                      alt={user.displayName ?? "Nutzer"}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="userAvatarFallback">
                      {(user?.displayName ?? user?.email ?? "U")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="userDisplayName desktopOnly">
                    {isGuest ? "Gast" : (user?.displayName?.split(" ")[0] ?? "Nutzer")}
                  </span>
                  <button
                    className="userSignOut"
                    onClick={signOut}
                    aria-label="Abmelden"
                    title="Abmelden"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
