/** Giriş kabuğu sol menü — hangi bölümde olduğumuz */
export type LandingShellNavId =
  | "login"
  | "register"
  | "about"
  | "tutorial"
  | "forum"
  | "manual"
  | "home";

export function isLoginOrHomeActive(id: LandingShellNavId) {
  return id === "login" || id === "home";
}
