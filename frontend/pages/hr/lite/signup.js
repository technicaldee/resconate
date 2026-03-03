import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Signup = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        business_name: '',
        owner_name: '',
        owner_email: '',
        owner_phone: '',
        password: '',
        confirm_password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/hr/lite/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    business_name: formData.business_name,
                    owner_name: formData.owner_name,
                    owner_email: formData.owner_email,
                    owner_phone: formData.owner_phone,
                    password: formData.password
                })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('hr_lite_business_id', data.business.id);
                localStorage.setItem('hr_lite_business_name', data.business.business_name);
                localStorage.setItem('hr_lite_token', data.token);
                router.push('/hr/lite/onboarding/plan');
            } else {
                setError(data.error || 'Signup failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen font-display bg-cloaka-bg-light dark:bg-cloaka-bg-dark text-slate-900 dark:text-slate-100">
            <Head>
                <title>Join Resconate HR Lite | Free 90 Days</title>
            </Head>
            {/* Left Side: Image/Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80')" }}
                >
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10"></div>
                <div className="relative z-20 flex flex-col justify-between p-16 h-full">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="p-2 bg-brand-gradient rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                            <img src="/RLogo.png" alt="Resconate Logo" className="w-8 h-8 object-contain brightness-0 invert" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter">Resconate HR Lite</span>
                    </Link>

                    <div className="text-white">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            Free for 90 Days
                        </div>
                        <h1 className="text-6xl font-black leading-[0.9] tracking-tighter mb-6">Built for the <br /><span className="text-indigo-400">Nigerian</span> Entrepreneur.</h1>
                        <p className="text-xl text-slate-300 max-w-md font-medium leading-relaxed">Everything formal HR assumes you know, we automate. Join 1,200+ businesses scaling securely.</p>
                        <div className="mt-12 flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?u=${i + 10}`} className="w-12 h-12 rounded-2xl border-2 border-slate-900 shadow-xl" alt="Testimonial" />
                            ))}
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black text-white">+5K</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24 overflow-y-auto">
                <div className="max-w-[480px] w-full">
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight">Create your business account</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Your automation journey starts here.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSignup}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</span>
                                    <input
                                        name="business_name"
                                        className="rounded-2xl border-2 border-slate-50 dark:border-slate-900 bg-slate-50 dark:bg-slate-900 p-4 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all font-bold text-sm"
                                        placeholder="e.g. Acme Solutions"
                                        type="text"
                                        required
                                        onChange={handleChange}
                                    />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Owner Full Name</span>
                                    <input
                                        name="owner_name"
                                        className="rounded-2xl border-2 border-slate-50 dark:border-slate-900 bg-slate-50 dark:bg-slate-900 p-4 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all font-bold text-sm"
                                        placeholder="John Doe"
                                        type="text"
                                        required
                                        onChange={handleChange}
                                    />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number (WhatsApp)</span>
                                    <input
                                        name="owner_phone"
                                        className="rounded-2xl border-2 border-slate-50 dark:border-slate-900 bg-slate-50 dark:bg-slate-900 p-4 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all font-bold text-sm"
                                        placeholder="e.g. 2348030000000"
                                        type="tel"
                                        required
                                        onChange={handleChange}
                                    />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Email</span>
                                    <input
                                        name="owner_email"
                                        className="rounded-2xl border-2 border-slate-50 dark:border-slate-900 bg-slate-50 dark:bg-slate-900 p-4 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all font-bold text-sm"
                                        placeholder="owner@business.com"
                                        type="email"
                                        required
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</span>
                                    <input
                                        name="password"
                                        className="rounded-2xl border-2 border-slate-50 dark:border-slate-900 bg-slate-50 dark:bg-slate-900 p-4 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all font-bold text-sm"
                                        placeholder="••••••••"
                                        type="password"
                                        required
                                        onChange={handleChange}
                                    />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</span>
                                    <input
                                        name="confirm_password"
                                        className="rounded-2xl border-2 border-slate-50 dark:border-slate-900 bg-slate-50 dark:bg-slate-900 p-4 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all font-bold text-sm"
                                        placeholder="••••••••"
                                        type="password"
                                        required
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}

                        <button
                            className="w-full bg-cloaka-primary hover:bg-cloaka-primary/90 text-white font-black py-5 px-6 rounded-[24px] shadow-2xl shadow-cloaka-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-6"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Joining...
                                </>
                            ) : (
                                <>
                                    Start Free 90 Days
                                    <span className="material-symbols-outlined font-black">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            Already have an account?
                            <Link href="/hr/lite/login" className="text-indigo-600 font-black hover:underline ml-2">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
