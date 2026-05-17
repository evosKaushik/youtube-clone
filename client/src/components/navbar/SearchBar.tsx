import {
  FaSearch,
  FaMicrophone,
} from "react-icons/fa";

export default function SearchBar() {
  return (
    <div className="hidden md:flex flex-1 max-w-2xl items-center gap-3">
      <div className="flex flex-1 items-center border border-border rounded-full overflow-hidden bg-card">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent px-5 py-2 outline-none"
        />

        <button className="px-5 py-3 border-l border-border hover:bg-hover transition-all">
          <FaSearch />
        </button>
      </div>

      <button className="icon-btn rounded-full w-12 h-12">
        <FaMicrophone />
      </button>
    </div>
  );
}