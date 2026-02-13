'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createArticleAction, updateArticleAction } from '@/app/lib/actions/strapi';
import { getStrapiMedia, t } from '@/app/lib/api/strapi';
import { ChevronLeft, Send, Save, AlertCircle, CheckCircle2, Loader2, Upload, X } from 'lucide-react';
import ThemeToggle from '@/app/components/ThemeToggle';
import Image from 'next/image';

interface ArticleFormProps {
    mode: 'create' | 'edit';
    translations: Record<string, string>;
    article?: any; // Used in edit mode
    documentId?: string; // Used in edit mode
    initialContent?: string; // Pre-parsed content for edit mode
    initialImage?: string | null; // Preview URL for edit mode
}

export default function ArticleForm({
    mode,
    translations,
    article,
    documentId,
    initialContent = '',
    initialImage = null
}: ArticleFormProps) {
    const router = useRouter();
    const isEdit = mode === 'edit';

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(initialImage);

    const [formData, setFormData] = useState({
        Title: article?.Title || '',
        Description: article?.Description || '',
        Content: initialContent,
        slug: article?.slug || '',
        Image: null as File | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
            const file = e.target.files?.[0] || null;
            setFormData(prev => ({ ...prev, Image: file }));

            if (file) {
                const previewUrl = URL.createObjectURL(file);
                setImagePreview(previewUrl);
            }
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            // Only auto-generate slug in create mode if it hasn't been manually edited
            ...(name === 'Title' && !isEdit && !formData.slug ? {
                slug: value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            } : {}),
        }));
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, Image: null }));
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const data = new FormData();
        data.append('Title', formData.Title);
        data.append('Description', formData.Description);
        data.append('Content', formData.Content);
        data.append('slug', formData.slug);

        const locale = document.cookie
            .split('; ')
            .find(row => row.startsWith('NEXT_LOCALE='))
            ?.split('=')[1] || 'en';
        data.append('locale', locale);

        if (formData.Image) {
            data.append('Image', formData.Image);
        }

        let result;
        if (isEdit && documentId) {
            result = await updateArticleAction(documentId, data);
        } else {
            result = await createArticleAction(data);
        }

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                router.push(isEdit ? `/articles/${formData.slug}` : '/articles');
            }, 2000);
        } else {
            setError(result.error || `Something went wrong while ${isEdit ? 'updating' : 'creating'} the article.`);
            setIsLoading(false);
        }
    };

    // Translation keys vary by mode
    const title = isEdit
        ? t(translations, 'editArticle.title', 'Edit Post')
        : t(translations, 'createArticle.title', 'Create New Post');

    const subtitle = isEdit
        ? t(translations, 'editArticle.subtitle', 'Update your content and featured image.')
        : t(translations, 'createArticle.subtitle', 'Share your thoughts with a featured image.');

    const backPath = isEdit ? `/articles/${article?.slug}` : '/articles';
    const backText = isEdit
        ? t(translations, 'editArticle.cancelLink', 'Cancel Editing')
        : t(translations, 'createArticle.backLink', 'Back to Articles');

    const successTitle = isEdit
        ? t(translations, 'editArticle.success.title', 'Changes Saved!')
        : t(translations, 'createArticle.success.title', 'Success!');

    const successMessage = isEdit
        ? t(translations, 'editArticle.success.message', 'Redirecting to the updated post...')
        : t(translations, 'createArticle.success.message', 'Article created. Taking you back to the list...');

    const submitBtnText = isLoading
        ? (isEdit
            ? t(translations, 'editArticle.form.savingText', 'Updating...')
            : t(translations, 'createArticle.form.submittingText', 'Sending to Strapi...'))
        : (isEdit
            ? t(translations, 'editArticle.form.saveButton', 'Save Changes')
            : t(translations, 'createArticle.form.submitButton', 'Create Post'));

    return (
        <div className="max-w-3xl mx-auto">
            <header className="mb-12">
                <div className="flex justify-between items-center mb-10">
                    <Link
                        href={backPath}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-bold transition-all group"
                    >
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group-hover:-translate-x-1 transition-transform">
                            <ChevronLeft size={20} />
                        </div>
                        <span>{backText}</span>
                    </Link>
                    <ThemeToggle />
                </div>

                <div className="text-center sm:text-left">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{title}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
                </div>
            </header>

            <main className="bg-white dark:bg-gray-800/50 rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden">
                {success ? (
                    <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{successTitle}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">{successMessage}</p>
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
                            {/* Image Upload Area */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                                    {t(translations, 'createArticle.form.imageLabel', 'Featured Image')}
                                </label>
                                <div className="relative">
                                    {imagePreview ? (
                                        <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
                                            <Image src={imagePreview} alt="Preview" fill unoptimized className="object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-4 font-bold">
                                                <label className="cursor-pointer hover:underline">
                                                    {isEdit
                                                        ? t(translations, 'editArticle.form.imageChange', 'Change')
                                                        : t(translations, 'common.change', 'Change')}
                                                    <input type="file" name="Image" className="hidden" accept="image/*" onChange={handleChange} />
                                                </label>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="text-red-400 hover:text-red-300 transition-colors"
                                                >
                                                    {isEdit
                                                        ? t(translations, 'editArticle.form.imageRemove', 'Remove')
                                                        : t(translations, 'common.remove', 'Remove')}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 text-gray-400 mb-3" />
                                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                                    {isEdit
                                                        ? t(translations, 'editArticle.form.imageUploadText', 'Click to upload new featured image')
                                                        : t(translations, 'createArticle.form.imageUploadText', 'Click to upload featured image')}
                                                </p>
                                            </div>
                                            <input type="file" name="Image" className="hidden" accept="image/*" onChange={handleChange} />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="Title" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                                    {t(translations, 'createArticle.form.titleLabel', 'Title')}
                                </label>
                                <input
                                    required
                                    type="text"
                                    id="Title"
                                    name="Title"
                                    value={formData.Title}
                                    onChange={handleChange}
                                    placeholder={t(translations, 'createArticle.form.titlePlaceholder', 'My Epic Story')}
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl outline-none transition-all text-gray-900 dark:text-white font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="slug" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                                    {t(translations, 'createArticle.form.slugLabel', 'Slug')}
                                </label>
                                <input
                                    required
                                    type="text"
                                    id="slug"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder={t(translations, 'createArticle.form.slugPlaceholder', 'my-epic-story')}
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl outline-none transition-all text-gray-900 dark:text-white font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="Description" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                                    {t(translations, 'createArticle.form.descriptionLabel', 'Description')}
                                </label>
                                <textarea
                                    required
                                    id="Description"
                                    name="Description"
                                    rows={2}
                                    value={formData.Description}
                                    onChange={handleChange}
                                    placeholder={t(translations, 'createArticle.form.descriptionPlaceholder', 'A short summary...')}
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl outline-none transition-all text-gray-900 dark:text-white font-medium resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="Content" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                                    {t(translations, 'createArticle.form.contentLabel', 'Content')}
                                </label>
                                <textarea
                                    required
                                    id="Content"
                                    name="Content"
                                    rows={6}
                                    value={formData.Content}
                                    onChange={handleChange}
                                    placeholder={t(translations, 'createArticle.form.contentPlaceholder', 'Start writing...')}
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl outline-none transition-all text-gray-900 dark:text-white font-medium"
                                />
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className={`w-full py-5 ${isEdit ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-black rounded-2xl shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50`}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : (isEdit ? <Save size={20} /> : <Send size={20} />)}
                            <span>{submitBtnText}</span>
                        </button>
                    </form>
                )}
            </main>
        </div >
    );
}
