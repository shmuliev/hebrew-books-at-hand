import React, { useState, useRef, useEffect } from 'react';
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

  // Mock search within book
  const handleSearchInBook = () => {
    if (searchInBook.trim()) {
      // Simulate finding results
      setSearchResults({ total: 15, current: 1 });
    } else {
      setSearchResults({ total: 0, current: 0 });
    }
  };

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

  const nextPage = () => {
    if (currentPage < book.pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        isRTL ? nextPage() : prevPage();
      } else if (e.key === 'ArrowRight') {
        isRTL ? prevPage() : nextPage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isRTL]);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Book Viewer Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h2 className="font-semibold text-slate-900" dir="auto">
              {book.titleHebrew}
            </h2>
            <p className="text-sm text-slate-600" dir="auto">
              {book.authorHebrew} • {book.yearPrinted} • {book.placePrinted}
            </p>
          </div>
        </div>

        {/* Search in Book */}
        <div className="flex items-center gap-4">
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
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button onClick={nextSearchResult} className="p-1 hover:bg-slate-100 rounded">
                  <ChevronRight className="h-3 w-3" />
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
      </div>

      {/* Main Viewer Area */}
      <div className="flex-1 flex" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Book Content */}
        <div 
          ref={viewerRef}
          className="flex-1 overflow-auto bg-slate-50 relative"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center top' }}
        >
          {/* Page Navigation */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
            <button 
              onClick={prevPage}
              disabled={currentPage === 1}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </button>
          </div>

          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
            <button 
              onClick={nextPage}
              disabled={currentPage === book.pages}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isRTL ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
            </button>
          </div>

          {/* Mock Book Page */}
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="aspect-[3/4] bg-gradient-to-br from-amber-50 to-orange-50 p-12 relative">
                {/* Hebrew Text Sample */}
                <div className="space-y-6" dir="rtl">
                  <h3 className="text-3xl font-bold text-slate-800 text-center border-b-2 border-slate-300 pb-4">
                    {book.titleHebrew}
                  </h3>
                  
                  {/* Sample Hebrew text with highlighting for search */}
                  <div className="text-lg leading-relaxed text-slate-800 space-y-4">
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

      {/* Bottom Controls */}
      <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsRTL(!isRTL)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {isRTL ? 'Switch to LTR' : 'Switch to RTL'}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max={book.pages}
            value={currentPage}
            onChange={(e) => setCurrentPage(parseInt(e.target.value))}
            className="w-32"
          />
          <span className="text-sm text-slate-600 min-w-20">
            {currentPage} / {book.pages}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <button 
            onClick={nextPage}
            disabled={currentPage === book.pages}
            className="px-3 py-1 text-sm bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
