"use client";

import { useEffect, useState } from "react";

type Breakpoint =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";

const breakpoints = {
  xs: "(max-width: 375px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
};

const useMedia = (size: Breakpoint) => {
  const query = breakpoints[size];

  const getMatches = () => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] =
    useState(getMatches);

  useEffect(() => {
    const media =
      window.matchMedia(query);

    const listener = (
      e: MediaQueryListEvent
    ) => {
      setMatches(e.matches);
    };

    setMatches(media.matches);

    media.addEventListener(
      "change",
      listener
    );

    return () => {
      media.removeEventListener(
        "change",
        listener
      );
    };
  }, [query]);

  return matches;
};

export default useMedia;