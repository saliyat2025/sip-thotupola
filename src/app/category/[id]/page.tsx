import { supabase } from '@/lib/supabase';
import { CategoryView } from '@/components/CategoryView';
import { Breadcrumbs, BreadcrumbItem } from '@/components/Breadcrumbs';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryPageProps {
    params: {
        id: string;
    };
}

// Logic to fetch breadcrumbs recursively (Server-side)
async function getBreadcrumbs(categoryId: string): Promise<BreadcrumbItem[]> {
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentId: string | null = categoryId;

    while (currentId) {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name, parent_id')
            .eq('id', currentId)
            .single();

        if (error || !data) break;

        const category = data as { id: any, name: string, parent_id: any };
        breadcrumbs.unshift({ name: category.name, id: category.id.toString() });
        currentId = category.parent_id ? category.parent_id.toString() : null;
    }

    return breadcrumbs;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { id } = params;

    // 1. Fetch current category details
    const { data: currentCategory, error: catFetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

    if (catFetchError || !currentCategory) {
        notFound();
    }

    // 2. Fetch subcategories
    const { data: subCategories } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', id)
        .order('name');

    // 3. Fetch books in this category
    const { data: books } = await supabase
        .from('books')
        .select('*')
        .eq('category_id', id)
        .order('title');

    // 4. Fetch breadcrumbs
    const breadcrumbs = await getBreadcrumbs(id);

    return (
        <main className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -z-10" />
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-emerald-100/20 rounded-full blur-3xl -z-10" />

            <div className="max-w-4xl mx-auto space-y-8">
                <header className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            {currentCategory.name}
                        </h1>
                        <div className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">
                            {books?.length || 0} Resources
                        </div>
                    </div>
                    <Breadcrumbs items={breadcrumbs} />
                </header>

                <div className="pb-20">
                    <CategoryView
                        categories={subCategories || []}
                        books={books || []}
                    />
                </div>
            </div>
        </main>
    );
}
