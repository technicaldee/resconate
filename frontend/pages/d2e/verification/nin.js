import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { apiFetch } from '../../../src/utils/api';

export default function NINVerification() {
    const router = useRouter();
    const [nin, setNin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nin.length !== 11) {
            setError('NIN must be 11 digits long.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            // In a real app, this would hit an identity verification service
            const res = await apiFetch('/api/d2e/verify-nin', {
                method: 'POST',
                body: JSON.stringify({ nin })
            });
            const data = await res.json();
            if (data.success) {
                alert('NIN submitted for verification!');
                router.push('/d2e/verification');
            } else {
                setError(data.error || 'Failed to verify NIN');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-d2e-bg-light dark:bg-d2e-bg-dark text-slate-900 dark:text-white font-display min-h-screen">
            <Head>
                <title>NIN Verification - D2E</title>
            </Head>

            <header className="sticky top-0 z-50 bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 p-4">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center justify-center h-10 w-10">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </button>
                    <h2 className="text-lg font-bold">NIN Verification</h2>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 pt-10">
                <div className="mb-8 text-center">
                    <div className="h-20 w-20 rounded-2xl bg-d2e-primary/10 text-d2e-primary flex items-center justify-center mx-auto mb-4 border border-d2e-primary/20">
                        <span className="material-symbols-outlined !text-4xl">fingerprint</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Identify Yourself</h3>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">Please enter your 11-digit National Identification Number (NIN) as it appears on your card.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">National ID Number</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={11}
                            placeholder="0000 0000 000"
                            className="w-full bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-gray-800 rounded-xl h-14 px-6 text-xl tracking-[0.2em] font-mono focus:ring-2 focus:ring-d2e-primary focus:border-transparent outline-none transition-all"
                            value={nin}
                            onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
                            required
                        />
                        {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                    </div>

                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3">
                        <span className="material-symbols-outlined text-amber-500 text-xl">security</span>
                        <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed font-medium">
                            Your NIN is handled securely and only used for identity validation. We do not store your full government ID data.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || nin.length !== 11}
                        className="w-full h-14 bg-d2e-primary hover:bg-d2e-primary/90 text-d2e-bg-dark font-bold rounded-xl shadow-lg shadow-d2e-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying...' : 'Next Step'}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-slate-500 dark:text-gray-400 text-xs">Don't have an NIN? <a href="#" className="text-d2e-primary font-bold">Find out how to get one</a></p>
                </div>
            </main>
        </div>
    );
}
