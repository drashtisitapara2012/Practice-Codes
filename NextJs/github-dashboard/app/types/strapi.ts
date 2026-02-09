export interface StrapiImage {
    id: number;
    name: string;
    url: string;
    alternativeText?: string;
    formats?: {
        thumbnail?: { url: string };
        small?: { url: string };
        medium?: { url: string };
        large?: { url: string };
    };
}

export interface StrapiArticle {
    id: number;
    documentId: string;
    Title: string;
    Content: any;
    Description: string;
    slug: string;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    // Common names for image fields in Strapi
    Cover?: StrapiImage | { data: StrapiImage };
    Image?: StrapiImage | { data: StrapiImage };
}

export interface StrapiResponse<T> {
    data: T[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}
