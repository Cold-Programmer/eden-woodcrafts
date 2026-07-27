"use client";
import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext(null);
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx)
        throw new Error("useTheme must be used within <ThemeProvider>");
    return ctx;
}
function applyTheme(theme) {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;
    document.documentElement.classList.toggle("dark", resolved === "dark");
    return resolved;
}
export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState("system");
    const [resolvedTheme, setResolvedTheme] = useState("light");
    useEffect(() => {
        const stored = localStorage.getItem("theme") || "system";
        setThemeState(stored);
        setResolvedTheme(applyTheme(stored));
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => {
            const current = localStorage.getItem("theme") || "system";
            if (current === "system")
                setResolvedTheme(applyTheme("system"));
        };
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);
    function setTheme(t) {
        localStorage.setItem("theme", t);
        setThemeState(t);
        setResolvedTheme(applyTheme(t));
    }
    return (<ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>);
}
// Inline script injected into <head> so the correct theme class is applied
// before first paint — avoids a flash of the wrong theme on load.
export const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme') || 'system';
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var resolved = stored === 'system' ? (systemDark ? 'dark' : 'light') : stored;
    if (resolved === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;
