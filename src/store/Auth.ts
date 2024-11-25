import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { account } from "@/models/client";
import { Models, ID, AppwriteException } from "appwrite";
import { IUserPrefs } from "@/types/user";

interface IState {
  session: Models.Session | null;
  user: Models.User<IUserPrefs> | null;
  jwt: string | null;
  hydrated: boolean;
}

interface IAction {
  setHydrated: () => void;
  verifySession: () => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
  createAccount: (
    name: string,
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<IState & IAction>()(
  persist(
    immer((set) => ({
      session: null,
      user: null,
      jwt: null,
      hydrated: false,

      setHydrated() {
        set({ hydrated: true });
      },

      async verifySession() {
        try {
          const currentSession = await account.getSession("current");
          set({ session: currentSession });
        } catch (error) {
          console.log(error);
        }
      },

      async login(email, password) {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          const [user, { jwt }] = await Promise.all([
            account.get<IUserPrefs>(),
            account.createJWT(),
          ]);
          set({ session, user, jwt });
          return { success: true, user };
        } catch (error) {
          return Promise.reject(error as AppwriteException);
        }
      },

      async createAccount(name, email, password) {
        try {
          const session = await account.create(
            ID.unique(),
            email,
            password,
            name
          );
          return { success: true };
        } catch (error) {
          return Promise.reject({
            success: false,
            error: error as AppwriteException,
          });
        }
      },

      async logout() {
        try {
          account.deleteSessions();
          set({ session: null, user: null, jwt: null });
        } catch (error) {
          console.log(error);
        }
      },
    })),
    {
      name: "auth-store", // unique name
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
