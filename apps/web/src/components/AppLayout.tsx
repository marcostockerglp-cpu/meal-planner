import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
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
  const { user, signOut } = useAuth();

  return (
    <div className="appShell">
      <div className="container pageWithBottomNav">
        <header className="stickyTopNav plannerHeader">
          <div className="plannerHeaderInner">
            <div>
              <div className="brandKicker">Wochenplanung</div>
              <div className="brandText">Meal Planner</div>
            </div>
            <nav className="plannerNav" aria-label="Hauptnavigation">
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
            {user && (
              <div className="userChip">
                {user.photoURL ? (
                  <img
                    className="userAvatar"
                    src={user.photoURL}
                    alt={user.displayName ?? "Nutzer"}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="userAvatarFallback">
                    {(user.displayName ?? user.email ?? "U")[0].toUpperCase()}
                  </div>
                )}
                <span className="userDisplayName desktopOnly">
                  {user.displayName?.split(" ")[0] ?? "Nutzer"}
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
        </header>

        {children}

        <nav className="bottomTabBar mobileOnly" aria-label="Mobile Navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/" || item.to === "/start"}
              className={({ isActive }) => `bottomTab ${isActive ? "bottomTabActive" : ""}`}
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
