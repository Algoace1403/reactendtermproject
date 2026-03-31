import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import Spinner from "@/components/Spinner.jsx";

// Wraps any route that requires a signed-in user.
// If auth is still loading we show a spinner (otherwise the user sees the
// login page for a split second on refresh, which feels super broken).
// If we know for sure there's no user -> redirect to /login, but stash the
// attempted URL in location state so we can send them back after sign-in.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner label="Loading…" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

// Opposite of ProtectedRoute — for /login and /signup. A signed-in user who
// hits these pages gets kicked to /app instead of seeing a weird login form.
export function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner label="Loading…" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return children;
}
