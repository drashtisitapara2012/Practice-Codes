'use server';

import { revalidatePath } from 'next/cache';

const STRAPI_URL = process.env.STRAPI_API_URL || 'http://127.0.0.1:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Creates a new article in Strapi, including optional image upload.
 */
export async function createArticleAction(formData: FormData) {
    try {
        const title = formData.get('Title') as string;
        const description = formData.get('Description') as string;
        const content = formData.get('Content') as string;
        const slug = formData.get('slug') as string;
        const imageFile = formData.get('Image') as File;

        // Prepare the data JSON
        const data = {
            Title: title,
            Description: description,
            slug: slug,
            Content: [
                {
                    type: 'paragraph',
                    children: [{ type: 'text', text: content }],
                },
            ],
        };

        const uploadFormData = new FormData();
        uploadFormData.append('data', JSON.stringify(data));

        // If there's an image, add it to the 'files.Image' field
        if (imageFile && imageFile.size > 0) {
            uploadFormData.append('files.Image', imageFile);
        }

        const response = await fetch(`${STRAPI_URL}/api/articles`, {
            method: 'POST',
            headers: {
                ...(STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {}),
            },
            body: uploadFormData, // fetch handles multipart boundary automatically for FormData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to create article');
        }

        revalidatePath('/articles');
        return { success: true };
    } catch (error: any) {
        console.error('Create Action Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Updates an existing article in Strapi.
 */
export async function updateArticleAction(documentId: string, formData: FormData) {
    try {
        const title = formData.get('Title') as string;
        const description = formData.get('Description') as string;
        const content = formData.get('Content') as string;
        const slug = formData.get('slug') as string;
        const imageFile = formData.get('Image') as File;

        const data: any = {
            Title: title,
            Description: description,
            slug: slug,
        };

        // If content is provided, format it
        if (content) {
            data.Content = [
                {
                    type: 'paragraph',
                    children: [{ type: 'text', text: content }],
                },
            ];
        }

        const uploadFormData = new FormData();
        uploadFormData.append('data', JSON.stringify(data));

        if (imageFile && imageFile.size > 0) {
            uploadFormData.append('files.Image', imageFile);
        }

        const response = await fetch(`${STRAPI_URL}/api/articles/${documentId}`, {
            method: 'PUT',
            headers: {
                ...(STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {}),
            },
            body: uploadFormData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to update article');
        }

        revalidatePath('/articles');
        revalidatePath(`/articles/${slug}`);
        return { success: true };
    } catch (error: any) {
        console.error('Update Action Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Deletes an article from Strapi.
 */
export async function deleteArticleAction(documentId: string) {
    try {
        const response = await fetch(`${STRAPI_URL}/api/articles/${documentId}`, {
            method: 'DELETE',
            headers: {
                ...(STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {}),
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to delete article');
        }

        revalidatePath('/articles');
        return { success: true };
    } catch (error: any) {
        console.error('Delete Action Error:', error);
        return { success: false, error: error.message };
    }
}
