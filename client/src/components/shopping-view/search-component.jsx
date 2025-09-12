import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchComponent() {
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
    <div className="w-full">
      <form onSubmit={handleSearch} className="w-full">
        <Input
          value={keyword}
          name="keyword"
          onChange={(event) => setKeyword(event.target.value)}
          onKeyPress={handleKeyPress}
          className="py-2 px-3"
          placeholder="Search Products..."
        />
      </form>
    </div>
  );
}

export default SearchComponent;
