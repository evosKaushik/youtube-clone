"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

import { auth, provider } from "./firebase";

import axiosInstance from "@/api/axiosInstance";

type UserType = {
  _id?: string;
  name: string;
  email: string;
  profilePicture?: string;
  username: string;
  subscription: {
    plan: "free" | "premium";
    status: "active" | "inActive";
    expiresAt: Date | null;
  };
};

type UserContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  loading: boolean;
  loginWithGoogle: (state?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

  const [loading, setLoading] = useState(true);

  const saveUser = useCallback((userdata: UserType | null) => {
    setUser(userdata);

    if (userdata) {
      localStorage.setItem("user", JSON.stringify(userdata));
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  const loginWithGoogle = async (state?: string) => {
    console.log(state);
    try {
      if (state) {
        localStorage.setItem("user_state", state);
      }
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);

      saveUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        if (!firebaseUser) {
          const localUser = localStorage.getItem("user");

          if (localUser) {
            setUser(JSON.parse(localUser));
          } else {
            setUser(null);
          }

          setLoading(false);
          return;
        }

        const userState = localStorage.getItem("user_state");
        if (!userState) {
          saveUser(null);
          console.error("user state is required");
          return;
        }

        const payload = {
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          profilePicture:
            firebaseUser.photoURL || "https://github.com/shadcn.png",
          userState,
        };

        const response = await axiosInstance.post("/users/google", payload);

        if (response.data.user.userState) {
          localStorage.setItem("user_state", response.data.user.userState);
        }
        saveUser(response.data.user);
      } catch (error) {
        console.log(error);

        saveUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [saveUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
};
