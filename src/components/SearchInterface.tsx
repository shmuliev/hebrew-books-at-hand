import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Filter, Calendar, MapPin, User, BookOpen, Clock, Keyboard as KeyboardIcon, XCircle } from 'lucide-react';
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

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
  const [filters, setFilters] = useState({
    language: '',
    yearFrom: '',
    yearTo: '',
    place: '',
    author: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const keyboardRef = useRef<any>(null);

  const mockSuggestions = [
    { type: 'title', text: 'משנה תורה', textEn: 'Mishneh Torah' },
    { type: 'author', text: 'רמב"ם', textEn: 'Maimonides' },
    { type: 'title', text: 'שולחן ערוך', textEn: 'Shulchan Aruch' },
    { type: 'place', text: 'Venice' },
    { type: 'year', text: '1574' }
  ];

  useEffect(() => {
    if (query.length > 1) {
      const filtered = mockSuggestions.filter(s =>
        s.text.includes(query) ||
        s.textEn?.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, filters);
      setShowSuggestions(false);
      setIsKeyboardOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const selectSuggestion = (suggestion: any) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    setIsKeyboardOpen(false);
    setTimeout(() => handleSearch(), 100);
  };

  const onKeyboardChange = useCallback((input: string) => {
    setQuery(input);
  }, []);

  const onKeyboardKeyPress = useCallback((button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      if (keyboardRef.current) {
        keyboardRef.current.setOptions({
          layoutName: keyboardRef.current.options.layoutName === "default" ? "shift" : "default"
        });
      }
    }
    if (button === "{enter}") {
        handleSearch();
    }
    if (button === "{bksp}") {
      setQuery(prevQuery => prevQuery.slice(0, -1));
    }
  }, [handleSearch]);

  const toggleKeyboard = () => {
    setIsKeyboardOpen(prev => !prev);
    if (!isKeyboardOpen && searchRef.current) {
        searchRef.current.focus();
    }
  };

  const hebrewLayout = {
    'default': [
      "ק ר א ט ו ן ם פ",
      "ש ד ג כ ע י ח ל ך ף",
      "ז ס ב ה נ מ צ ת ץ , .",
      "{shift} / {space} {bksp} {enter}"
    ],
    'shift': [
      "! @ # $ % ^ & * ( ) _ +",
      "~ ` { } | \\ [ ] ; : \" '",
      "< > ? / - = , .",
      "{shift} / {space} {bksp} {enter}"
    ]
  };

  return (
    <div className="space-y-6">
      {/* Search Bar Section - This div centers the main search elements */}
      <div className="max-w-3xl mx-auto"> {/* Changed from max-w-2xl to max-w-3xl or your preferred width */}

        {/* --- DESKTOP VIEW: Keyboard Toggle + Search Input/Button --- */}
        {/* Hidden on small screens, flex on medium and larger screens */}
        <div className="hidden md:flex items-center gap-4">

          {/* Keyboard Toggle Button (Desktop Version) */}
          <button
            onClick={toggleKeyboard}
            className="flex-shrink-0 flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg"
            title={isKeyboardOpen ? "Close Keyboard" : "Open On-screen Keyboard"}
          >
            {isKeyboardOpen ? (
                <XCircle className="h-6 w-6" />
            ) : (
                <KeyboardIcon className="h-6 w-6" />
            )}
            <span className="text-xl font-bold" dir="rtl">ע</span>
          </button>

          {/* Input, Search Button, Suggestions (Desktop Version) */}
          <div className="relative flex-1 flex items-stretch gap-4">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => {
                  setQuery(e.target.value);
                  if (keyboardRef.current) {
                      keyboardRef.current.setInput(e.target.value);
                  }
              }}
              onKeyPress={handleKeyPress}
              placeholder="Search in English or Hebrew"
              className="flex-1 px-4 py-4 text-lg bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none shadow-sm transition-all"
              dir="auto"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 border-2 border-blue-600"
            >
              <Search className="h-4 w-4" />
              {isSearching ? 'Searching...' : 'Search'}
            </button>

            {/* Suggestions Dropdown (common to both views) */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 flex items-center gap-3"
                  >
                    <div className="flex-shrink-0">
                      {suggestion.type === 'title' && <BookOpen className="h-4 w-4 text-blue-600" />}
                      {suggestion.type === 'author' && <User className="h-4 w-4 text-green-600" />}
                      {suggestion.type === 'place' && <MapPin className="h-4 w-4 text-purple-600" />}
                      {suggestion.type === 'year' && <Calendar className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900" dir="auto">
                        {suggestion.text}
                      </div>
                      {suggestion.textEn && (
                        <div className="text-sm text-slate-500">
                          {suggestion.textEn}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div> {/* End of desktop input/button/suggestions div */}

        </div> {/* End of desktop flex container */}

        {/* --- MOBILE VIEW: Input (top), then Toggle+Search Button (below) --- */}
        {/* Flex column on small screens, hidden on medium and larger screens */}
        <div className="flex flex-col gap-4 md:hidden">

          {/* Input Field (Mobile Version) - now takes full width */}
          {/* Ensure this div is relative for the suggestions dropdown */}
          <div className="relative w-full">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => {
                  setQuery(e.target.value);
                  if (keyboardRef.current) {
                      keyboardRef.current.setInput(e.target.value);
                  }
              }}
              onKeyPress={handleKeyPress}
              placeholder="Search in English or Hebrew"
              className="w-full px-4 py-4 text-lg bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none shadow-sm transition-all"
              dir="auto"
            />
            {/* Suggestions Dropdown (common to both views) - remains within this relative div */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 flex items-center gap-3"
                  >
                    <div className="flex-shrink-0">
                      {suggestion.type === 'title' && <BookOpen className="h-4 w-4 text-blue-600" />}
                      {suggestion.type === 'author' && <User className="h-4 w-4 text-green-600" />}
                      {suggestion.type === 'place' && <MapPin className="h-4 w-4 text-purple-600" />}
                      {suggestion.type === 'year' && <Calendar className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900" dir="auto">
                        {suggestion.text}
                      </div>
                      {suggestion.textEn && (
                        <div className="text-sm text-slate-500">
                          {suggestion.textEn}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div> {/* End of mobile input field div */}

          {/* NEW: Keyboard Toggle Button + Search Button (Mobile Version) - on next line */}
          {/* This div now ensures the toggle is on the left, and the search button expands to the right */}
          <div className="flex items-center gap-4"> {/* Removed justify-center here */}
            {/* Keyboard Toggle Button */}
            <button
              onClick={toggleKeyboard}
              className="flex-shrink-0 flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg" // Added flex-shrink-0
              title={isKeyboardOpen ? "Close Keyboard" : "Open On-screen Keyboard"}
            >
              {isKeyboardOpen ? (
                  <XCircle className="h-6 w-6" />
              ) : (
                  <KeyboardIcon className="h-6 w-6" />
              )}
              <span className="text-xl font-bold" dir="rtl">ע</span>
            </button>

            {/* Search Button (Mobile Version) - Now fills remaining space */}
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 border-2 border-blue-600" // Added flex-1 and justify-center
            >
              <Search className="h-4 w-4" />
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

        </div> {/* End of mobile flex column container */}


        {/* On-screen Hebrew Keyboard (this remains common, visibility controlled by isKeyboardOpen) */}
        {isKeyboardOpen && (
            <div className="mt-4">
                <Keyboard
                    keyboardRef={r => (keyboardRef.current = r)}
                    inputName={"default"}
                    layout={hebrewLayout}
                    onChange={onKeyboardChange}
                    onKeyPress={onKeyboardKeyPress}
                    syncInstanceInputs={true}
                    theme={"hg-theme-default hg-layout-numeric"}
                />
            </div>
        )}

        {/* Search Tip Text */}
        <div className="text-center px-4 mt-8">
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="block sm:inline">Search titles, authors, places, and publication years</span>
            <span className="hidden sm:inline mx-2">•</span>
            <span className="block sm:inline" dir="rtl">חיפוש כותרים, מחברים, מקומות ושנות הדפסה</span>
          </p>
        </div>

      </div> {/* End of max-w-3xl mx-auto div (Search Bar Section) */}

      {/* Advanced Filters */}
      <div className="text-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {showFilters ? 'Hide Advanced Search' : 'Show Advanced Search'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({...filters, language: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded-md focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Languages</option>
                <option value="hebrew">Hebrew</option>
                <option value="english">English</option>
                <option value="aramaic">Aramaic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Year From</label>
              <input
                type="number"
                value={filters.yearFrom}
                onChange={(e) => setFilters({...filters, yearFrom: e.target.value})}
                placeholder="1450"
                className="w-full p-2 border border-slate-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Year To</label>
              <input
                type="number"
                value={filters.yearTo}
                onChange={(e) => setFilters({...filters, yearTo: e.target.value})}
                placeholder="1800"
                className="w-full p-2 border border-slate-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Place Printed</label>
              <input
                type="text"
                value={filters.place}
                onChange={(e) => setFilters({...filters, place: e.target.value})}
                placeholder="Venice, Amsterdam..."
                className="w-full p-2 border border-slate-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Author</label>
              <input
                type="text"
                value={filters.author}
                onChange={(e) => setFilters({...filters, author: e.target.value})}
                placeholder="רמב״ם, Maimonides..."
                className="w-full p-2 border border-slate-300 rounded-md focus:border-blue-500 focus:outline-none"
                dir="auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">
              Search Results ({searchResults.length})
            </h3>
          </div>

          <div className="grid gap-4">
            {searchResults.map((book) => (
              <div
                key={book.id}
                onClick={() => onBookSelect(book)}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors" dir="auto">
                          {book.titleHebrew}
                        </h4>
                        {book.titleEnglish && (
                          <p className="text-slate-600 mt-1">
                            {book.titleEnglish}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span dir="auto">{book.authorHebrew}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {book.yearPrinted}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {book.placePrinted}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {book.pages} pages
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Read Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isSearching && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Searching through 60,000+ books...</p>
        </div>
      )}
    </div>
  );
};
