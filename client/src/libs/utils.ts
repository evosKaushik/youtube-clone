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
