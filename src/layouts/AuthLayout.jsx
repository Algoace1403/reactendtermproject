import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="mx-auto max-w-6xl px-6 py-5">
        <Link to="/" className="inline-flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 font-display text-sm font-bold text-white">
            SL
          </span>
          <span className="font-display text-lg font-bold text-slate-900 dark:text-white">
            StudyLoop
          </span>
        </Link>
      </header>

      <section className="mx-auto max-w-md px-6 pb-16">
        <div className="card p-8">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {subtitle}
            </p>
          )}
          <div className="mt-6">{children}</div>
        </div>
        {footer && (
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
            {footer}
          </p>
        )}
      </section>
    </main>
  );
}
