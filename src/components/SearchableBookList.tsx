'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { DownloadButton } from './DownloadButton';
import BookCover from './BookCover';

interface Book {
    id: string;
    title: string;
    mega_link: string;
    cover_image?: string;
    categories?: {
        name: string;
    };
    tags?: string[];
}

interface SearchableBookListProps {
    initialBooks: Book[];
}

export default function SearchableBookList({ initialBooks }: SearchableBookListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const filteredBooks = useMemo(() => {
        return initialBooks.filter(book => {
            const searchLower = searchTerm.toLowerCase();
            const matchesTitle = book.title.toLowerCase().includes(searchLower);
            const matchesCategory = book.categories?.name.toLowerCase().includes(searchLower);
            return matchesTitle || matchesCategory;
        });
    }, [initialBooks, searchTerm]);

    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

    // Reset to page 1 when searching
    useMemo(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const displayedBooks = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredBooks.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBooks, currentPage]);

    return (
        <div className="space-y-8">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
                <input
                    type="text"
                    placeholder="Search by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-14"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between text-sm text-slate-500 px-2">
                <p>Showing {filteredBooks.length} books</p>
                {totalPages > 1 && (
                    <p>Page {currentPage} of {totalPages}</p>
                )}
            </div>

            {/* Book Grid */}
            {displayedBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedBooks.map((book) => (
                        <div
                            key={book.id}
                            className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all flex flex-col group border-b-4 border-b-transparent hover:border-b-blue-500 shadow-sm"
                        >
                            {/* Book Cover with Fallback */}
                            <div className="h-56 bg-slate-50 relative flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
                                <BookCover
                                    src={book.cover_image}
                                    title={book.title}
                                    className="w-full h-full drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm border border-blue-50">
                                        {book.categories?.name || "General"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors leading-snug">
                                    {book.title}
                                </h3>

                                <div className="mt-auto pt-4 border-t border-slate-50">
                                    <DownloadButton targetUrl={book.mega_link} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                    <Search className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No books found</h3>
                    <p className="text-slate-500">Try adjusting your search terms</p>
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-8">
                    {currentPage > 1 && (
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="p-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1"
                        >
                            <ChevronLeft size={20} />
                            <span className="hidden sm:inline">Prev</span>
                        </button>
                    )}

                    <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === pageNum
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            } else if (
                                (pageNum === 2 && currentPage > 3) ||
                                (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                            ) {
                                return <span key={pageNum} className="px-1 text-slate-400">...</span>;
                            }
                            return null;
                        })}
                    </div>

                    {currentPage < totalPages && (
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="p-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
