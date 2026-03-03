import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const HRLiteLayout = ({ children }) => {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    React.useEffect(() => {
        const token = localStorage.getItem('hr_lite_token');
        if (!token) {
            router.push('/hr/lite/signup');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('hr_lite_token');
        localStorage.removeItem('hr_lite_business_id');
        router.push('/hr/lite/signup');
    };

    if (!isAuthorized) return null;

    const menuItems = [
        { name: 'Dashboard', icon: 'dashboard', path: '/hr/lite/dashboard' },
        { name: 'Recipients', icon: 'group', path: '/hr/lite/recipients' },
        { name: 'Payment Rules', icon: 'rule', path: '/hr/lite/rules' },
        { name: 'Webhooks', icon: 'webhook', path: '/hr/lite/webhooks' },
        { name: 'Subscription', icon: 'credit_card', path: '/hr/lite/subscription' },
        { name: 'Settings', icon: 'settings', path: '/hr/lite/settings' },
    ];

    return (
        <div className="bg-cloaka-bg-light dark:bg-cloaka-bg-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 transition-all duration-300 group shadow-2xl shadow-slate-200/50 dark:shadow-none z-50">
                <div className="p-8 pb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-cloaka-primary">
                        <div className="w-10 h-10 bg-cloaka-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-cloaka-primary/30">
                            <span className="material-symbols-outlined text-2xl font-black">shield_person</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight group-hover:block transition-all text-slate-900 dark:text-white">Cloaka</h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-sm group/item ${router.pathname === item.path
                                ? 'bg-cloaka-primary text-white shadow-xl shadow-cloaka-primary/20 translate-x-1'
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-cloaka-primary'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-2xl ${router.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover/item:text-cloaka-primary transition-colors'}`}>
                                {item.icon}
                            </span>
                            <span className="tracking-wide">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center relative overflow-hidden group/ad">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cloaka-primary/5 rounded-full -mr-12 -mt-12 group-hover/ad:scale-150 transition-transform"></div>
                        <div className="relative z-10">
                            <h4 className="font-black text-sm text-slate-900 dark:text-white mb-1">Growth Activated</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Unlimited Potential</p>
                            <button className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black py-2 rounded-lg text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700 hover:bg-cloaka-primary hover:text-white hover:border-cloaka-primary transition-all shadow-sm">
                                View Perks
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer group/user relative">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 flex items-center justify-center text-slate-500 shadow-sm overflow-hidden">
                            <span className="material-symbols-outlined text-2xl font-black">person</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">Acme Solutions</h4>
                            <button onClick={handleLogout} className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:underline text-left">Sign Out</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white dark:bg-slate-950/50 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-8 flex-1">
                        <button
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="flex-1 max-w-xl hidden md:block">
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-cloaka-primary transition-colors">
                                    <span className="material-symbols-outlined text-xl font-bold">search</span>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search everything... (Cmd+K)"
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cloaka-primary/10 focus:border-cloaka-primary transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full border border-green-100 dark:border-green-800">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Live Integration</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative w-10 h-10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all group">
                                <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-cloaka-primary rounded-full border-2 border-white dark:border-slate-950"></span>
                            </button>
                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                            <button className="flex items-center gap-2 pl-2 pr-4 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg shadow-slate-900/20 dark:shadow-white/5 group">
                                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">add_circle</span>
                                <span className="hidden sm:block">New Action</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Scroll Area */}
                <main className="flex-1 overflow-y-auto bg-cloaka-bg-light dark:bg-cloaka-bg-dark">
                    <div className="p-8 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Sidebar Mobile Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
                    <aside className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-slate-950 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
                        <div className="p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 text-cloaka-primary">
                                <span className="material-symbols-outlined text-2xl font-black">shield_person</span>
                                <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">Cloaka</h1>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="text-slate-400">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <nav className="flex-1 p-6 space-y-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`flex items-center gap-4 p-4 rounded-xl font-bold text-sm ${router.pathname === item.path
                                        ? 'bg-cloaka-primary text-white shadow-xl'
                                        : 'text-slate-500 border border-transparent'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                        <div className="p-8 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500">
                                    <span className="material-symbols-outlined">account_circle</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Acme Solutions</h4>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Free Plan User</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default HRLiteLayout;
