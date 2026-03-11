import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  hydrated: false,

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  logout: () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  set({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  window.location.href = "/";
},
  hydrate: () => {
    // Prevent double hydration
    if (get().hydrated) return;

    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true, isLoading: false, hydrated: true });
      } else {
        set({ isLoading: false, hydrated: true });
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ isLoading: false, hydrated: true });
    }
  },
}));