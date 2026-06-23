"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axiosInstance";

type UserType = {
  _id?: string;
  name: string;
  email: string;
  profilePicture?: string;
  username: string;
  channelName?: string | null;
  subscriberCount?: number;
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

  const router = useRouter();

  const logout = async () => {
    saveUser(null);
    router.push("/");
  };

  // Restore user from localStorage on mount
  useEffect(() => {
    try {
      const localUser = localStorage.getItem("user");
      if (localUser) {
        setUser(JSON.parse(localUser));
      }
    } catch (error) {
      console.error("Failed to restore user from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
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
