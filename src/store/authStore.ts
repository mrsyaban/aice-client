import { create } from "zustand";

interface User {
  googleId: string;
  displayName: string;
  email: string;
  // riskProfile: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    window.location.href = import.meta.env.VITE_API_URL + "/auth/logout";
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
