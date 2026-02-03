import { RegisterForm } from '@/components/auth/register-form';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Loader2, Shield, Lock, ArrowRight, UserPlus } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Sign Up | Practice Project',
    description: 'Create your account to get started',
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-blue-700 p-12 flex-col justify-between">
                <div>
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <UserPlus className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Practice Project</h1>
                    </div>
                    
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            Join Our Secure Community
                        </h2>
                        <p className="text-green-100 text-lg">
                            Create your account and experience seamless authentication with enterprise-grade security.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-white">
                        <Lock className="w-5 h-5" />
                        <span>Secure password storage</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white">
                        <Shield className="w-5 h-5" />
                        <span>OAuth authentication ready</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white">
                        <ArrowRight className="w-5 h-5" />
                        <span>Instant account creation</span>
                    </div>
                </div>
            </div>

            {/* Right side - Register Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="lg:hidden flex items-center justify-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                                <UserPlus className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Practice Project</h1>
                        </div>
                        
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-600">
                            Fill in your details to get started
                        </p>
                    </div>

                    <Suspense fallback={
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="h-64 flex items-center justify-center">
                                <Loader2 className="animate-spin text-green-600" />
                            </div>
                        </div>
                    }>
                        <RegisterForm />
                    </Suspense>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-medium text-green-600 hover:text-green-700 transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Shield className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-green-900 mb-1">Secure Registration</p>
                                <p className="text-xs text-green-700">
                                    Your data is encrypted and protected with industry-standard security.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}