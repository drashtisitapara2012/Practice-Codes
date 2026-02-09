import { LoginForm } from '@/components/auth/login-form';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Loader2, Shield, Lock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Sign In | Practice Project',
    description: 'Sign in to access your dashboard',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex-col justify-between">
                <div>
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Practice Project</h1>
                    </div>
                    
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            Welcome Back to Your Secure Space
                        </h2>
                        <p className="text-blue-100 text-lg">
                            Experience seamless authentication with multiple providers and enterprise-grade security.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-white">
                        <Lock className="w-5 h-5" />
                        <span>End-to-end encryption</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white">
                        <Shield className="w-5 h-5" />
                        <span>Multi-factor authentication ready</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white">
                        <ArrowRight className="w-5 h-5" />
                        <span>OAuth providers supported</span>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="lg:hidden flex items-center justify-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Practice Project</h1>
                        </div>
                        
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                        <p className="text-gray-600">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <Suspense fallback={
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="h-64 flex items-center justify-center">
                                <Loader2 className="animate-spin text-blue-600" />
                            </div>
                        </div>
                    }>
                        <LoginForm />
                    </Suspense>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                href="/register"
                                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Sign up for free
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Lock className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-blue-900 mb-1">Secure Login</p>
                                <p className="text-xs text-blue-700">
                                    Use your registered credentials to sign in. New users can create an account below.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
