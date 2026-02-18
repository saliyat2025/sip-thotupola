import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BookOpen, ArrowLeft, Library } from 'lucide-react';
import SearchableBookList from '@/components/SearchableBookList';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NovelsPage() {
    // 1. Fetch the "Novels/Short Stories" category ID dynamically
    const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .or('name.eq.නවකතා/කෙටිකතා,name.ilike.%Novels%')
        .limit(1);

    const novelsCatId = catData && catData.length > 0 ? catData[0].id : null;

    // 2. Fetch books belonging to this category
    const { data: novelsBooks, error: bookError } = await supabase
        .from('books')
        .select('*, categories(name)')
        .eq('category_id', novelsCatId || 0) // Fallback to 0 if not found
        .order('created_at', { ascending: false });

    if (bookError) console.error("Novels Page - Book Fetch Error:", bookError);

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header / Hero */}
            <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-12 px-4">
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-purple-100 hover:text-white mb-6 transition-colors self-start">
                        <ArrowLeft size={18} />
                        Back to Academic Library
                    </Link>

                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-purple-50">
                        <BookOpen size={18} />
                        <span className="text-sm font-medium tracking-wide uppercase">Leisure Reading</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        Novels & Short Stories <span className="text-purple-300">නවකතා සහ කෙටිකතා</span>
                    </h1>
                    <p className="text-lg text-purple-50 max-w-2xl mx-auto leading-relaxed font-light">
                        Enjoy our collection of fictional works, novels, and short stories for your leisure time.
                    </p>
                </div>
            </section>

            <main className="max-w-6xl mx-auto px-4 py-12">
                <SearchableBookList initialBooks={novelsBooks || []} />
            </main>

            {/* Simple Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 px-4 mt-20">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2 text-white font-black text-2xl uppercase">
                        <Library className="text-purple-400" />
                        Sip Thotupola
                    </div>
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Sip Thotupola. Explore and Enjoy.
                    </p>
                </div>
            </footer>
        </div>
    );
}
