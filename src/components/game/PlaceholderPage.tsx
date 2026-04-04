import type { ReactNode } from "react";

type Props = { title: string; children?: ReactNode };

export function PlaceholderPage({ title, children }: Props) {
  return (
    <div className="rounded border border-[#2a3441]/90 bg-black/35 p-4 backdrop-blur-sm">
      <h2
        className="mb-4 text-lg text-amber-200/90"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
