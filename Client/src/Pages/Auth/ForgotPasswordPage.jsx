import React, { useState } from 'react';
import { ArrowLeft, Mail, Loader, CheckCircle, AlertCircle } from 'lucide-react';

export default function EnhancedForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Simulate navigate function for demo
    const navigate = (path) => {
        console.log(`Navigating to: ${path}`);
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setSuccess('Password reset instructions have been sent to your email address.');
            setEmail('');
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-900 to-gray-900">
            {/* Left decorative column */}
            <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-blue-800 to-indigo-900">
                <div className="absolute inset-0 bg-[url('/api/placeholder/800/600')] opacity-10 bg-cover"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-indigo-900/90"></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
                    <div className="flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-white/10">
                        <Mail size={40} className="text-white" />
                    </div>
                    <h1 className="mb-4 text-4xl font-bold">Password Recovery</h1>
                    <p className="max-w-md text-xl text-center text-blue-100">
                        Don't worry! It happens to the best of us. We'll help you get back into your account.
                    </p>
                </div>
                
                {/* Decorative circles */}
                <div className="absolute w-48 h-48 rounded-full top-1/4 -left-12 bg-blue-500/20"></div>
                <div className="absolute w-64 h-64 rounded-full bottom-1/4 -right-16 bg-indigo-500/20"></div>
            </div>
            
            {/* Right form column */}
            <div className="flex items-center justify-center w-full p-8 lg:w-1/2">
                <div className="w-full max-w-md p-8 transition-all duration-300 bg-white shadow-xl rounded-xl hover:shadow-2xl">
                    <button 
                        onClick={() => navigate('/login')}
                        className="flex items-center mb-6 text-gray-600 transition-colors hover:text-orange-500 group"
                    >
                        <ArrowLeft size={16} className="mr-1 transition-transform group-hover:-translate-x-1" />
                        <span>Back to Login</span>
                    </button>
                    
                    <div className="mb-8">
                        <h2 className="mb-2 text-3xl font-bold text-gray-800">Forgot Password?</h2>
                        <p className="text-gray-600">Enter your email address and we'll send you instructions to reset your password.</p>
                    </div>

                    {error && (
                        <div className="flex items-center p-4 mb-6 text-red-700 border-l-4 border-red-500 rounded-lg bg-red-50">
                            <AlertCircle size={20} className="flex-shrink-0 mr-2" />
                            <p>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center p-4 mb-6 text-green-700 border-l-4 border-green-500 rounded-lg bg-green-50">
                            <CheckCircle size={20} className="flex-shrink-0 mr-2" />
                            <p>{success}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="relative">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                    className="block w-full py-3 pl-10 pr-3 transition-all border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader size={20} className="mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : 'Send Reset Instructions'}
                        </button>
                    </div>

                    <div className="pt-6 mt-8 text-center border-t">
                        <p className="text-sm text-gray-600">
                            Remember your password? {' '}
                            <button 
                                onClick={() => navigate('/login')}
                                className="font-medium text-orange-500 transition-colors hover:text-orange-700"
                            >
                                Sign in here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}