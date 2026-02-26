import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "node-appwrite";
import { account } from "@/models/client/config";

export interface UserPrefs {
  reputation: number;
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;

  setHydrated(): void;
  verifySession(): Promise<void>;

  login(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;

  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;

  logout(): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set((state) => {
          state.hydrated = true;
        });
      },

      async verifySession() {
        try {
          const session = await account.getSession("current");
          const user = await account.get<UserPrefs>();

          set((state) => {
            state.session = session;
            state.user = user;
          });
        } catch (error) {
          console.log("No active session");
        }
      },

      async login(email, password) {
        try {
          const session =
            await account.createEmailPasswordSession(email, password);

          const [user, jwtResponse] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);

          if (!user.prefs?.reputation) {
            await account.updatePrefs<UserPrefs>({
              reputation: 0,
            });
          }

          set((state) => {
            state.session = session;
            state.user = user;
            state.jwt = jwtResponse.jwt;
          });

          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error as AppwriteException,
          };
        }
      },

      async createAccount(name, email, password) {
        try {
          await account.create(ID.unique(), email, password, name);

          const session =
            await account.createEmailPasswordSession(email, password);

          const user = await account.get<UserPrefs>();

          await account.updatePrefs<UserPrefs>({
            reputation: 0,
          });

          const jwtResponse = await account.createJWT();

          set((state) => {
            state.session = session;
            state.user = user;
            state.jwt = jwtResponse.jwt;
          });

          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error as AppwriteException,
          };
        }
      },

      async logout() {
        try {
          await account.deleteSession("current");

          set((state) => {
            state.session = null;
            state.user = null;
            state.jwt = null;
          });
        } catch (error) {
          console.log("Logout error:", error);
        }
      },
    })),
    {
      name: "auth",

      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);