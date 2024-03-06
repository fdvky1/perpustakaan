import { create } from "zustand"

type Theme = {
    theme: "light"|"dark",
    setTheme: (theme: "light"|"dark") => void
}

const useThemeStore = create<Theme>()((set)=>({
    theme: window.localStorage.getItem('theme') as "light"|"dark" ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
    setTheme: (theme: "light"|"dark") => {
        set(() => ({ theme }));
    }
}));

export default useThemeStore;
