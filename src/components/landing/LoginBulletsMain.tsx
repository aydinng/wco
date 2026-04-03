import type { Dictionary } from "@/i18n/dictionaries";

export function LoginBulletsMain({ dict }: { dict: Dictionary }) {
  const items = dict.public.loginBulletsFive;
  return (
    <ol className="list-decimal space-y-3 pl-6 marker:text-yellow-500">
      {items.map((text) => (
        <li key={text} className="pl-1">
          {text}
        </li>
      ))}
    </ol>
  );
}
