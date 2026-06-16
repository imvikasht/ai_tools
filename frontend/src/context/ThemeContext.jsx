import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const storageKey = "ai-multi-tool-theme";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem(storageKey) || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(storageKey, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
