"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

import { onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from "firebase/auth";

import { auth, provider } from "./firebase";

import axiosInstance from "@/api/axiosInstance";

type UserType = {
  _id?: string;
  name: string;
  email: string;
  profilePicture?: string;
  username: string;
  subscription: {
    plan: string;
    status: string;
    noOfDownloads?: number;
    watchTimeInMinutes?: number;
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
      // Use signInWithPopup as primary (works on most devices)
      // Fall back to signInWithRedirect if popup is blocked
      try {
        await signInWithPopup(auth, provider);
      } catch (popupError: any) {
        // If popup is blocked or closed, fall back to redirect
        if (popupError.code === "auth/popup-blocked" || popupError.code === "auth/popup-closed-by-user") {
          await signInWithRedirect(auth, provider);
        } else {
          throw popupError;
        }
      }
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

  // Handle result from signInWithRedirect (works on all devices including mobile)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        // getRedirectResult returns null if there's no pending redirect
        // The actual user handling will happen in onAuthStateChanged
        if (result) {
          console.log("Redirect login successful:", result.user.email);
        }
      } catch (error) {
        console.error("Redirect result error:", error);
      }
    };
    handleRedirectResult();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (isCancelled) return;
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
          setLoading(false);
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
        if (!isCancelled) {
          saveUser(response.data.user);
        }
      } catch (error) {
        console.log(error);

        if (!isCancelled) {
          saveUser(null);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    });

    return () => {
      isCancelled = true;
      unsubscribe();
    };
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
