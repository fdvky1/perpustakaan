import { create } from "zustand"

type Theme = {
    theme: null | "light" | "dark",
    setTheme: (theme: "light"|"dark") => void
}

const useThemeStore = create<Theme>()((set)=>({
    theme: null,
    setTheme: (theme: "light"|"dark") => {
        set(() => ({ theme }));
    }
}));

export default useThemeStore;
