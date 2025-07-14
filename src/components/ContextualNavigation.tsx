
import React, { useState } from 'react';
import { Book, Search, List, User, Calendar, MapPin, X, ChevronDown, ChevronUp } from 'lucide-react';

interface ContextualNavigationProps {
  book: any;
  searchResults: any[];
  onBookSelect: (book: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ContextualNavigation: React.FC<ContextualNavigationProps> = ({
  book,
  searchResults,
  onBookSelect,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('results');
  const [expandedSections, setExpandedSections] = useState({
    chapter1: true,
    chapter2: false,
    chapter3: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mock table of contents for the current book
  const tableOfContents = [
    {
      id: 'chapter1',
      title: 'הלכות יסודי התורה',
      titleEn: 'Laws of Torah Foundations',
      page: 1,
      sections: [
        { title: 'פרק א׳ - יסוד היסודות', titleEn: 'Chapter 1 - Foundation of Foundations', page: 1 },
        { title: 'פרק ב׳ - האלוה ויחודו', titleEn: 'Chapter 2 - God and Unity', page: 12 },
        { title: 'פרק ג׳ - מצוות אהבה ויראה', titleEn: 'Chapter 3 - Love and Fear', page: 24 }
      ]
    },
    {
      id: 'chapter2',
      title: 'הלכות דעות',
      titleEn: 'Laws of Character Traits',
      page: 45,
      sections: [
        { title: 'פרק א׳ - דרכי האמצע', titleEn: 'Chapter 1 - The Middle Path', page: 45 },
        { title: 'פרק ב׳ - תיקון המידות', titleEn: 'Chapter 2 - Character Correction', page: 58 }
      ]
    },
    {
      id: 'chapter3',
      title: 'הלכות תלמוד תורה',
      titleEn: 'Laws of Torah Study',
      page: 78,
      sections: [
        { title: 'פרק א׳ - חיוב התלמוד', titleEn: 'Chapter 1 - Obligation to Study', page: 78 },
        { title: 'פרק ב׳ - כבוד הרב והתלמיד', titleEn: 'Chapter 2 - Honor of Teacher and Student', page: 92 }
      ]
    }
  ];

  const relatedBooks = [
    {
      id: 4,
      titleHebrew: 'ספר המצוות',
      titleEnglish: 'Book of Commandments',
      authorHebrew: 'רמב"ם',
      authorEnglish: 'Maimonides',
      yearPrinted: '1575',
      placePrinted: 'Venice'
    },
    {
      id: 5,
      titleHebrew: 'מורה נבוכים',
      titleEnglish: 'Guide for the Perplexed',
      authorHebrew: 'רמב"ם',
      authorEnglish: 'Maimonides',
      yearPrinted: '1553',
      placePrinted: 'Venice'
    }
  ];

  return (
    <div className={`fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-slate-200 shadow-lg transform transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:relative lg:transform-none lg:top-0`}>
      {/* Mobile Close Button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">Navigation</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'results' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Search className="h-4 w-4 mx-auto mb-1" />
          Results
        </button>
        <button
          onClick={() => setActiveTab('contents')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'contents' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <List className="h-4 w-4 mx-auto mb-1" />
          Contents
        </button>
        <button
          onClick={() => setActiveTab('related')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'related' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Book className="h-4 w-4 mx-auto mb-1" />
          Related
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Search Results Tab */}
        {activeTab === 'results' && (
          <div className="p-4 space-y-3">
            <h4 className="font-medium text-slate-900 mb-3">Search Results ({searchResults.length})</h4>
            {searchResults.map((resultBook) => (
              <div
                key={resultBook.id}
                onClick={() => onBookSelect(resultBook)}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${resultBook.id === book.id ? 'border-blue-300 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <h5 className="font-medium text-slate-900 text-sm mb-1" dir="auto">
                  {resultBook.titleHebrew}
                </h5>
                <p className="text-xs text-slate-600 mb-2">
                  {resultBook.titleEnglish}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span dir="auto">{resultBook.authorHebrew}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {resultBook.yearPrinted}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table of Contents Tab */}
        {activeTab === 'contents' && (
          <div className="p-4">
            <h4 className="font-medium text-slate-900 mb-3">Table of Contents</h4>
            <div className="space-y-2">
              {tableOfContents.map((chapter) => (
                <div key={chapter.id} className="border border-slate-200 rounded-lg">
                  <button
                    onClick={() => toggleSection(chapter.id)}
                    className="w-full p-3 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <h5 className="font-medium text-slate-900 text-sm" dir="auto">
                        {chapter.title}
                      </h5>
                      <p className="text-xs text-slate-600 mt-1">
                        {chapter.titleEn}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">p.{chapter.page}</span>
                      {expandedSections[chapter.id] ? 
                        <ChevronUp className="h-4 w-4 text-slate-400" /> : 
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      }
                    </div>
                  </button>
                  
                  {expandedSections[chapter.id] && (
                    <div className="border-t border-slate-200 bg-slate-50">
                      {chapter.sections.map((section, index) => (
                        <button
                          key={index}
                          className="w-full p-3 text-left hover:bg-slate-100 border-b border-slate-200 last:border-b-0 transition-colors"
                        >
                          <h6 className="text-sm text-slate-800" dir="auto">
                            {section.title}
                          </h6>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-slate-600">
                              {section.titleEn}
                            </p>
                            <span className="text-xs text-slate-500">p.{section.page}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Books Tab */}
        {activeTab === 'related' && (
          <div className="p-4 space-y-3">
            <h4 className="font-medium text-slate-900 mb-3">Related Books</h4>
            
            {/* Same Author */}
            <div className="mb-6">
              <h5 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Same Author
              </h5>
              {relatedBooks.map((relatedBook) => (
                <div
                  key={relatedBook.id}
                  onClick={() => onBookSelect(relatedBook)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-all hover:shadow-sm mb-2"
                >
                  <h6 className="font-medium text-slate-900 text-sm" dir="auto">
                    {relatedBook.titleHebrew}
                  </h6>
                  <p className="text-xs text-slate-600 mb-1">
                    {relatedBook.titleEnglish}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {relatedBook.yearPrinted}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {relatedBook.placePrinted}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Same Time Period */}
            <div>
              <h5 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Same Time Period (1570s)
              </h5>
              <div className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-all hover:shadow-sm">
                <h6 className="font-medium text-slate-900 text-sm" dir="auto">
                  בית יוסף
                </h6>
                <p className="text-xs text-slate-600 mb-1">
                  Beit Yosef
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>יוסף קארו</span>
                  <span>1571</span>
                  <span>Venice</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
