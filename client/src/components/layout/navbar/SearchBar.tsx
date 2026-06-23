"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { FaSearch } from "react-icons/fa";
import { getSearchSuggestionsApi } from "@/api/searchApi";

type Suggestion = {
  _id: string;
  name: string;
  thumbnailURL?: string;
};

export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(
    (query?: string) => {
      const q = query ?? search;
      if (!q.trim()) return;
      setShowSuggestions(false);
      router.push(`/results?search_query=${encodeURIComponent(q)}`);
    },
    [search, router],
  );

  // Debounced suggestion fetch
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const q = search.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const data = await getSearchSuggestionsApi(q);
      if (Array.isArray(data)) {
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
        setHighlightIndex(-1);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search]);

  // Click outside to close suggestions
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        handleSearch(suggestions[highlightIndex].name);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative flex flex-1 h-10 min-w-0" ref={wrapperRef}>
      <div className="flex flex-1 h-10 min-w-0">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(false);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="
          flex-1
          min-w-0
          bg-background
          border
          border-border
          rounded-l-full
          px-4
          text-text
          text-[16px]
          outline-none
          focus:border-blue-500
        "
        />

        <button
          onClick={() => handleSearch()}
          className="
          w-16
          shrink-0
          bg-hover
          border
          border-l-0
          border-border
          rounded-r-full
          flex
          items-center
          justify-center
          hover:bg-hover
          transition
        "
        >
          <FaSearch className="text-text text-lg" />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="
            absolute
            top-full
            left-0
            right-16
            mt-1
            bg-card
            border
            border-border
            rounded-xl
            shadow-2xl
            z-50
            overflow-hidden
          "
        >
          {suggestions.map((s, i) => (
            <button
              key={s._id}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSearch(s.name);
              }}
              onMouseEnter={() => setHighlightIndex(i)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-left transition text-sm
                ${i === highlightIndex ? "bg-hover" : "hover:bg-hover"}
              `}
            >
              {s.thumbnailURL ? (
                <Image
                  src={s.thumbnailURL}
                  alt=""
                  width={36}
                  height={20}
                  className="rounded object-cover w-9 h-5 shrink-0"
                />
              ) : (
                <FaSearch className="text-secondaryText shrink-0" />
              )}
              <span className="truncate text-text">{s.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
