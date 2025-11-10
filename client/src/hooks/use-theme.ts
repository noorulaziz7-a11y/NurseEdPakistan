import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("theme") as Theme) || "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const apply = (t: Theme) => {
      if (t === "system") {
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", prefersDark);
      } else {
        root.classList.toggle("dark", t === "dark");
      }
    };
    apply(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    // If user uses system theme and system changes
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const t = (localStorage.getItem("theme") as Theme) || "system";
      if (t === "system") {
        document.documentElement.classList.toggle("dark", mql.matches);
      }
    };
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  return { theme, setTheme };
}
