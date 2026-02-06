'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-blue-200 shadow-lg">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-blue-900">
                        Page Not Found
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <div className="space-y-3">
                        <p className="text-gray-600">
                            Oops! The page you're looking for doesn't exist or has been moved.
                        </p>
                        <div className="text-6xl font-bold text-blue-200">
                            404
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Link href="/dashboard" className="block">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                <Home className="mr-2 h-4 w-4" />
                                Go to Dashboard
                            </Button>
                        </Link>
                        
                        <Button 
                            variant="outline" 
                            onClick={() => window.history.back()}
                            className="w-full border-blue-300 hover:bg-blue-50"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                    </div>

                    <div className="pt-4 border-t border-blue-200">
                        <p className="text-sm text-gray-500 mb-3">
                            Looking for something specific?
                        </p>
                        <div className="space-y-2 text-left">
                            <Link href="/dashboard" className="block text-sm text-blue-600 hover:text-blue-800">
                                → Dashboard
                            </Link>
                            <Link href="/login" className="block text-sm text-blue-600 hover:text-blue-800">
                                → Login
                            </Link>
                            <Link href="/register" className="block text-sm text-blue-600 hover:text-blue-800">
                                → Register
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
