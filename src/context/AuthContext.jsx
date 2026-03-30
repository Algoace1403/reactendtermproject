import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { observeAuth } from "@/services/auth.js";

// Global auth context. Any component that needs the current user reads from
// here via useAuth(). The `loading` flag matters because on first render we
// don't yet know if the user is signed in — ProtectedRoute needs this so it
// doesn't flash the login page for a split second on refresh.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // observeAuth wraps Firebase's onAuthStateChanged. It fires once on mount
    // with the current user (or null) and again any time auth state changes.
    const unsub = observeAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Memoise the value object so that consumers using Object.is comparisons
  // (like some memoised children) don't re-render on unrelated parent renders.
  const value = useMemo(() => ({ user, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // This almost always means someone forgot to wrap <AuthProvider> around
    // the app. Left the explicit message so future-me doesn't debug for 20 min.
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
