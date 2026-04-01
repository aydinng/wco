import { LoginWarHero } from "@/components/landing/LoginWarHero";
import { PublicPageLayout } from "@/components/landing/PublicPageLayout";
import { countryLabelById } from "@/config/countries";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { GameFeatures } from "./GameFeatures";
import { HowToPlay } from "./HowToPlay";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const raw = await prisma.user.findMany({
    where: { passwordHash: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 25,
    select: {
      username: true,
      registrationCountry: true,
      createdAt: true,
    },
  });

  const recent = raw.map((u) => ({
    username: u.username,
    registrationCountry:
      u.registrationCountry && u.registrationCountry.length > 0
        ? countryLabelById(u.registrationCountry)
        : "—",
    createdAt: u.createdAt,
  }));

  return (
    <PublicPageLayout recent={recent} activeNav="login">
      <div className="flex flex-col items-center lg:items-start">
        <Suspense
          fallback={
            <div className="h-40 w-full max-w-md animate-pulse rounded border border-[#2a3441]/50 bg-black/20" />
          }
        >
          <LoginForm />
        </Suspense>
        <GameFeatures />
        <HowToPlay />
        <LoginWarHero />
      </div>
    </PublicPageLayout>
  );
}
