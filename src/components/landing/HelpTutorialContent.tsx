import {
  HELP_TUTORIAL_PAGE_LABELS_TR,
  HELP_TUTORIAL_PAGES_TR,
} from "@/content/help-tutorial-tr";
import Link from "next/link";

const WARCITY = { fontFamily: "var(--font-warcity), serif" } as const;

export function HelpTutorialContent({ page }: { page: number }) {
  const p = Math.min(HELP_TUTORIAL_PAGES_TR.length, Math.max(1, page));
  const idx = p - 1;
  const body = HELP_TUTORIAL_PAGES_TR[idx] ?? "";
  const next = p < HELP_TUTORIAL_PAGES_TR.length ? p + 1 : null;

  return (
    <div
      className="max-w-3xl rounded-lg border border-yellow-900/45 bg-black/88 px-4 py-5 backdrop-blur-md sm:px-5"
      style={WARCITY}
    >
      <div className="space-y-4 text-[14px] font-semibold leading-relaxed text-[#FFFF00] sm:text-[15px]">
        <nav className="flex flex-col gap-1.5 border-b border-yellow-700/40 pb-4">
          {HELP_TUTORIAL_PAGE_LABELS_TR.map((label, i) => {
            const n = i + 1;
            const active = n === p;
            return (
              <Link
                key={label}
                href={`/egitim?p=${n}`}
                scroll={false}
                className={
                  active
                    ? "rounded bg-[#5c4a00]/80 px-2 py-1.5 text-left text-xs font-bold text-[#FFFF00] drop-shadow sm:text-sm"
                    : "rounded px-2 py-1.5 text-left text-xs font-bold text-[#b8860b] transition-colors hover:bg-yellow-900/30 hover:text-[#FFFF00] sm:text-sm"
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="min-h-[12rem] whitespace-pre-line text-[#FFFF00]/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          {body.trim()}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          {next ? (
            <Link
              href={`/egitim?p=${next}`}
              scroll={false}
              className="inline-flex rounded border border-amber-900/60 bg-gradient-to-b from-amber-700/95 to-amber-900/95 px-4 py-2 text-sm font-bold text-amber-50 shadow-sm hover:from-amber-600 hover:to-amber-800"
            >
              İleri →
            </Link>
          ) : (
            <span className="text-sm text-zinc-500">Son sayfa</span>
          )}
        </div>
      </div>
    </div>
  );
}
