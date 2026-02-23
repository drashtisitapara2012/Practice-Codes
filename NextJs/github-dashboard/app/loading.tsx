export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-16 h-16 border-t-4 border-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
                    Initializing Experience...
                </p>
            </div>
        </div>
    );
}
