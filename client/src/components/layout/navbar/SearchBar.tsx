"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (!search.trim()) return;

    router.push(`/results?search_query=${encodeURIComponent(search)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-1 h-10 min-w-0">
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
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
        onClick={handleSearch}
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
  );
}
