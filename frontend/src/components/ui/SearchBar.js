import React, { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';

const SearchBar = ({ 
  onSearch, 
  placeholder = "検索...", 
  debounceMs = 300,
  className = "" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  useEffect(() => {
    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="pr-20"
      />
      {searchTerm && (
        <Button
          onClick={handleClear}
          variant="secondary"
          size="sm"
          className="absolute right-2 top-2 px-3 py-1 text-xs"
        >
          クリア
        </Button>
      )}
    </div>
  );
};

export default SearchBar;