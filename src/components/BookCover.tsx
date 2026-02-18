'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface BookCoverProps {
    src?: string;
    title: string;
    className?: string;
}

export default function BookCover({ src, title, className = "" }: BookCoverProps) {
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div className={`flex flex-col items-center justify-center bg-slate-200 text-slate-400 gap-2 ${className}`}>
                <BookOpen size={48} strokeWidth={1} />
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">No Preview</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={title}
            onError={() => setError(true)}
            className={`object-contain transition-transform duration-500 ${className}`}
        />
    );
}
