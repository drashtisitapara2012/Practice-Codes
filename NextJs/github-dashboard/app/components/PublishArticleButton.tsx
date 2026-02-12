'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { publishArticleAction } from '@/app/lib/actions/strapi';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface PublishArticleButtonProps {
    documentId: string;
    slug: string;
    articleTitle: string;
}

export default function PublishArticleButton({ documentId, slug, articleTitle }: PublishArticleButtonProps) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handlePublish = async () => {
        setIsPublishing(true);
        setStatus('idle');

        try {
            const result = await publishArticleAction(documentId, slug);
            if (result.success) {
                setStatus('success');
                setTimeout(() => {
                    setIsConfirming(false);
                    router.push(`/articles/${slug}`);
                    router.refresh();
                }, 1500);
            } else {
                setStatus('error');
                setErrorMessage(result.error || 'Failed to publish article');
            }
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message || 'An unexpected error occurred');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsConfirming(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 dark:shadow-none transition-all hover:scale-105 active:scale-95"
            >
                <Send size={18} />
                <span>Review & Publish</span>
            </button>

            {isConfirming && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="mt-100 bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 sm:p-12 max-w-lg w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-700 transform animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex flex-col items-center text-center space-y-8 py-2">
                            {status === 'success' ? (
                                <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400 ring-8 ring-green-50/50 dark:ring-green-900/10">
                                    <CheckCircle2 size={56} />
                                </div>
                            ) : status === 'error' ? (
                                <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-full text-red-600 dark:text-red-400 ring-8 ring-red-50/50 dark:ring-red-900/10">
                                    <AlertCircle size={56} />
                                </div>
                            ) : (
                                <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 ring-8 ring-blue-50/50 dark:ring-blue-900/10">
                                    <Send size={56} />
                                </div>
                            )}

                            <div className="space-y-3">
                                <h3 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {status === 'success' ? 'Published!' : status === 'error' ? 'Publish Failed' : 'Ready to Publish?'}
                                </h3>
                                <div className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                    {status === 'success'
                                        ? `"${articleTitle}" is now live and visible to everyone.`
                                        : status === 'error'
                                            ? <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                                                <p className="text-red-600 dark:text-red-400 font-bold text-base">{errorMessage}</p>
                                            </div>
                                            : `You are about to publish "${articleTitle}". This will finalize your draft and push it live.`}
                                </div>
                            </div>

                            <div className="flex flex-col w-full gap-4 pt-4">
                                {status === 'idle' ? (
                                    <>
                                        <button
                                            onClick={handlePublish}
                                            disabled={isPublishing}
                                            className="flex items-center justify-center gap-3 w-full py-5 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-2xl shadow-2xl shadow-green-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                                        >
                                            {isPublishing ? (
                                                <Loader2 size={24} className="animate-spin" />
                                            ) : (
                                                <>
                                                    <Send size={24} />
                                                    <span>Confirm Publication</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setIsConfirming(false)}
                                            disabled={isPublishing}
                                            className="w-full py-2 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-700 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                                        >
                                            Discard & Go Back
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (status === 'error') setStatus('idle');
                                            else setIsConfirming(false);
                                        }}
                                        className="w-full py-5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-black text-lg rounded-2xl transition-all shadow-lg"
                                    >
                                        {status === 'success' ? 'Back to Dashboard' : 'Try Again'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
