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
      <div className="max-w-2xl mx-auto">

        {/* NEW: Outer flex container for the keyboard toggle and the search input/button group */}
        {/* items-center vertically aligns them, gap-4 adds space between them */}
        <div className="flex items-center gap-4">

          {/* NEW: Keyboard Toggle Button - now outside the input's direct container */}
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
            {/* NEW: Hebrew character next to the icon */}
            <span className="text-xl font-bold" dir="rtl">ע</span>
          </button>

          {/* This div now wraps ONLY the input, search button, and suggestions dropdown. */}
          {/* flex-1 makes it take up the remaining space in the outer flex container. */}
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

            {/* Suggestions Dropdown - still positioned relative to its new flex-1 parent */}
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
          </div> {/* End of relative flex-1 flex items-stretch gap-4 div (Input, Button, and Suggestions) */}

        </div> {/* NEW: End of flex items-center gap-4 div (Outer flex for keyboard toggle + search bar) */}

        {/* On-screen Hebrew Keyboard */}
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

      </div> {/* End of max-w-2xl mx-auto div (Search Bar Section) */}

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
        <div className="bg-white rounded-lg border border-slate
