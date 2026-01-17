import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { useRouter } from 'next/router';
import { setEarnerToken } from '../../src/utils/api';

export default function EarnerLogin() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/d2e/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.success) {
                setEarnerToken(result.token, true);
                router.push('/d2e/dashboard');
            } else {
                setError(result.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <Head>
                <title>Earner Login | Resconate D2E</title>
            </Head>
            <Header />

            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-indigo-900 p-6 text-center">
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back 👋</h1>
                        <p className="text-indigo-200 text-sm">Log in to your earner account.</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="name@example.com"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <Link href="#" className="text-xs text-indigo-600 hover:underline">Forgot password?</Link>
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex justify-center items-center"
                            >
                                {loading ? 'Logging in...' : 'Sign In'}
                            </button>

                            <p className="text-center text-sm text-gray-600">
                                Don't have an account? <Link href="/d2e/register" className="text-indigo-600 font-semibold hover:underline">Register here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
