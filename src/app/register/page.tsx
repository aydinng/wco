import { PublicPageLayout } from "@/components/landing/PublicPageLayout";
import { countryLabelById } from "@/config/countries";
import { prisma } from "@/lib/prisma";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
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
    <PublicPageLayout recent={recent} activeNav="register">
      <div className="flex flex-col items-center lg:items-start">
        <RegisterForm />
        <p className="mt-6 max-w-md text-center text-xs text-zinc-500 lg:text-left">
          Kayıt olduktan sonra giriş sayfasından oyuna girebilirsin.
        </p>
      </div>
    </PublicPageLayout>
  );
}
