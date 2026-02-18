import { supabase } from '@/lib/supabase';
import { Library } from 'lucide-react';
import Link from 'next/link';
import BooksList from '@/components/BooksList';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BooksPage() {
    const { data, error } = await supabase
        .from('books')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });

    if (error) console.error("Error fetching books:", error);
    const books = data || [];

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header / Hero */}
            <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12 px-4 shadow-lg">
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
                    <Link href="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
                        <Library className="text-blue-300" size={28} />
                        <span className="text-2xl font-black tracking-tight uppercase">Sip Thotupola</span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Complete Library Catalog</h1>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        Discover and download thousands of educational resources across all grades and subjects.
                    </p>
                </div>
            </header>

            <main>
                <BooksList initialBooks={books} />
            </main>

            {/* Simple Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 px-4 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2 text-white font-black text-2xl uppercase tracking-tighter">
                        <Library className="text-blue-400" />
                        Sip Thotupola
                    </div>
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Sip Thotupola. Digital Library for Free Education.
                    </p>
                    <div className="flex gap-6 text-sm font-semibold">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <Link href="/about" className="hover:text-white transition-colors">About</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
