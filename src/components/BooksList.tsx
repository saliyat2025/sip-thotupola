'use client';

import React, { useState } from 'react';
import { Search, BookOpen, Library } from 'lucide-react';
import BookCard from '@/components/BookCard';

export default function BooksList({ initialBooks }: { initialBooks: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBooks = initialBooks.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="max-w-6xl mx-auto px-4 -mt-8 pb-20">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-12 group">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by book title or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-8 py-5 bg-white border border-slate-200 rounded-3xl shadow-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg pl-14"
                    />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                </div>
            </div>

            {filteredBooks.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                    <BookOpen className="mx-auto text-slate-300 mb-4" size={64} />
                    <h3 className="text-2xl font-bold text-slate-800">No books found</h3>
                    <p className="text-slate-500 mt-2">Try searching for a different title or subject.</p>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors"
                    >
                        Clear Search
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
}
