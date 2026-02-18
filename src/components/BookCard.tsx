'use client';

import React from 'react';
import { Download } from 'lucide-react';
import BookCover from './BookCover';
import { DownloadButton } from './DownloadButton';

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

export default function BookCard({ book }: { book: Book }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all flex flex-col group border-b-4 border-b-transparent hover:border-b-emerald-500 shadow-sm">
            <div className="h-52 bg-slate-50 relative flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
                <BookCover
                    src={book.cover_image}
                    title={book.title}
                    className="w-full h-full drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm border border-emerald-50">
                        {book.categories?.name || "Textbook"}
                    </span>
                </div>
            </div>

            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 line-clamp-2 h-14 mb-2 group-hover:text-emerald-600 transition-colors">
                    {book.title}
                </h3>

                {book.tags && book.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {book.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-full uppercase tracking-wider border border-slate-200/50"
                            >
                                {tag}
                            </span>
                        ))}
                        {book.tags.length > 3 && (
                            <span className="text-[9px] font-bold text-slate-400 mt-0.5">+{book.tags.length - 3}</span>
                        )}
                    </div>
                )}

                <div className="mt-auto">
                    <DownloadButton targetUrl={book.mega_link} />
                </div>
            </div>
        </div>
    );
}
