"use client";

import { RESOURCE_ICON_BASE } from "@/config/resource-icons";
import { useCallback, useState } from "react";

type Kind = "wood" | "iron" | "oil" | "food";

type Props = {
  kind: Kind;
  className?: string;
};

/** 0=png 1=svg dosya 2=yerleşik SVG */
type Step = 0 | 1 | 2;

export function ResourceIcon({ kind, className }: Props) {
  const common = "inline-block align-[-2px] " + (className ?? "h-3.5 w-3.5");
  const [step, setStep] = useState<Step>(0);

  const onError = useCallback(() => {
    setStep((s) => (s < 2 ? ((s + 1) as Step) : 2));
  }, []);

  if (step === 0) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`${RESOURCE_ICON_BASE}/${kind}.png`}
        alt=""
        className={common + " object-contain"}
        onError={onError}
      />
    );
  }
  if (step === 1) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`${RESOURCE_ICON_BASE}/${kind}.svg`}
        alt=""
        className={common + " object-contain"}
        onError={onError}
      />
    );
  }

  switch (kind) {
    case "wood":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path
            d="M6 20c3-8 3-8 6-16 3 8 3 8 6 16"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 15h8"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>
      );
    case "iron":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path
            d="M7 4h10l4 8-9 8-9-8z"
            fill="rgba(148,163,184,0.20)"
            stroke="#67e8f9"
            strokeWidth="1.5"
          />
          <path
            d="M7 4l5 8 5-8"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.5"
            opacity="0.9"
          />
        </svg>
      );
    case "oil":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path
            d="M12 3c4 6 7 9 7 13a7 7 0 1 1-14 0c0-4 3-7 7-13z"
            fill="rgba(14,165,233,0.15)"
            stroke="#22c55e"
            strokeWidth="1.5"
          />
          <path
            d="M9 17c2 1 4 1 6 0"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.5"
            opacity="0.9"
            strokeLinecap="round"
          />
        </svg>
      );
    case "food":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path
            d="M12 4c4 3 6 6 6 10a6 6 0 1 1-12 0c0-4 2-7 6-10z"
            fill="rgba(245,158,11,0.18)"
            stroke="#67e8f9"
            strokeWidth="1.5"
          />
          <path
            d="M12 6v12"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            opacity="0.9"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
