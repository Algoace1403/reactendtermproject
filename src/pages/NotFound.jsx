import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <p className="font-display text-6xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn-primary mt-6">
          Back home
        </Link>
      </div>
    </main>
  );
}
