import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, User, BookOpen, Clock } from 'lucide-react';

interface SearchInterfaceProps {
  onSearch: (query: string, filters: any) => void;
  searchResults: any[];
  onBookSelect: (book: any) => void;
  isSearching: boolean;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onSearch,
  searchResults,
  onBookSelect,
  isSearching
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    language: '',
    category: '',
    author: ''
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    'Mishneh Torah',
    'Shulchan Aruch',  
    'Talmud Bavli',
    'Rambam',
    'Rashi',
    'Venice 1565'
  ];

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, filters);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setTimeout(() => {
      onSearch(suggestion, filters);
    }, 100);
  };

  const handleInputFocus = () => {
    if (query.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay to allow suggestion clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="relative">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Search in English or Hebrew"
              className="w-full px-4 py-4 pr-32 text-lg bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none shadow-sm transition-all"
              dir="auto"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          <div className="text-center px-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="block sm:inline">Search titles, authors, places, and publication years</span>
              <span className="hidden sm:inline mx-2">•</span>
              <span className="block sm:inline" dir="rtl">חיפוש כותרים, מחברים, מקומות ושנות הדפסה</span>
            </p>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {suggestions
              .filter(suggestion => 
                suggestion.toLowerCase().includes(query.toLowerCase())
              )
              .map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">{suggestion}</span>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 mx-auto"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Advanced Filters'}
        </button>
      </div>

      {/* Advanced Filters section */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="From year"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, start: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="To year"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, end: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <BookOpen className="inline h-4 w-4 mr-1" />
                Language
              </label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Languages</option>
                <option value="hebrew">Hebrew</option>
                <option value="english">English</option>
                <option value="aramaic">Aramaic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="halacha">Halacha</option>
                <option value="kabbalah">Kabbalah</option>
                <option value="philosophy">Philosophy</option>
                <option value="history">History</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Author
              </label>
              <input
                type="text"
                placeholder="Author name"
                value={filters.author}
                onChange={(e) => setFilters({ ...filters, author: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Search Results section */}
      {searchResults.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Search Results ({searchResults.length})
          </h3>
          <div className="space-y-4">
            {searchResults.map((book) => (
              <div
                key={book.id}
                onClick={() => onBookSelect(book)}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900" dir="auto">
                          {book.titleHebrew}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {book.titleEnglish}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span dir="auto">{book.authorHebrew} ({book.authorEnglish})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{book.yearPrinted}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{book.placePrinted}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="h-4 w-4" />
                    <span>{book.pages} pages</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
