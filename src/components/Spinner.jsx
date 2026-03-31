import { memo } from "react";
import { Loader2 } from "lucide-react";

// Tiny loading indicator. Wrapped in memo because it's re-rendered inside
// long lists (deck list, card list) and the props never really change.
function Spinner({ label = "Loading", size = "md" }) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
  return (
    <div role="status" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
      <Loader2 className={`${sizes[size]} animate-spin text-brand-600`} aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default memo(Spinner);
