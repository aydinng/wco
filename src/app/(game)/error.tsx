"use client";

import { useEffect } from "react";

export default function GameError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded border border-red-900/50 bg-red-950/30 p-6 text-zinc-200">
      <h2 className="mb-2 text-lg font-semibold text-red-200">
        Bir şeyler ters gitti
      </h2>
      <p className="mb-4 text-sm text-zinc-400">
        Oyun sayfası yüklenirken hata oluştu. Veritabanı şeması güncel değilse
        terminalde{" "}
        <code className="rounded bg-black/40 px-1 py-0.5 text-amber-200">
          npx prisma db push
        </code>{" "}
        çalıştırın; ardından sayfayı yenileyin.
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="mb-4 max-h-40 overflow-auto rounded bg-black/50 p-2 text-xs text-red-300">
          {error.message}
        </pre>
      )}
      <button
        type="button"
        onClick={() => reset()}
        className="rounded bg-amber-900/60 px-4 py-2 text-sm text-amber-50 hover:bg-amber-800"
      >
        Tekrar dene
      </button>
    </div>
  );
}
