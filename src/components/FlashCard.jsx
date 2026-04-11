import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";

function FlashCard({ card, flipped, onFlip }) {
  return (
    <div className="relative mx-auto h-[340px] w-full max-w-2xl">
      <button
        type="button"
        onClick={onFlip}
        className="group relative block h-full w-full"
        aria-label={flipped ? "Show question" : "Reveal answer"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={flipped ? "back" : "front"}
            initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 shadow-elevated dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              {flipped ? "Answer" : "Question"}
            </p>
            <p className="mt-5 max-h-[240px] overflow-auto text-center font-display text-2xl font-bold leading-snug text-slate-900 dark:text-white sm:text-3xl">
              {flipped ? card.answer : card.question}
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 group-hover:text-brand-600">
              <RefreshCw className="h-3 w-3" aria-hidden="true" />
              Tap or press space to {flipped ? "see question" : "reveal"}
            </span>
          </motion.div>
        </AnimatePresence>
      </button>
    </div>
  );
}

export default memo(FlashCard);
