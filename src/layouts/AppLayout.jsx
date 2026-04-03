import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  Layers,
  BookOpen,
  BarChart3,
  Settings,
  Sun,
  Moon,
  LogOut,
  Flame,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { useTheme } from "@/context/ThemeContext.jsx";
import { useToast } from "@/context/ToastContext.jsx";
import { useUserProfile } from "@/hooks/useUserProfile.js";
import { signOut } from "@/services/auth.js";

const NAV = [
  { to: "/app",      label: "Home",     icon: Home,     end: true },
  { to: "/decks",    label: "Decks",    icon: Layers },
  { to: "/study",    label: "Study",    icon: BookOpen },
  { to: "/stats",    label: "Stats",    icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function AppLayout() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { profile } = useUserProfile();
  const toast = useToast();
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut();
      toast.success("Signed out.");
      navigate("/", { replace: true });
    } catch {
      toast.error("Could not sign out. Try again.");
    }
  }

  const streak = profile?.streak ?? 0;
  const name = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "You";
  const initial = (name || "S")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-900 md:flex md:flex-col">
        <NavLink to="/app" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 font-display text-sm font-bold text-white">
            SL
          </span>
          <span className="font-display text-lg font-bold text-slate-900 dark:text-white">
            StudyLoop
          </span>
        </NavLink>

        <nav className="flex-1 space-y-1">
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{name}</p>
              <p className="flex items-center gap-1 text-xs text-streak-600 dark:text-streak-500">
                <Flame className="h-3 w-3" aria-hidden="true" />
                {streak}-day streak
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="btn-secondary flex-1 !px-3 !py-2 text-xs"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button
              onClick={handleSignOut}
              className="btn-secondary !px-3 !py-2 text-xs"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <NavLink to="/app" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 font-display text-xs font-bold text-white">
              SL
            </span>
            <span className="font-display text-base font-bold text-slate-900 dark:text-white">StudyLoop</span>
          </NavLink>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-streak-100 px-2.5 py-1 text-xs font-semibold text-streak-600 dark:bg-streak-500/15">
              <Flame className="h-3 w-3" aria-hidden="true" />
              {streak}
            </span>
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="min-h-[calc(100vh-56px)] pb-24 md:min-h-screen md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between">
          {NAV.map((item) => (
            <BottomNavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          isActive
            ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        }`
      }
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {label}
    </NavLink>
  );
}

function BottomNavItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[11px] font-medium ${
          isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-500 dark:text-slate-400"
        }`
      }
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {label}
    </NavLink>
  );
}
