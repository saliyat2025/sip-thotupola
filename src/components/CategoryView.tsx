'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Folder, FileText, ChevronRight, Search, X } from 'lucide-react';
import { DownloadButton } from './DownloadButton';

export interface Category {
    id: string;
    name: string;
    parent_id: string | null;
}

export interface Book {
    id: string;
    title: string;
    mega_link: string;
    category_id: string;
    tags?: string[];
}

interface CategoryViewProps {
    categories: Category[];
    books: Book[];
}

export const CategoryView: React.FC<CategoryViewProps> = ({ categories, books }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBooks = books.filter(book => {
        const query = searchQuery.toLowerCase();
        const titleMatch = book.title.toLowerCase().includes(query);
        const tagMatch = book.tags?.some(tag => tag.toLowerCase().includes(query));
        return titleMatch || tagMatch;
    });

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search by title or tags (e.g. 2023, science)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-12 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                    {/* Categories (Folders) - Only show if no search query */}
                    {!searchQuery && categories.length > 0 && categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.id}`}
                            className="flex items-center p-5 hover:bg-slate-50 group transition-colors"
                        >
                            <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mr-4 transition-colors">
                                <Folder size={24} />
                            </div>
                            <div className="flex-1">
                                <span className="text-slate-800 font-bold group-hover:text-blue-600 transition-colors">
                                    {cat.name}
                                </span>
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-colors" size={20} />
                        </Link>
                    ))}

                    {/* Books (Files) */}
                    {filteredBooks.length > 0 ? filteredBooks.map((book) => (
                        <div
                            key={book.id}
                            className="flex items-center p-5 hover:bg-slate-50 transition-colors justify-between flex-wrap gap-4"
                        >
                            <div className="flex items-center min-w-0 flex-1">
                                <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mr-4 shrink-0">
                                    <FileText size={24} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-slate-800 font-bold truncate">
                                        {book.title}
                                    </span>
                                    {book.tags && book.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {book.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider border border-slate-200/50"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <DownloadButton targetUrl={book.mega_link} />
                        </div>
                    )) : (
                        (searchQuery || categories.length === 0) && (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                                    <Search size={32} />
                                </div>
                                <p className="text-slate-400 font-medium">
                                    {searchQuery ? `No results found for "${searchQuery}"` : "This folder is empty."}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
