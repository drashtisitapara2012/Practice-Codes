'use server';

import { revalidatePath } from 'next/cache';

const STRAPI_URL = process.env.STRAPI_API_URL || 'http://127.0.0.1:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Creates a new article in Strapi.
 */
export async function createArticleAction(formData: FormData) {
    try {
        const title = formData.get('Title') as string;
        const description = formData.get('Description') as string;
        const content = formData.get('Content') as string;
        const slug = formData.get('slug') as string;
        const imageFile = formData.get('Image');

        // Prepare the internal attributes
        const attributes = {
            Title: title || '',
            Description: description || '',
            slug: slug || '',
            Content: [
                {
                    type: 'paragraph',
                    children: [{ type: 'text', text: content || '' }],
                },
            ],
        };

        // Determine if we have a valid file to upload
        const hasImage = imageFile instanceof File && imageFile.size > 0;

        let response;
        const headers: any = {
            ...(STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {}),
        };

        if (hasImage) {
            // MULTIPART - Required for file uploads
            const uploadFormData = new FormData();
            // Strapi expects the text data in a 'data' field as a JSON string
            uploadFormData.append('data', JSON.stringify(attributes));
            // Strapi expects the file in 'files.FIELD_NAME'
            uploadFormData.append('files.Image', imageFile);

            response = await fetch(`${STRAPI_URL}/api/articles`, {
                method: 'POST',
                headers,
                body: uploadFormData, // fetch sets the boundary automatically
            });
        } else {
            // JSON - Much safer for simple text updates
            response = await fetch(`${STRAPI_URL}/api/articles`, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: attributes }),
            });
        }

        if (!response.ok) {
            const errorRaw = await response.text();
            let errorData;
            try { errorData = JSON.parse(errorRaw); } catch { errorData = { error: { message: errorRaw } }; }

            console.error('Strapi Error:', JSON.stringify(errorData, null, 2));
            throw new Error(errorData.error?.message || 'Failed to create article');
        }

        revalidatePath('/articles');
        return { success: true };
    } catch (error: any) {
        console.error('Action Exception:', error);
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
        const imageFile = formData.get('Image');

        const attributes: any = {
            Title: title || '',
            Description: description || '',
            slug: slug || '',
        };

        if (content !== undefined) {
            attributes.Content = [
                {
                    type: 'paragraph',
                    children: [{ type: 'text', text: content || '' }],
                },
            ];
        }

        const hasImage = imageFile instanceof File && imageFile.size > 0;

        let response;
        const headers: any = {
            ...(STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {}),
        };

        if (hasImage) {
            const uploadFormData = new FormData();
            uploadFormData.append('data', JSON.stringify(attributes));
            uploadFormData.append('files.Image', imageFile);

            response = await fetch(`${STRAPI_URL}/api/articles/${documentId}`, {
                method: 'PUT',
                headers,
                body: uploadFormData,
            });
        } else {
            response = await fetch(`${STRAPI_URL}/api/articles/${documentId}`, {
                method: 'PUT',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: attributes }),
            });
        }

        if (!response.ok) {
            const errorRaw = await response.text();
            let errorData;
            try { errorData = JSON.parse(errorRaw); } catch { errorData = { error: { message: errorRaw } }; }

            console.error('Strapi Error:', JSON.stringify(errorData, null, 2));
            throw new Error(errorData.error?.message || 'Failed to update article');
        }

        revalidatePath('/articles');
        revalidatePath(`/articles/${slug}`);
        return { success: true };
    } catch (error: any) {
        console.error('Action Exception:', error);
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
