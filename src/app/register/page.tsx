import { PublicPageLayout } from "@/components/landing/PublicPageLayout";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  return (
    <PublicPageLayout activeNav="register">
      <div className="flex flex-col items-center lg:items-start">
        <RegisterForm />
        <p className="mt-6 max-w-md text-center text-sm text-zinc-500 lg:text-left">
          Kayıt olduktan sonra giriş sayfasından oyuna girebilirsin.
        </p>
      </div>
    </PublicPageLayout>
  );
}
