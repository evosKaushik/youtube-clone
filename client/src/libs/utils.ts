
import { SOUTH_STATES } from "@/constant/constant";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"




export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

export const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return "just now";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "just now";

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds <= 0) return "just now";

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ] as const;

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);

    if (count >= 1) {
      return rtf.format(-count, interval.label);
    }
  }

  return "just now";
};

export const formatViews = (views?: number) => {
  const safeViews = views ?? 0;
  return `${Intl.NumberFormat("en", { notation: "compact" }).format(safeViews)} views`;
};

export const formatDuration = (duration?: number) => {
  if (!duration || duration < 0) return null;
  const mins = Math.floor(duration / 60);
  const secs = duration % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const loadRazorPayScript = () => {
  return new Promise((resolve) => {
    const script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);

    document.body.appendChild(script);
  });
};

export const getStateFromLocation = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );

          if (!res.ok) {
            throw new Error("Failed to fetch location details");
          }

          const data = await res.json();

          const state = data?.address?.state;

          if (!state) {
            throw new Error("State not found");
          }

          resolve(state);
        } catch (err) {
          reject(err);
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Location permission denied"));
            break;

          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location unavailable"));
            break;

          case error.TIMEOUT:
            reject(new Error("Location request timed out"));
            break;

          default:
            reject(new Error("Unknown location error"));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};


export const getThemeByLocationAndTime = () => {
  const state = localStorage.getItem("user_state");

  if (!state) {
    return "dark";
  }

  const isSouthIndian = SOUTH_STATES.includes(state);

  const currentHour = Number(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false,
    })
  );

  const isThemeTime =
    currentHour >= 10 &&
    currentHour < 12;

  if (isSouthIndian && isThemeTime) {
    return "light";
  }

  return "dark";
};