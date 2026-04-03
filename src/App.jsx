import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext.jsx";
import { ThemeProvider } from "@/context/ThemeContext.jsx";
import { ToastProvider } from "@/context/ToastContext.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import Spinner from "@/components/Spinner.jsx";
import ProtectedRoute, { PublicOnlyRoute } from "@/components/ProtectedRoute.jsx";
import AppLayout from "@/layouts/AppLayout.jsx";

import Landing from "@/pages/Landing.jsx";
import Login from "@/pages/Login.jsx";
import Signup from "@/pages/Signup.jsx";
import AppHome from "@/pages/AppHome.jsx";
import Decks from "@/pages/Decks.jsx";
import DeckDetail from "@/pages/DeckDetail.jsx";
import NotFound from "@/pages/NotFound.jsx";

// Lazy-load the heavy routes so the landing/login bundle stays small.
// Study pulls in framer-motion, Stats pulls in all of Recharts — those two
// alone were ~180KB gzipped before splitting. Landing and Login are the
// critical path for first-time visitors so we keep them in the main bundle.
const Study = lazy(() => import("@/pages/Study.jsx"));
const StudySession = lazy(() => import("@/pages/StudySession.jsx"));
const Stats = lazy(() => import("@/pages/Stats.jsx"));
const Settings = lazy(() => import("@/pages/Settings.jsx"));

function LazyFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Spinner />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route
                  path="/login"
                  element={<PublicOnlyRoute><Login /></PublicOnlyRoute>}
                />
                <Route
                  path="/signup"
                  element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>}
                />

                {/* Authenticated app shell */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/app" element={<AppHome />} />
                  <Route path="/decks" element={<Decks />} />
                  <Route path="/decks/:id" element={<DeckDetail />} />
                  <Route
                    path="/study"
                    element={
                      <Suspense fallback={<LazyFallback />}>
                        <Study />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/study/:deckId"
                    element={
                      <Suspense fallback={<LazyFallback />}>
                        <StudySession />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/stats"
                    element={
                      <Suspense fallback={<LazyFallback />}>
                        <Stats />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <Suspense fallback={<LazyFallback />}>
                        <Settings />
                      </Suspense>
                    }
                  />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
