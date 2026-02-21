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

export interface StrapiSeo {
    id: number;
    metaTitle: string;
    metaDescription: string;
    shareImage?: StrapiImage;
}

export interface StrapiArticle {
    id: number;
    documentId: string;
    Title: string;
    Content: any;
    Description: string;
    slug: string;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    // Common names for image fields in Strapi
    Cover?: StrapiImage | { data: StrapiImage };
    Image?: StrapiImage | { data: StrapiImage };
    locale?: string;
    seoData?: StrapiSeo;
}

export interface StrapiGuide {
    id: number;
    documentId: string;
    Title: string;
    Content: any;
    Description?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    seoData?: StrapiSeo;
    locale?: string;
    // Relationships
    guide?: StrapiGuide | { data: StrapiGuide };
}

export interface StrapiFeaturedSection {
    id: number;
    documentId: string;
    Title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    locale?: string;
    RecommendedArticles?: StrapiArticle[] | { data: StrapiArticle[] };
}

export interface StrapiResponse<T> {
    data: T[];
}
