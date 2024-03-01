import { create } from "zustand"

type Toast = {
    theme: "light"|"dark",
    setTheme: (theme: "light"|"dark") => void
}

const useThemeStore = create<Toast>()((set)=>({
    theme: "light",
    setTheme: (theme: "light"|"dark") => {
        set(() => ({ theme }));
    }
}));

export default useThemeStore;
