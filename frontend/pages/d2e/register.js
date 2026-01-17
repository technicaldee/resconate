import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';

import { setEarnerToken } from '../../src/utils/api';

export default function EarnerRegister() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        nin: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/d2e/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                })
            });
            const result = await response.json();
            if (result.success) {
                setEarnerToken(result.token, true);
                setStep(2);
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Note: In real app, this would verify NIN via API like SmileID/Prembly
            // For this demo, we'll simulate success but call the backend to update verification status if it existed
            setTimeout(() => {
                setLoading(false);
                setStep(3);
            }, 1500);
        } catch (err) {
            setError('Verification failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <Head>
                <title>Become an Earner | Resconate D2E</title>
            </Head>
            <Header />

            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-indigo-900 p-6 text-center">
                        <h1 className="text-2xl font-bold text-white mb-2">Join the Squad 🚀</h1>
                        <p className="text-indigo-200 text-sm">Start earning money completing tasks today.</p>
                    </div>

                    <div className="p-8">
                        {/* Steps Indicator */}
                        <div className="flex justify-center mb-8 gap-2">
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`h-1.5 w-8 rounded-full ${step >= s ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                            ))}
                        </div>

                        {error && (
                            <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center font-medium">
                                {error}
                            </div>
                        )}

                        {step === 1 && (
                            <form onSubmit={handleRegister} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        name="fullName"
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="080 1234 5678"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex justify-center items-center"
                                    >
                                        {loading ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : 'Create Account'}
                                    </button>
                                </div>

                                <p className="text-center text-sm text-gray-600 mt-4">
                                    Already have an account? <Link href="/d2e/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link>
                                </p>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleVerify} className="space-y-6 text-center">
                                <div className="mb-4">
                                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Verify Identity</h2>
                                    <p className="text-gray-500 text-sm mt-2">To prevent fraud and ensure secure payments, we need to verify your NIN.</p>
                                </div>

                                <div className="text-left">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">National Identity Number (NIN)</label>
                                    <input
                                        name="nin"
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="11-digit NIN"
                                        value={formData.nin}
                                        onChange={handleChange}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Your data is encrypted and used only for verification.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
                                >
                                    {loading ? 'Verifying...' : 'Verify & Complete'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Back to Details
                                </button>
                            </form>
                        )}

                        {step === 3 && (
                            <div className="text-center py-8">
                                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Squad! 🎉</h2>
                                <p className="text-gray-600 mb-8">Your account has been created successfully. You can now browse tasks and start earning.</p>

                                <Link href="/d2e/dashboard" className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all">
                                    Go to Dashboard
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
