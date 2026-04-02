import { memo } from "react";

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      {icon && (
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
          {icon}
        </div>
      )}
      <h3 className="mt-4 font-display text-xl font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-300">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// Memoised — props are usually string literals from the parent,
// so shallow comparison saves a re-render on every keystroke in a sibling.
export default memo(EmptyState);
