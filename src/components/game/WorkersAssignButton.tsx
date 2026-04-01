"use client";

import { WorkersAssignForm } from "@/components/game/WorkersAssignForm";
import { useState } from "react";

type Props = {
  cityId: string;
  population: number;
  initial: {
    workersWood: number;
    workersIron: number;
    workersOil: number;
    workersFood: number;
  };
  saveLabel: string;
  showIron: boolean;
  showOil: boolean;
  labels: {
    w: string;
    i: string;
    o: string;
    f: string;
  };
  dialogTitle: string;
  closeLabel: string;
};

export function WorkersAssignButton({
  cityId,
  population,
  initial,
  saveLabel,
  showIron,
  showOil,
  labels,
  dialogTitle,
  closeLabel,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-amber-900/50 bg-amber-950/40 text-amber-100/90 hover:bg-amber-900/50"
        title={dialogTitle}
        aria-label={dialogTitle}
      >
        <span className="text-sm leading-none">✎</span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-[#2a3441] bg-[#0b1220] p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-amber-200/90">
                {dialogTitle}
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded px-2 py-1 text-xs text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                {closeLabel}
              </button>
            </div>
            <WorkersAssignForm
              cityId={cityId}
              population={population}
              initial={initial}
              saveLabel={saveLabel}
              showIron={showIron}
              showOil={showOil}
              labels={labels}
              onSaved={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
