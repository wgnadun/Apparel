import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

function SearchComponent({ className }) {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop/search-results?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSearch} className="relative group/form w-full">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400 group-focus-within/form:text-yellow-500 transition-colors" />
        </div>
        <Input
          value={keyword}
          name="keyword"
          onChange={(event) => setKeyword(event.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full bg-gray-50/50 border-gray-100 pl-11 pr-4 py-6 rounded-2xl text-sm font-medium transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400/50 placeholder:text-gray-400 placeholder:font-normal"
          placeholder="Search for your style..."
        />
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-400 scale-x-0 group-focus-within/form:scale-x-100 transition-transform duration-500 rounded-full"></div>
      </form>
    </div>
  );
}

export default SearchComponent;
