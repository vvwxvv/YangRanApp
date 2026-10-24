import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder = "Search...", className = "" }) => {
  return (
    <div className="relative">
      <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-primary, #000000)' }} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-1 focus:outline-none transition-colors text-sm sm:text-base ${className}`}
        style={{
          borderColor: 'var(--border-light, #000000)',
          backgroundColor: 'var(--background-primary, #ffffff)',
          color: 'var(--text-primary, #000000)',
          '--tw-placeholder-opacity': '1',
        }}
      />
    </div>
  );
};

export default SearchInput;  