'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { updateArticleAction } from '@/app/lib/actions/strapi';
import { getArticleBySlugClient, getStrapiMedia } from '@/app/lib/api/strapi-client';
import { ChevronLeft, Save, AlertCircle, CheckCircle2, Loader2, Upload, X } from 'lucide-react';
import ThemeToggle from '@/app/components/ThemeToggle';
import Image from 'next/image';

export default function EditArticlePage() {
    const router = useRouter();
    const { slug: currentSlug } = useParams<{ slug: string }>();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [documentId, setDocumentId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        Title: '',
        Description: '',
        Content: '',
        slug: '',
        Image: null as File | null,
    });

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const article = await getArticleBySlugClient(currentSlug);
                if (article) {
                    setDocumentId(article.documentId);
                    setFormData({
                        Title: article.Title,
                        Description: article.Description,
                        Content: typeof article.Content === 'string' ? article.Content : '',
                        slug: article.slug,
                        Image: null,
                    });

                    const imageData = (article.Image as any)?.data || article.Image;
                    if (imageData?.url) {
                        setImagePreview(getStrapiMedia(imageData.url));
                    }
                } else {
                    setError('Article not found.');
                }
            } catch (err) {
                setError('Failed to fetch article details.');
            } finally {
                setIsLoading(false);
            }
        };

        if (currentSlug) fetchArticle();
    }, [currentSlug]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
            const file = e.target.files?.[0] || null;
            setFormData(prev => ({ ...prev, Image: file }));

            if (file) {
                const previewUrl = URL.createObjectURL(file);  //createObjectURL() creates a temporary local URL that points to a file stored in the browser’s memory because <Image> cannot access file directly.
                setImagePreview(previewUrl);
            }
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, Image: null }));
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!documentId) return;

        setIsSaving(true);
        setError(null);

        const data = new FormData();
        data.append('Title', formData.Title);
        data.append('Description', formData.Description);
        data.append('Content', formData.Content);
        data.append('slug', formData.slug);
        if (formData.Image) {
            data.append('Image', formData.Image);
        }

        const result = await updateArticleAction(documentId, data);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                router.push(`/articles/${formData.slug}`);
            }, 2000);
        } else {
            setError(result.error || 'Something went wrong while updating the article.');
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <header className="mb-12">
                        <div className="flex justify-between items-center mb-10">
                            <Link
                                href={`/articles/${currentSlug}`}
                                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-bold transition-all group"
                            >
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group-hover:-translate-x-1 transition-transform">
                                    <ChevronLeft size={20} />
                                </div>
                                <span>Cancel Editing</span>
                            </Link>
                            <ThemeToggle />
                        </div>

                        <div className="text-center sm:text-left">
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Edit Post</h1>
                            <p className="text-gray-500 dark:text-gray-400">Update your content and featured image.</p>
                        </div>
                    </header>

                    <main className="bg-white dark:bg-gray-800/50 rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden">
                        {success ? (
                            <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Changes Saved!</h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">Redirecting you to the updated post...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {error && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-2xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Featured Image</label>
                                        <div className="relative">
                                            {imagePreview ? (
                                                <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
                                                    <Image src={imagePreview} alt="Preview" fill unoptimized className="object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-4 font-bold">
                                                        <label className="cursor-pointer hover:underline">
                                                            Change
                                                            <input type="file" name="Image" className="hidden" accept="image/*" onChange={handleChange} />
                                                        </label>
                                                        <span className="text-gray-300">|</span>
                                                        <button
                                                            type="button"
                                                            onClick={removeImage}
                                                            className="text-red-400 hover:text-red-300 transition-colors"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-8 h-8 text-gray-400 mb-3" />
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Click to upload new featured image</p>
                                                    </div>
                                                    <input type="file" name="Image" className="hidden" accept="image/*" onChange={handleChange} />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="Title" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Title</label>
                                        <input
                                            required
                                            type="text"
                                            id="Title"
                                            name="Title"
                                            value={formData.Title}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl outline-none transition-all text-gray-900 dark:text-white font-medium"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="slug" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Slug</label>
                                        <input
                                            required
                                            type="text"
                                            id="slug"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl outline-none transition-all text-gray-900 dark:text-white font-mono text-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="Description" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Description</label>
                                        <textarea
                                            required
                                            id="Description"
                                            name="Description"
                                            rows={2}
                                            value={formData.Description}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl outline-none transition-all text-gray-900 dark:text-white font-medium resize-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="Content" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Content</label>
                                        <textarea
                                            required
                                            id="Content"
                                            name="Content"
                                            rows={6}
                                            value={formData.Content}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl outline-none transition-all text-gray-900 dark:text-white font-medium"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isSaving}
                                    type="submit"
                                    className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    <span>{isSaving ? 'Updating...' : 'Save Changes'}</span>
                                </button>
                            </form>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
