import { create } from "zustand"

type Toast = {
    text: string
    type: string
    setMessage: (message: string, type: 'info' | 'warning' | 'error' | 'success', timeout?: number) => void
}

const useToastStore = create<Toast>()((set)=>({
    text: "",
    type: "",
    setMessage: (message, type, timeout = 3000) => {
        set(() => ({ text: message, type }));
        setTimeout(() => {
            set(() => ({ text: "", type: "" }));
        }, timeout);
    }
}));

export default useToastStore;
