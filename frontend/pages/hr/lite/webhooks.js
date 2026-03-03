import React, { useState, useEffect } from 'react';
import HRLiteLayout from '../../../src/components/HRLite/Layout';
import Head from 'next/head';

const WebhooksPage = () => {
    const [endpoints, setEndpoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [url, setUrl] = useState('');

    const fetchEndpoints = async () => {
        const bid = localStorage.getItem('hr_lite_business_id');
        try {
            const res = await fetch(`/api/hr/lite/webhooks?business_id=${bid}`);
            const data = await res.json();
            if (data.success) setEndpoints(data.data);
        } catch (e) {
            console.error('Fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEndpoints();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        const bid = localStorage.getItem('hr_lite_business_id');
        try {
            const res = await fetch('/api/hr/lite/webhooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ business_id: bid, endpoint_url: url })
            });
            const data = await res.json();
            if (data.success) {
                setEndpoints([data.data, ...endpoints]);
                setShowModal(false);
                setUrl('');
            }
        } catch (e) {
            alert('Could not add webhook.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`/api/hr/lite/webhooks/${id}`, { method: 'DELETE' });
            setEndpoints(endpoints.filter(e => e.id !== id));
        } catch (e) {
            alert('Delete failed.');
        }
    };

    return (
        <HRLiteLayout>
            <Head>
                <title>Webhooks | Resconate HR Lite</title>
            </Head>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] border border-slate-100 dark:border-slate-800 p-10 shadow-3xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-3xl font-black mb-6 tracking-tighter">New Webhook</h3>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Endpoint URL</label>
                                <input
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    required
                                    placeholder="https://api.yourdomain.com/hooks"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 font-bold text-sm outline-none"
                                />
                            </div>
                            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Register Webhook</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-cloaka-primary"></span>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Developer Tools</p>
                        </div>
                        <h1 className="text-4xl font-black">Webhooks Configuration</h1>
                        <p className="text-slate-500 mt-2 font-medium">Connect your backend systems for real-time status updates.</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-cloaka-primary text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-cloaka-primary/20">
                        <span className="material-symbols-outlined text-lg">add_link</span>
                        Add Endpoint
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-10">
                    {loading ? (
                        <div className="py-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse">Initializing Streams...</div>
                    ) : endpoints.length === 0 ? (
                        <div className="py-20 text-center font-black text-slate-300 uppercase tracking-widest">No webhooks configured</div>
                    ) : (
                        <div className="space-y-6">
                            {endpoints.map((e) => (
                                <div key={e.id} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-indigo-500/20 transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-6 flex-1 min-w-0">
                                        <div className="w-2 h-10 rounded-full bg-emerald-500 group-hover:bg-indigo-500 transition-colors"></div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-extrabold text-slate-900 dark:text-white truncate">{e.endpoint_url}</h4>
                                            <div className="flex items-center gap-4 mt-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret: {e.secret_key}</p>
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">Status: {e.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(e.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined font-black">delete_sweep</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </HRLiteLayout>
    );
};

export default WebhooksPage;
