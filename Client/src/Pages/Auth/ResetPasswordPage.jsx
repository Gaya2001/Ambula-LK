import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/AuthService';

export default function ResetPasswordPage() {
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Extract token from URL query parameters
        const params = new URLSearchParams(location.search);
        const tokenParam = params.get('token');
        
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError('Reset token is missing. Please use the link from your email.');
        }
    }, [location.search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const validatePassword = (password) => {
        // Password must be at least 8 characters and contain at least one number, one lowercase and one uppercase letter
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!passwords.newPassword || !passwords.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!validatePassword(passwords.newPassword)) {
            setError('Password must be at least 8 characters long and include at least one number, one lowercase and one uppercase letter');
            return;
        }

        if (!token) {
            setError('Reset token is missing');
            return;
        }

        setLoading(true);
        try {
            // Call the password reset service
            const response = await authService.resetPassword(token, passwords.newPassword);
            
            // Check if we have a valid response
            if (!response || !response.data) {
                throw new Error('Invalid response from server');
            }

            // Show success message
            setSuccess('Your password has been reset successfully!');
            
            // Clear the form
            setPasswords({
                newPassword: '',
                confirmPassword: ''
            });
            
            // After 3 seconds, redirect to login page
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error("Password reset error:", err);

            // Extract error message from the response with fallback messages
            const errorMessage = err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                'Failed to reset password. The link may have expired or is invalid.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#03081F]">
            <div className="flex items-center justify-center w-full p-8">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Reset Your Password</h2>
                        <p className="text-gray-600">Enter your new password below</p>
                    </div>

                    {error && (
                        <div className="flex items-center p-3 mb-6 text-red-600 rounded-md bg-red-50">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center p-3 mb-6 text-green-600 rounded-md bg-green-50">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
                                placeholder="Enter your new password"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Password must be at least 8 characters long and include at least one number, 
                                one lowercase and one uppercase letter.
                            </p>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
                                placeholder="Confirm your new password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !token}
                            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#FC8A06] rounded-md hover:bg-[#e67a00] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Resetting Password...
                                </>
                            ) : 'Reset Password'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => navigate('/login')}
                            className="text-sm text-[#FC8A06] hover:underline"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}