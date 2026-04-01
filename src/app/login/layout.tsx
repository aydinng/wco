import { Suspense } from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0e14] text-zinc-500">
          Yükleniyor…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
