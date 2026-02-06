'use server';

import { revalidatePath } from 'next/cache';
import { dataApi } from '@/lib/api/posts';

export async function createPostAction(formData: { title: string; description: string; userId: string }) {
    try {
        const newPost = await dataApi.createItem(formData);
        // Invalidate the dashboard path to refresh server components
        revalidatePath('/dashboard');
        return { success: true, post: newPost };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updatePostAction(id: string, formData: { title: string; description: string }) {
    try {
        const updatedPost = await dataApi.updateItem(id, formData);
        revalidatePath('/dashboard');
        return { success: true, post: updatedPost };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deletePostAction(id: string) {
    try {
        await dataApi.deleteItem(id);
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function refreshPostsAction() {
    revalidatePath('/dashboard');
    return { success: true };
}
