'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteArticleAction } from '@/app/lib/actions/strapi';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteArticleButtonProps {
    documentId: string;
    articleTitle: string;
}

export default function DeleteArticleButton({ documentId, articleTitle }: DeleteArticleButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            // Get current locale from cookie
            const locale = document.cookie
                .split('; ')
                .find(row => row.startsWith('NEXT_LOCALE='))
                ?.split('=')[1];

            const result = await deleteArticleAction(documentId, locale);

            if (result.success) {
                router.push('/articles');
                router.refresh();
            } else {
                alert('Failed to delete article: ' + (result.error || 'Unknown error'));
                setIsDeleting(false);
                setShowConfirm(false);
            }
        } catch (err) {
            alert('An unexpected error occurred');
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
                <p className="text-sm font-bold text-red-500 hidden sm:block">Delete this post?</p>
                <button
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white text-xs font-black rounded-xl hover:bg-red-700 transition-all flex items-center gap-2"
                >
                    {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Confirm
                </button>
                <button
                    disabled={isDeleting}
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-800/50"
            title="Delete post"
        >
            <Trash2 size={20} />
        </button>
    );
}
