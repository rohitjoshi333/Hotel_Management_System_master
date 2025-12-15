import { NavLinks } from "../../constants/NavLinks";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AUTH_CHANGE_EVENT } from "../../services/authUser";

type NavUser = {
  username: string;
  email: string;
  avatar?: string | null;
  is_staff?: boolean;
};

type ResponsiveMenuProps = {
  showMenu: boolean;
  setShowMenu: (val: boolean) => void;
  isAdminView?: boolean;
};

const ResponsiveMenu = ({ showMenu, setShowMenu, isAdminView = false }: ResponsiveMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<NavUser | null>(null);
  const isAdmin = Boolean((currentUser as any)?.is_staff);

  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem("user");
        setCurrentUser(stored ? JSON.parse(stored) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    loadUser();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "user" || event.key === "token" || event.key === null) {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_CHANGE_EVENT, loadUser);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AUTH_CHANGE_EVENT, loadUser);
    };
  }, []);

  return (
    <div
      className={`fixed top-16 left-0 w-full z-50 bg-white/90 backdrop-blur-lg overflow-hidden transform transition-transform duration-300 md:hidden shadow-lg border-b border-[var(--color-border)]
    ${showMenu ? "scale-y-100" : "scale-y-0"}`}
      style={{ transformOrigin: "top", zIndex: 100 }}
    >
      <div className="flex flex-col p-6 space-y-6 text-[var(--color-secondary)] font-medium">
        {!isAdminView &&
          NavLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setShowMenu(false);
                }}
                className={`transition text-left py-1 ${isActive ? "text-[var(--color-primary)]" : "hover:text-[var(--color-primary)]"}`}
              >
                <span className="flex items-center justify-between">
                  {link.name}
                  {isActive && <span className="h-1 w-10 rounded-full bg-[var(--color-primary)]" />}
                </span>
              </button>
            );
          })}

        {isAdmin && !isAdminView && (
          <button
            onClick={() => {
              navigate("/admin");
              setShowMenu(false);
            }}
            className={`transition text-left py-1 ${location.pathname.startsWith("/admin") ? "text-[var(--color-primary)]" : "hover:text-[var(--color-primary)]"}`}
          >
            <span className="flex items-center justify-between">
              Admin
              {location.pathname.startsWith("/admin") && <span className="h-1 w-10 rounded-full bg-[var(--color-primary)]" />}
            </span>
          </button>
        )}

        {/* Auth actions */}
        {currentUser ? (
          <div className="pt-4 border-t border-[var(--color-border)] flex flex-col space-y-3">
            <button
              onClick={() => {
                navigate("/profile");
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] text-sm hover:bg-[var(--color-primary)] hover:text-white transition flex items-center gap-2"
            >
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="Avatar" className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <span className="h-7 w-7 rounded-full bg-[var(--color-secondary-light)] text-[var(--color-secondary)] flex items-center justify-center text-xs font-semibold">
                  {currentUser.username?.[0]?.toUpperCase() || "U"}
                </span>
              )}
              Profile
            </button>
          </div>
        ) : (
          <div className="pt-4 border-t border-[var(--color-border)] flex flex-col space-y-3">
            <button
              onClick={() => {
                navigate("/login");
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] text-sm hover:bg-[var(--color-primary)] hover:text-white transition"
            >
              Log in
            </button>
            <button
              onClick={() => {
                navigate("/signup");
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm hover:bg-[var(--color-primary-dark)] transition"
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </div>

  );
};

export default ResponsiveMenu;
