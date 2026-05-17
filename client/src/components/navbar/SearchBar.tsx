import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <div className="flex flex-1 h-10 min-w-0">
      <input
        type="text"
        placeholder="Search"
        className="
        
          flex-1
          min-w-0
          bg-[#121212]
          border
          border-[#303030]
          rounded-l-full
          px-4
          text-white
          text-[16px]
          outline-none
          focus:border-blue-500
        "
      />

      <button
        className="
          w-16
          shrink-0
          bg-[#222222]
          border
          border-l-0
          border-[#303030]
          rounded-r-full
          flex
          items-center
          justify-center
          hover:bg-[#2f2f2f]
          transition
        "
      >
        <FaSearch className="text-white text-lg" />
      </button>
    </div>
  );
}