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
        const locale = formData.get('locale') as string || 'en';  // Get locale from form
        const imageFile = formData.get('Image');

        // Prepare the internal attributes (locale goes in URL, not here)
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

            // Add locale as query parameter
            response = await fetch(`${STRAPI_URL}/api/articles?locale=${locale}`, {
                method: 'POST',
                headers,
                body: uploadFormData, // fetch sets the boundary automatically
            });
        } else {
            // JSON - Much safer for simple text updates
            // Add locale as query parameter
            response = await fetch(`${STRAPI_URL}/api/articles?locale=${locale}`, {
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
        const locale = formData.get('locale') as string || 'en';  // Get locale from form
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

            // Add locale as query parameter
            response = await fetch(`${STRAPI_URL}/api/articles/${documentId}?locale=${locale}`, {
                method: 'PUT',
                headers,
                body: uploadFormData,
            });
        } else {
            // Add locale as query parameter
            response = await fetch(`${STRAPI_URL}/api/articles/${documentId}?locale=${locale}`, {
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

export async function deleteArticleAction(documentId: string, locale?: string) {
    try {
        // Include locale in delete request if provided
        const url = locale
            ? `${STRAPI_URL}/api/articles/${documentId}?locale=${locale}`
            : `${STRAPI_URL}/api/articles/${documentId}`;

        const response = await fetch(url, {
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

/**
 * Publishes an article in Strapi.
 */
export async function publishArticleAction(documentId: string, slug: string) {
    try {
        const baseUrl = STRAPI_URL?.replace(/\/+$/, '');
        const publishUrl = `${baseUrl}/api/articles/${documentId}/publish`;

        console.log(`[Publish Action] Attempting POST: ${publishUrl}`);

        let response = await fetch(publishUrl, {  //Strapi, take the current draft and publish it properly. Calls built-in publish endpoint.
            method: 'POST',
            headers: {
                ...(STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {}),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        // Fallback if POST /publish is not supported (405) or not found (404)
        if (response.status === 405 || response.status === 404) {
            console.warn(`[Publish Action] POST /publish failed with ${response.status}. Attempting fallback PUT...`);
            const updateUrl = `${baseUrl}/api/articles/${documentId}`;
            console.log(`[Publish Action] Attempting PUT fallback: ${updateUrl}`);

            response = await fetch(updateUrl, {  //So setting publishedAt manually forces publication.
                method: 'PUT',
                headers: {
                    ...(STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {}),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        publishedAt: new Date().toISOString(),
                    }
                }),
            });
        }

        if (!response.ok) {
            const errorRaw = await response.text();
            console.error(`[Publish Action] Server responded with error ${response.status}:`, errorRaw);

            let errorData;
            try {
                errorData = JSON.parse(errorRaw);
            } catch {
                errorData = { error: { message: errorRaw } };
            }

            const message = errorData.error?.message || `Error ${response.status}: ${response.statusText}`;
            throw new Error(message);
        }

        console.log(`[Publish Action] Successfully published ${slug}`);

        revalidatePath('/articles');
        revalidatePath(`/articles/${slug}`);
        revalidatePath(`/articles/preview/${slug}`);

        return { success: true };
    } catch (error: any) {
        console.error('[Publish Action] Critical Exception:', error);
        return { success: false, error: error.message };
    }
}
