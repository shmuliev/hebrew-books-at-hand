
import React, { useState } from 'react';
import { Search, Book, Calendar, MapPin, User, Heart, Menu, X } from 'lucide-react';
import { SearchInterface } from '../components/SearchInterface';
import { BookViewer } from '../components/BookViewer';
import { ContextualNavigation } from '../components/ContextualNavigation';

const Index = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setSideNavOpen(true);
  };

  const handleSearch = (query, filters) => {
    setIsSearching(true);
    // Simulate search results
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          titleHebrew: 'משנה תורה',
          titleEnglish: 'Mishneh Torah',
          authorHebrew: 'רמב"ם',
          authorEnglish: 'Maimonides',
          yearPrinted: '1574',
          placePrinted: 'Venice',
          pages: 450,
          language: 'hebrew'
        },
        {
          id: 2,
          titleHebrew: 'שולחן ערוך',
          titleEnglish: 'Shulchan Aruch',
          authorHebrew: 'יוסף קארו',
          authorEnglish: 'Joseph Karo',
          yearPrinted: '1565',
          placePrinted: 'Venice',
          pages: 320,
          language: 'hebrew'
        },
        {
          id: 3,
          titleHebrew: 'תלמוד בבלי',
          titleEnglish: 'Babylonian Talmud',
          authorHebrew: 'חכמי התלמוד',
          authorEnglish: 'Talmudic Sages',
          yearPrinted: '1520',
          placePrinted: 'Venice',
          pages: 2800,
          language: 'hebrew'
        }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir="ltr">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Book className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">HebrewBooks.org</h1>
                <p className="text-xs text-slate-600">60,000+ Hebrew & English Books</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-600 hover:text-blue-600 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setSideNavOpen(!sideNavOpen)}
                className="p-2 text-slate-600 hover:text-blue-600 transition-colors md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${selectedBook ? 'lg:mr-80' : ''}`}>
          {!selectedBook ? (
            <div className="px-4 sm:px-6 lg:px-8 py-8">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                  Discover Ancient Wisdom
                </h2>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                  Search through thousands of Hebrew and English texts with instant access
                </p>
              </div>

              {/* Search Interface */}
              <SearchInterface 
                onSearch={handleSearch}
                searchResults={searchResults}
                onBookSelect={handleBookSelect}
                isSearching={isSearching}
              />

              {/* Featured Categories */}
              <div className="mt-16">
                <h3 className="text-2xl font-semibold text-slate-900 mb-8 text-center">Featured Collections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Talmud', nameHebrew: 'תלמוד', count: '2,847', icon: Book },
                    { name: 'Halacha', nameHebrew: 'הלכה', count: '5,234', icon: Book },
                    { name: 'Shalos Utshuvos', nameHebrew: 'ותשובת שאלות', count: '1,892', icon: Book },
                    { name: 'History', nameHebrew: 'היסטוריה', count: '3,456', icon: Book },
                    { name: 'Kabbalah', nameHebrew: 'קבלה', count: '967', icon: Book },
                    { name: 'Modern Hebrew', nameHebrew: 'עברית חדשה', count: '4,123', icon: Book }
                  ].map((category, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="flex items-center justify-between mb-3">
                        <category.icon className="h-6 w-6 text-blue-600" />
                        <span className="text-sm text-slate-500">{category.count} books</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h4>
                      <p className="text-slate-600 text-right mt-1" dir="rtl">
                        {category.nameHebrew}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <BookViewer 
              book={selectedBook} 
              onClose={() => setSelectedBook(null)}
            />
          )}
        </div>

        {/* Contextual Side Navigation */}
        {selectedBook && (
          <ContextualNavigation 
            book={selectedBook}
            searchResults={searchResults}
            onBookSelect={handleBookSelect}
            isOpen={sideNavOpen}
            onClose={() => setSideNavOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
