import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
    name: string;
    id: string | null;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
                <Home size={16} className="mr-1" />
                Home
            </Link>

            {items.map((item, index) => (
                <React.Fragment key={item.id || index}>
                    <ChevronRight size={14} className="flex-shrink-0" />
                    <Link
                        href={item.id ? `/category/${item.id}` : '#'}
                        className={`hover:text-blue-600 transition-colors ${index === items.length - 1 ? 'text-slate-900 font-semibold' : ''
                            }`}
                    >
                        {item.name}
                    </Link>
                </React.Fragment>
            ))}
        </nav>
    );
};
