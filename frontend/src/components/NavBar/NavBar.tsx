import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { IoClose } from "react-icons/io5";
import ResponsiveMenu from "./ResponsiveMenu";
import { NavLinks } from "../../constants/NavLinks";
import { AUTH_CHANGE_EVENT } from "../../services/authUser";
import logo from "../../assets/logo.png";

type NavUser = {
  username: string;
  email: string;
  avatar?: string | null;
  is_staff?: boolean;
};

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<NavUser | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Load user from localStorage and listen for auth changes
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

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => setMenuOpen(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect scroll for navbar styling
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin = Boolean((currentUser as any)?.is_staff);
  const isAdminView = isAdmin && location.pathname.startsWith("/admin");

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 shadow-lg border-b border-black/5 backdrop-blur-lg"
          : "bg-[var(--color-secondary-light)]/70 backdrop-blur-lg"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            className="flex items-center gap-3 group focus:outline-none"
            onClick={() => navigate("/")}
          >
            <span className="relative flex items-center justify-center">
              <img src={logo} alt="Hotel logo" className="h-10 w-auto drop-shadow-sm" />
              <span className="absolute inset-0 rounded-lg scale-110 bg-black/5 blur-xl opacity-0 group-hover:opacity-100 transition" />
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 font-medium text-[var(--color-secondary)]">
            {!isAdminView &&
              NavLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className="relative px-1 py-1 transition text-sm tracking-wide hover:text-[var(--color-primary)] group"
                  >
                    <span className="relative">
                      {link.name}
                      <span
                        className={`absolute left-0 -bottom-0.5 h-[2px] rounded-full transition-all duration-300 ${
                          isActive ? "w-full bg-[var(--color-primary)]" : "w-0 bg-[var(--color-primary)] group-hover:w-full"
                        }`}
                      />
                    </span>
                  </button>
                );
              })}

            {/* Auth actions */}
            {currentUser ? (
              <div className="flex items-center space-x-3 ml-4">
                {!isAdminView && isAdmin && (
                  <button
                    onClick={() => navigate("/admin")}
                    className={`relative px-2 py-1 text-sm tracking-wide transition ${
                      location.pathname.startsWith("/admin") ? "text-[var(--color-primary)]" : "text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    Admin
                  </button>
                )}
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] text-sm hover:bg-[var(--color-primary)] hover:text-white transition shadow-sm"
                >
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" className="h-7 w-7 rounded-full object-cover border border-white/40" />
                  ) : (
                    <span className="h-7 w-7 rounded-full bg-[var(--color-secondary-light)] text-[var(--color-secondary)] flex items-center justify-center text-xs font-semibold">
                      {currentUser.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                  <span className="hidden sm:inline">Profile</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <button
                  onClick={() => navigate("/login")}
                  className="px-3 py-1 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] text-sm hover:bg-[var(--color-primary)] hover:text-white transition shadow-sm"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-black to-gray-800 text-white text-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[var(--color-secondary)] focus:outline-none transition-transform duration-200 hover:scale-110"
            >
              {menuOpen ? <IoClose size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div ref={menuRef}>
        <ResponsiveMenu showMenu={menuOpen} setShowMenu={setMenuOpen} isAdminView={isAdminView} />
      </div>
    </nav>
  );
}

export default NavBar;
