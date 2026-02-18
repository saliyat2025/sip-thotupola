import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BookOpen, Folder, ArrowRight, Library, GraduationCap } from 'lucide-react';
import SearchableBookList from '@/components/SearchableBookList';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
    // 1. Fetch the "Novels/Short Stories" category ID dynamically
    const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .or('name.eq.නවකතා/කෙටිකතා,name.ilike.%Novels%')
        .limit(1);

    const novelsCatId = catData && catData.length > 0 ? catData[0].id : null;

    // 2. Fetch Root Categories (parent_id is null) - Also exclude Novels from root if it is one
    const { data: rootCategories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .neq('id', novelsCatId || 0)
        .order('name');

    // 3. Fetch ALL Books EXCEPT those in the "Novels" category
    const { data: allBooks, error: bookError } = await supabase
        .from('books')
        .select('*, categories(name)')
        .neq('category_id', novelsCatId || 0)
        .order('created_at', { ascending: false });

    // Debugging Logs
    if (catError) console.error("Home Page - Category Fetch Error:", catError);
    if (bookError) console.error("Home Page - Book Fetch Error:", bookError);

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 text-white py-20 px-4">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 transform -rotate-12">
                        <BookOpen size={120} />
                    </div>
                    <div className="absolute bottom-10 right-10 transform rotate-12">
                        <GraduationCap size={150} />
                    </div>
                </div>

                <div className="max-w-6xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-cyan-50">
                        <Library size={18} />
                        <span className="text-sm font-medium tracking-wide uppercase">Open Educational Resources</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                        Sip Thotupola <span className="text-cyan-300">සිප් තොටුපළ</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-cyan-50 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
                        Explore a world of knowledge. Your gateway to free academic resources, textbooks, and digital learning materials.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a href="#library" className="px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl shadow-xl hover:bg-cyan-50 transition-all flex items-center gap-2 group">
                            Explore Library
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <Link href="/novels" className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-xl hover:bg-emerald-600 transition-all flex items-center gap-2 group">
                            📚 Novels & Short Stories
                        </Link>
                    </div>
                </div>

                {/* Decorative Wave */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 fill-[#f8fafc]">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                    </svg>
                </div>
            </section>

            <main className="max-w-6xl mx-auto px-4 py-16">
                {/* Categories Section */}
                <section id="categories" className="mb-24">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Folder size={24} />
                                </div>
                                Study Areas
                            </h2>
                            <p className="text-slate-500 mt-2">Browse our collection by subject and category</p>
                        </div>
                    </div>

                    {!rootCategories || rootCategories.length === 0 ? (
                        <div className="p-12 bg-white rounded-3xl border border-dashed border-slate-300 text-center">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No Categories Found</h3>
                            <Link href="/admin" className="text-blue-600 font-bold hover:underline">Go to Admin Panel</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {rootCategories?.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/category/${cat.id}`}
                                    className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-blue-300 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="absolute -right-4 -bottom-4 text-blue-50 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                                        <Folder size={120} strokeWidth={1} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
                                            <Folder size={24} fill="currentColor" fillOpacity={0.3} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-1">{cat.name}</h3>
                                        <p className="text-slate-400 text-sm flex items-center gap-1">
                                            Explore Resources
                                            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* Library Catalog Section */}
                <section id="library">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <BookOpen size={24} />
                                </div>
                                Digital Library Catalog
                            </h2>
                            <p className="text-slate-500 mt-2">Search through our complete collection of resources</p>
                        </div>
                        <Link href="/books" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                            Browse Full Catalog
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    <SearchableBookList initialBooks={allBooks || []} />
                </section>
            </main>

            {/* Simple Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 px-4 mt-20">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2 text-white font-black text-2xl uppercase">
                        <Library className="text-cyan-400" />
                        Sip Thotupola
                    </div>
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Sip Thotupola. Empowering generations through digital literacy.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
