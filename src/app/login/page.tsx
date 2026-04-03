import { LoginBulletsMain } from "@/components/landing/LoginBulletsMain";
import { LoginScreenLayout } from "@/components/landing/LoginScreenLayout";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";

export default async function LoginPage() {
  const dict = getDictionary(await getLocale());

  return (
    <LoginScreenLayout dict={dict}>
      <LoginBulletsMain dict={dict} />
    </LoginScreenLayout>
  );
}
