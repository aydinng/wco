import { LoginScreenLayout } from "@/components/landing/LoginScreenLayout";
import { RegisterForm } from "@/app/register/RegisterForm";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";

export default async function RegisterPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const serverNow = new Date();

  return (
    <LoginScreenLayout dict={dict} serverNow={serverNow} activeNav="register">
      <div className="flex flex-col items-stretch lg:items-start">
        <RegisterForm dict={dict} locale={locale} />
      </div>
    </LoginScreenLayout>
  );
}
