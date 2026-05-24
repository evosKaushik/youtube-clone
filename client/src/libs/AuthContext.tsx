"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth, provider } from "./firebase";

import axiosInstance from "@/api/axiosInstance";

type UserType = {
  _id?: string;
  name: string;
  email: string;
  profilePicture?: string;
};

type UserContextType = {
  user: UserType | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(
  null,
);

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] =
    useState<UserType | null>(null);

  const [loading, setLoading] =
    useState(true);

  const saveUser = useCallback(
    (userdata: UserType | null) => {
      setUser(userdata);

      if (userdata) {
        localStorage.setItem(
          "user",
          JSON.stringify(userdata),
        );
      } else {
        localStorage.removeItem("user");
      }
    },
    [],
  );

  const loginWithGoogle = async () => {
    try {
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
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          setLoading(true);

          if (!firebaseUser) {
            saveUser(null);
            return;
          }

          const payload = {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            profilePicture:
              firebaseUser.photoURL ||
              "https://github.com/shadcn.png",
          };

          const response =
            await axiosInstance.post(
              "/users/login",
              payload,
            );

          saveUser(response.data.user);
        } catch (error) {
          console.log(error);

          saveUser(null);
        } finally {
          setLoading(false);
        }
      },
    );

    return () => unsubscribe();
  }, [saveUser]);

  return (
    <UserContext.Provider
      value={{
        user,
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
    throw new Error(
      "useUser must be used inside UserProvider",
    );
  }

  return context;
};