import React, { useState, useRef, useEffect, useCallback } from 'react'; // Added useCallback
import { Search, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';

interface BookViewerProps {
  book: any;
  onClose: () => void;
}

export const BookViewer: React.FC<BookViewerProps> = ({ book, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInBook, setSearchInBook] = useState('');
  const [searchResults, setSearchResults] = useState({ total: 0, current: 0 });
  const [zoom, setZoom] = useState(100);
  const [isRTL, setIsRTL] = useState(book.language === 'hebrew');
  const viewerRef = useRef<HTMLDivElement>(null);
  const [showMobileSearchAndZoom, setShowMobileSearchAndZoom] = useState(false); // New state for mobile header

  // Mock search within book
  const handleSearchInBook = useCallback(() => { // Memoized with useCallback
    if (searchInBook.trim()) {
      // Simulate finding results
      setSearchResults({ total: 15, current: 1 });
    } else {
      setSearchResults({ total: 0, current: 0 });
    }
  }, [searchInBook]); // Dependency on searchInBook

  const nextSearchResult = () => {
    if (searchResults.current < searchResults.total) {
      setSearchResults({ ...searchResults, current: searchResults.current + 1 });
    }
  };

  const prevSearchResult = () => {
    if (searchResults.current > 1) {
      setSearchResults({ ...searchResults, current: searchResults.current - 1 });
    }
  };

  const nextPage = useCallback(() => { // Memoized with useCallback
    if (currentPage < book.pages) {
      setCurrentPage(isRTL ? currentPage - 1 : currentPage + 1);
    }
  }, [currentPage, book.pages, isRTL]); // Dependencies for useCallback

  const prevPage = useCallback(() => { // Memoized with useCallback
    if (currentPage > 1) {
      setCurrentPage(isRTL ? currentPage + 1 : currentPage - 1);
    }
  }, [currentPage, isRTL]); // Dependencies for useCallback

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        // Adjust for RTL/LTR book direction logic for right arrow key
        isRTL ? prevPage() : nextPage(); // RTL: Right arrow goes to previous page. LTR: Right arrow goes to next page.
      } else if (e.key === 'ArrowLeft') {
        // Adjust for RTL/LTR book direction logic for left arrow key
        isRTL ? nextPage() : prevPage(); // RTL: Left arrow goes to next page. LTR: Left arrow goes to previous page.
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isRTL, nextPage, prevPage, onClose]); // Added all necessary dependencies

  // Ensure scroll position is reset when page changes
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.scrollTo(0, 0);
    }
  }, [currentPage]);


  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Book Viewer Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 md:gap-4 flex-grow">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
          <div className="min-w-0">
            <h2 className="font-semibold text-slate-900 truncate" dir="auto">
              {book.titleHebrew}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 truncate" dir="auto">
              {book.authorHebrew} • {book.yearPrinted} • {book.placePrinted}
            </p>
          </div>
        </div>

        {/* Search & Zoom Controls (Desktop view) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchInBook}
              onChange={(e) => setSearchInBook(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchInBook()}
              placeholder="Search in book..."
              className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none w-64"
            />
            {searchResults.total > 0 && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  {searchResults.current}/{searchResults.total}
                </span>
                <button onClick={prevSearchResult} className="p-1 hover:bg-slate-100 rounded">
                  <ChevronRight className="h-3 w-3" />
                </button>
                <button onClick={nextSearchResult} className="p-1 hover:bg-slate-100 rounded">
                  <ChevronLeft className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 25))}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm text-slate-600 min-w-12 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Search/Zoom Toggle Icon */}
        <div className="md:hidden flex items-center gap-2">
            <button
                onClick={() => setShowMobileSearchAndZoom(!showMobileSearchAndZoom)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label={showMobileSearchAndZoom ? "Hide search and zoom" : "Show search and zoom"}
            >
                {showMobileSearchAndZoom ? <X className="h-5 w-5 text-slate-600" /> : <Search className="h-5 w-5 text-slate-600" />}
            </button>
        </div>

        {/* Mobile Search & Zoom Controls (shown when toggled) */}
        {showMobileSearchAndZoom && (
            <div className="md:hidden w-full flex flex-col items-center gap-3 mt-2 pb-2 border-t border-slate-100 pt-2">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchInBook}
                        onChange={(e) => setSearchInBook(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchInBook()}
                        placeholder="Search in book..."
                        className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none w-full"
                    />
                    {searchResults.total > 0 && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                            <span className="text-xs text-slate-500">
                                {searchResults.current}/{searchResults.total}
                            </span>
                            <button onClick={prevSearchResult} className="p-1 hover:bg-slate-100 rounded">
                                <ChevronRight className="h-3 w-3" />
                            </button>
                            <button onClick={nextSearchResult} className="p-1 hover:bg-slate-100 rounded">
                                <ChevronLeft className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Zoom Controls for Mobile */}
                <div className="flex items-center justify-center gap-2 w-full">
                    <button
                        onClick={() => setZoom(Math.max(50, zoom - 25))}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ZoomOut className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-slate-600 min-w-12 text-center">{zoom}%</span>
                    <button
                        onClick={() => setZoom(Math.min(200, zoom + 25))}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ZoomIn className="h-4 w-4" />
                    </button>
                </div>
            </div>
        )}

      </div> {/* End Book Viewer Header */}

      {/* Main Viewer Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Book Content (mock page) */}
        <div
          ref={viewerRef}
          className="flex-1 overflow-auto bg-slate-50 relative"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center top' }}
        >
          {/* Mock Book Page - Adjusted for responsive padding */}
          <div className="w-full flex justify-center py-8 px-4 sm:px-8 md:px-12">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
              <div className="aspect-[3/4] bg-gradient-to-br from-amber-50 to-orange-50 p-6 sm:p-8 md:p-12 relative">
                {/* Hebrew Text Sample */}
                <div className="space-y-6" dir="rtl">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 text-center border-b-2 border-slate-300 pb-4">
                    {book.titleHebrew}
                  </h3>

                  {/* Sample Hebrew text with highlighting for search */}
                  <div className="text-base sm:text-lg leading-relaxed text-slate-800 space-y-4">
                    <p className={searchInBook && searchInBook.includes('משה') ? 'bg-yellow-200' : ''}>
                      וְאָמַר רַבִּי יְהוֹשֻׁעַ בֶּן לֵוִי: כָּל הַמְהַלֵּךְ בַּדֶּרֶךְ וְאֵין עִמּוֹ לְוַיָּה, יַעֲסֹק בַּתּוֹרָה. שֶׁנֶּאֱמַר: כִּי לִוְיַת חֵן הֵם לְרֹאשֶׁךָ וַעֲנָקִים לְגַרְגְּרֹתֶיךָ.
                    </p>
                    <p>
                      וְכֵן אָמַר רַבִּי אֶלְעָזָר בֶּן עֲזַרְיָה: אִם אֵין תּוֹרָה, אֵין דֶּרֶךְ אֶרֶץ. אִם אֵין דֶּרֶךְ אֶרֶץ, אֵין תּוֹרָה.
                    </p>
                    <p>
                      הַמְלַמֵּד תּוֹרָה לְבֶן חֲבֵרוֹ כְּאִלּוּ יְלָדוֹ. שֶׁנֶּאֱמַר: וְאֵלֶּה תּוֹלְדוֹת אַהֲרֹן וּמֹשֶׁה.
                    </p>
                    <p>
                      וְכֵן אָמְרוּ חֲכָמִים: כָּל הַמְלַמֵּד בֶּן חֲבֵרוֹ תּוֹרָה, זוֹכֶה וְיוֹשֵׁב בַּיְשִׁיבָה שֶׁל מַעְלָה.
                    </p>
                  </div>
                </div>

                {/* Page number */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white px-3 py-1 rounded-full text-sm text-slate-600 shadow">
                    Page {currentPage} of {book.pages}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls - Now includes page navigation */}
      <div className="bg-white border-t border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRTL(!isRTL)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {isRTL ? 'Switch to LTR' : 'Switch to RTL'}
          </button>
        </div>

        {/* Page Slider and Current Page Info */}
        <div className="flex items-center gap-2 flex-grow justify-center md:flex-grow-0 min-w-0 md:min-w-[auto]">
          <input
            type="range"
            min="1"
            max={book.pages}
            value={currentPage}
            onChange={(e) => setCurrentPage(parseInt(e.target.value))}
            className="w-24 sm:w-32"
          />
          <span className="text-sm text-slate-600 min-w-16 text-center">
            {currentPage} / {book.pages}
          </span>
        </div>

        {/* Page Navigation Buttons - Moved here for mobile friendliness */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="p-2 sm:px-3 sm:py-1 text-sm bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-50 transition-colors flex items-center gap-1"
            aria-label={isRTL ? "Next Page" : "Previous Page"}
          >
            {isRTL ? <ArrowRight className="h-4 w-4 md:hidden" /> : <ArrowLeft className="h-4 w-4 md:hidden" />}
            <span className="hidden md:inline">Previous</span>
            <span className="inline md:hidden">{isRTL ? "Next" : "Prev"}</span>
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === book.pages}
            className="p-2 sm:px-3 sm:py-1 text-sm bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-50 transition-colors flex items-center gap-1"
            aria-label={isRTL ? "Previous Page" : "Next Page"}
          >
            {isRTL ? <ArrowLeft className="h-4 w-4 md:hidden" /> : <ArrowRight className="h-4 w-4 md:hidden" />}
            <span className="hidden md:inline">Next</span>
            <span className="inline md:hidden">{isRTL ? "Prev" : "Next"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
