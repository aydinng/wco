import type { Dictionary } from "@/i18n/dictionaries";
import Link from "next/link";

const SANS =
  'ui-sans-serif, system-ui, "Segoe UI", Tahoma, Arial, Helvetica, sans-serif';

export function LoginLandingContent({ dict }: { dict: Dictionary }) {
  const p = dict.public;
  const items = p.loginBulletsFive;

  return (
    <div className="space-y-5 text-[15px] leading-relaxed text-[#FFFF00] sm:text-base">
      <p style={{ fontFamily: SANS }}>
        {p.loginIntroBefore}
        <Link
          href="/register"
          className="text-[#FFFF00] underline decoration-yellow-600 underline-offset-2 hover:text-yellow-200"
        >
          {p.loginIntroRegisterWord}
        </Link>
        {p.loginIntroAfter}
      </p>

      <ol
        className="list-decimal space-y-3 pl-6 marker:text-[#FFFF00]"
        style={{ fontFamily: SANS }}
      >
        <li className="pl-1">{items[0]}</li>
        <li className="pl-1">{items[1]}</li>
        <li className="pl-1">{items[2]}</li>
        <li className="pl-1">
          {p.loginBullet4Before}
          <Link
            href="/forum"
            className="text-[#FFFF00] underline decoration-yellow-600 underline-offset-2 hover:text-yellow-200"
          >
            {p.loginBullet4LinkWord}
          </Link>
          {p.loginBullet4After}
        </li>
        <li className="pl-1">{items[4]}</li>
      </ol>
    </div>
  );
}
