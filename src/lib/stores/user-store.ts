import { AuthModel } from "pocketbase";
import { create } from "zustand";
import pb from "../pocketbase";
import router from "next/router";

type UserStore = {
  user: AuthModel;
  signOut: () => void;
  setUser: (user: AuthModel) => void;
};

export const useAuthStore = create<UserStore>((set) => ({
  user: null,
  signOut: () => {
    pb.authStore.clear();
    router.push("/signin");
    set(() => ({
      user: null,
    }));
  },
  setUser: (user: AuthModel) => set(() => ({ user: user })),
}));
