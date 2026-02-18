'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// 1. Create Category Action
export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string;
    const parent_id = formData.get('parent_id') as string;

    console.log('Attempting to create category:', { name, parent_id });

    const { data, error } = await supabase
        .from('categories')
        .insert([
            {
                name,
                // Convert empty string to NULL, otherwise parse as Int
                parent_id: parent_id && parent_id !== "" ? parseInt(parent_id) : null
            }
        ])
        .select();

    if (error) {
        console.error('Error creating category:', error);
        return { error: error.message };
    }

    console.log('✅ Created Category Success:', data);
    revalidatePath('/admin');
    return { success: true };
}

// 2. Update Category Action
export async function updateCategory(formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const parent_id = formData.get('parent_id') as string;

    const { error } = await supabase
        .from('categories')
        .update({
            name,
            parent_id: parent_id && parent_id !== "" ? parseInt(parent_id) : null
        })
        .eq('id', parseInt(id));

    if (error) {
        console.error('Error updating category:', error);
        return { error: error.message };
    }

    revalidatePath('/admin');
    return { success: true };
}

// 3. Create Book Action
export async function createBook(formData: FormData) {
    const title = formData.get('title') as string;
    const mega_link = formData.get('mega_link') as string;
    const cover_image = formData.get('cover_image') as string;
    const category_id = formData.get('category_id') as string;
    const tagsRaw = formData.get('tags') as string;

    // Convert comma-separated string to array
    const tags = tagsRaw
        ? tagsRaw.split(',').map((t: string) => t.trim()).filter((t: string) => t !== "")
        : [];

    console.log('Attempting to upload book:', { title, category_id, tags });

    const { error } = await supabase
        .from('books')
        .insert([
            {
                title,
                mega_link,
                cover_image: cover_image || null,
                category_id: parseInt(category_id),
                tags: tags
            }
        ]);

    if (error) {
        console.error('Error creating book:', error);
        return { error: error.message };
    }

    console.log('✅ Book Upload Success');
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
}

// 4. Update Book Action
export async function updateBook(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const mega_link = formData.get('mega_link') as string;
    const cover_image = formData.get('cover_image') as string;
    const category_id = formData.get('category_id') as string;
    const tagsRaw = formData.get('tags') as string;

    const tags = tagsRaw
        ? tagsRaw.split(',').map((t: string) => t.trim()).filter((t: string) => t !== "")
        : [];

    const { error } = await supabase
        .from('books')
        .update({
            title,
            mega_link,
            cover_image: cover_image || null,
            category_id: parseInt(category_id),
            tags: tags
        })
        .eq('id', parseInt(id));

    if (error) {
        console.error('Error updating book:', error);
        return { error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
}

// 4. Delete Book Action
export async function deleteBook(formData: FormData) {
    const id = formData.get('id') as string;

    const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', parseInt(id));

    if (error) {
        console.error('Error deleting book:', error);
        return { error: error.message };
    }

    revalidatePath('/admin');
    return { success: true };
}
