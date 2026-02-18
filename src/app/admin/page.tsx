'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { createCategory, createBook, updateCategory, deleteBook } from '@/app/actions';
import { FolderPlus, FilePlus, Trash2, Library, Pencil, X, ChevronRight, Layers, Lock, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

export default function AdminPage() {
    // --- AUTH STATE ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [passkey, setPasskey] = useState('');
    const [authError, setAuthError] = useState(false);

    // --- DATA STATE ---
    const [categories, setCategories] = useState<any[]>([]);
    const [recentBooks, setRecentBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Category Form States
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [formName, setFormName] = useState('');
    const [formParentId, setFormParentId] = useState('');

    // Book Form States
    const [bookTitle, setBookTitle] = useState('');
    const [bookMega, setBookMega] = useState('');
    const [bookCover, setBookCover] = useState('');
    const [bookCategoryId, setBookCategoryId] = useState('');
    const [bookTags, setBookTags] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Quick Parent Creation State
    const [isQuickCreatingParent, setIsQuickCreatingParent] = useState(false);
    const [quickParentName, setQuickParentName] = useState('');

    // --- AUTH HANDLER ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passkey === "3891") {
            setIsLoggedIn(true);
            setAuthError(false);
            // Optional: Save to localStorage for minor persistence
            localStorage.setItem('admin_auth', 'true');
        } else {
            setAuthError(true);
            setPasskey('');
        }
    };

    // Check for saved session
    useEffect(() => {
        const auth = localStorage.getItem('admin_auth');
        if (auth === 'true') setIsLoggedIn(true);
    }, []);

    // --- DATA FETCHING ---
    const fetchData = async () => {
        if (!isLoggedIn) return;
        setLoading(true);

        const { data: catData, error: catError } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (catError) console.error("Supabase Error (Categories):", catError);
        setCategories(catData || []);

        const { data: bookData, error: bookError } = await supabase
            .from('books')
            .select('*, categories(name)')
            .order('created_at', { ascending: false })
            .limit(10);

        if (bookError) console.error("Supabase Error (Books):", bookError);
        setRecentBooks(bookData || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [isLoggedIn]);

    // --- LOGIC HELPERS ---
    const getCategoryPath = (cat: any) => {
        let path = cat.name;
        let current = cat;
        let depth = 0;
        while (current.parent_id && depth < 5) {
            const parent = categories.find(c => c.id === current.parent_id);
            if (!parent) break;
            path = `${parent.name} > ${path}`;
            current = parent;
            depth++;
        }
        return path;
    };

    const sortedCategories = categories.map(cat => ({
        ...cat,
        label: getCategoryPath(cat)
    })).sort((a, b) => a.label.localeCompare(b.label));

    // --- ACTION HANDLERS ---
    const handleAction = async (actionFn: (formData: FormData) => Promise<any>, formData: FormData, type: 'category' | 'book') => {
        if (type === 'book') setIsUploading(true);

        const result = await actionFn(formData);

        if (result?.success) {
            await fetchData();
            if (type === 'category') {
                resetCategoryForm();
            } else {
                resetBookForm();
                setUploadSuccess(true);
                setTimeout(() => setUploadSuccess(false), 3000);
            }
        } else if (result?.error) {
            alert("Error: " + result.error);
        }

        if (type === 'book') setIsUploading(false);
    };

    const resetCategoryForm = () => {
        setEditingCategory(null);
        setFormName('');
        setFormParentId('');
    };

    const resetBookForm = () => {
        setBookTitle('');
        setBookMega('');
        setBookCover('');
        setBookCategoryId('');
        setBookTags('');
    };

    const startEditing = (category: any) => {
        setEditingCategory(category);
        setFormName(category.name);
        setFormParentId(category.parent_id?.toString() || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleQuickCreateParent = async () => {
        if (!quickParentName.trim()) return;
        const formData = new FormData();
        formData.append('name', quickParentName);
        formData.append('parent_id', '');
        const result = await createCategory(formData);
        if (result?.success) {
            const { data } = await supabase.from('categories').select('*');
            setCategories(data || []);
            const newCat = (data || []).find((c: any) => c.name === quickParentName);
            if (newCat) setFormParentId(newCat.id.toString());
            setIsQuickCreatingParent(false);
            setQuickParentName('');
        }
    };

    // --- LOGIN SCREEN ---
    if (!isLoggedIn) {
        return (
            <main className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-6">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-slate-400 mb-8">Enter passkey to access the dashboard</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <input
                                type="password"
                                value={passkey}
                                onChange={(e) => setPasskey(e.target.value)}
                                placeholder="Enter passkey..."
                                className={`w-full px-6 py-4 bg-[#0f172a] border ${authError ? 'border-rose-500' : 'border-slate-700'} rounded-2xl outline-none text-center text-2xl tracking-widest text-white focus:ring-2 focus:ring-blue-500 transition-all`}
                            />
                            {authError && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500" size={20} />}
                        </div>
                        {authError && <p className="text-rose-500 text-sm">Invalid passkey. Please try again.</p>}
                        <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95">
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0f172a] text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-12">

                <div className="flex justify-between items-center bg-[#1e293b] p-6 rounded-3xl border border-slate-800">
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            Sip Thotupola Admin
                        </h1>
                        <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                            <Layers size={14} />
                            {categories.length} Folders organized
                        </p>
                    </div>
                    <button
                        onClick={() => { localStorage.removeItem('admin_auth'); setIsLoggedIn(false); }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-all border border-slate-700"
                    >
                        Sign Out
                    </button>
                </div>

                {uploadSuccess && (
                    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
                        <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold">
                            <CheckCircle2 size={20} />
                            Book uploaded successfully!
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* --- CATEGORY MANAGER --- */}
                    <section className="bg-[#1e293b] p-8 rounded-2xl border border-slate-800 shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                                {editingCategory ? <Pencil size={20} /> : <FolderPlus size={20} />}
                            </div>
                            {editingCategory ? 'Edit Category' : 'Category Manager'}
                        </h2>

                        <form action={(fd) => handleAction(editingCategory ? updateCategory : createCategory, fd, 'category')} className="space-y-5">
                            {editingCategory && <input type="hidden" name="id" value={editingCategory.id} />}

                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Category Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="e.g., Grade 10"
                                    className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-slate-300">Parent Category</label>
                                    {!editingCategory && !isQuickCreatingParent && (
                                        <button type="button" onClick={() => setIsQuickCreatingParent(true)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded">
                                            <FolderPlus size={12} /> New Parent
                                        </button>
                                    )}
                                </div>

                                {isQuickCreatingParent ? (
                                    <div className="flex gap-2 animate-in fade-in">
                                        <input
                                            autoFocus
                                            value={quickParentName}
                                            onChange={(e) => setQuickParentName(e.target.value)}
                                            placeholder="New Parent Name..."
                                            className="flex-1 px-4 py-2 bg-[#0f172a] border border-blue-500/50 rounded-xl outline-none"
                                        />
                                        <button type="button" onClick={handleQuickCreateParent} className="bg-blue-600 text-white px-3 rounded-xl">Save</button>
                                        <button type="button" onClick={() => setIsQuickCreatingParent(false)} className="bg-slate-700 text-white px-3 rounded-xl"><X size={16} /></button>
                                    </div>
                                ) : (
                                    <select
                                        name="parent_id"
                                        value={formParentId}
                                        onChange={(e) => setFormParentId(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:border-blue-500 outline-none"
                                    >
                                        <option value="">None (Root Category)</option>
                                        {sortedCategories
                                            .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                                            .map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.label}
                                                </option>
                                            ))}
                                    </select>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg">
                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                </button>
                                {editingCategory && (
                                    <button type="button" onClick={resetCategoryForm} className="px-4 bg-slate-700 text-white rounded-xl">Cancel</button>
                                )}
                            </div>
                        </form>
                    </section>

                    {/* --- BOOK UPLOADER --- */}
                    <section className="bg-[#1e293b] p-8 rounded-2xl border border-slate-800 shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                                <FilePlus size={20} />
                            </div>
                            Book Uploader
                        </h2>

                        <form action={(fd) => handleAction(createBook, fd, 'book')} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Book Title</label>
                                <input
                                    name="title"
                                    required
                                    value={bookTitle}
                                    onChange={(e) => setBookTitle(e.target.value)}
                                    placeholder="e.g., Science Textbook"
                                    className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Mega.nz Link</label>
                                <input
                                    name="mega_link"
                                    required
                                    value={bookMega}
                                    onChange={(e) => setBookMega(e.target.value)}
                                    placeholder="https://mega.nz/..."
                                    className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Cover Image URL (Optional)</label>
                                <input
                                    name="cover_image"
                                    value={bookCover}
                                    onChange={(e) => setBookCover(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Select Category</label>
                                <select
                                    name="category_id"
                                    required
                                    value={bookCategoryId}
                                    onChange={(e) => setBookCategoryId(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:border-emerald-500 outline-none"
                                >
                                    <option value="">Select a folder...</option>
                                    {sortedCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Tags (Keywords)</label>
                                <input
                                    name="tags"
                                    value={bookTags}
                                    onChange={(e) => setBookTags(e.target.value)}
                                    placeholder="e.g. 2023, Past Papers, English Medium"
                                    className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:border-emerald-500 outline-none"
                                />
                                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">Separate with commas</p>
                            </div>
                            <button
                                type="submit"
                                disabled={isUploading}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                            >
                                {isUploading ? <Loader2 className="animate-spin" size={20} /> : 'Upload Book'}
                            </button>
                        </form>
                    </section>
                </div>

                {/* --- TABLES --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-6">Manage Categories</h2>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {sortedCategories.map((cat) => (
                                <div key={cat.id} className="p-4 bg-[#0f172a] rounded-xl border border-slate-700 flex justify-between items-center group">
                                    <div className="truncate">
                                        <div className="font-medium text-white truncate">{cat.name}</div>
                                        <div className="text-xs text-slate-500 truncate">{cat.label}</div>
                                    </div>
                                    <button onClick={() => startEditing(cat)} className="p-2 text-slate-400 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Pencil size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-6">Recent Uploads</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-slate-300">
                                <thead className="text-xs uppercase bg-[#0f172a] text-slate-500">
                                    <tr>
                                        <th className="px-6 py-3">Title</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {recentBooks.map((book) => (
                                        <tr key={book.id} className="hover:bg-slate-800/50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{book.title}</div>
                                                <div className="text-xs text-slate-500">{book.categories?.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <form action={(fd) => handleAction(deleteBook, fd, 'book')}>
                                                    <input type="hidden" name="id" value={book.id} />
                                                    <button type="submit" className="text-rose-500 hover:text-rose-400 p-2"><Trash2 size={18} /></button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}

function Loader2({ className, size }: { className?: string, size?: number }) {
    return <Library className={`${className}`} size={size} />;
}
