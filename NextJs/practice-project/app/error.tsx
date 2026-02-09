'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-red-200 shadow-lg">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-900">
                        Something went wrong!
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <div className="space-y-3">
                        <p className="text-gray-600">
                            We apologize for the inconvenience. An unexpected error has occurred.
                        </p>
                        {error.message && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-800 font-mono">
                                    {error.message}
                                </p>
                            </div>
                        )}
                        {error.digest && (
                            <p className="text-xs text-gray-500">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Button 
                            onClick={reset}
                            className="w-full bg-red-600 hover:bg-red-700"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                        
                        <Link href="/dashboard" className="block">
                            <Button 
                                variant="outline" 
                                className="w-full border-red-300 hover:bg-red-50"
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Go to Dashboard
                            </Button>
                        </Link>
                    </div>

                    <div className="pt-4 border-t border-red-200">
                        <p className="text-sm text-gray-500">
                            If this problem persists, please contact our support team.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
