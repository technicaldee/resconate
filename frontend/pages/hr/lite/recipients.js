import React, { useState, useEffect, useRef } from 'react';
import HRLiteLayout from '../../../src/components/HRLite/Layout';
import Head from 'next/head';

const RecipientsPage = () => {
    const [recipients, setRecipients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const fetchRecipients = async () => {
        const bid = localStorage.getItem('hr_lite_business_id');
        try {
            const res = await fetch(`/api/hr/lite/recipients?business_id=${bid}`);
            const data = await res.json();
            if (data.success) setRecipients(data.data);
        } catch (e) {
            console.error('Fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipients();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        const bid = localStorage.getItem('hr_lite_business_id');
        try {
            const res = await fetch('/api/hr/lite/recipients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, business_id: bid })
            });
            const data = await res.json();
            if (data.success) {
                setRecipients([data.data, ...recipients]);
                setShowModal(false);
                setFormData({ name: '', email: '', phone: '' });
            }
        } catch (e) {
            alert('Could not add recipient.');
        }
    };

    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const bid = localStorage.getItem('hr_lite_business_id');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('business_id', bid);

        try {
            const res = await fetch('/api/hr/lite/recipients/bulk', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert(`Successfully imported ${data.count} recipients.`);
                fetchRecipients();
            } else {
                alert('Upload failed: ' + data.error);
            }
        } catch (err) {
            alert('An error occurred during bulk upload.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handlePayout = async (e) => {
        e.preventDefault();
        const bid = localStorage.getItem('hr_lite_business_id');
        try {
            const res = await fetch('/api/hr/lite/payouts/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    business_id: bid,
                    recipient_id: selectedRecipient.id,
                    amount: payoutAmount,
                    reason: 'Employee Quick Pay'
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Payout of ₦${payoutAmount} to ${selectedRecipient.name} initiated!`);
                setShowPayoutModal(false);
                setPayoutAmount('');
            }
        } catch (err) {
            alert('Payout failed.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this recipient?')) return;
        try {
            await fetch(`/api/hr/lite/recipients/${id}`, { method: 'DELETE' });
            setRecipients(recipients.filter(r => r.id !== id));
        } catch (e) {
            alert('Delete failed.');
        }
    };

    return (
        <HRLiteLayout>
            <Head>
                <title>Recipients | Resconate HR Lite</title>
            </Head>

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] border border-slate-100 dark:border-slate-800 p-10 shadow-3xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-3xl font-black mb-6 tracking-tighter">Add Recipient</h3>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 font-bold text-sm outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 font-bold text-sm outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone (WhatsApp)</label>
                                <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 font-bold text-sm outline-none" />
                            </div>
                            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20">Confirm Addition</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Payout Modal */}
            {showPayoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowPayoutModal(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] border border-slate-100 dark:border-slate-800 p-10 shadow-3xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-3xl font-black mb-2 tracking-tighter text-indigo-600">Quick Payout</h3>
                        <p className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-widest">Paying {selectedRecipient.name}</p>
                        <form onSubmit={handlePayout} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amount (NGN)</label>
                                <input
                                    type="number"
                                    value={payoutAmount}
                                    onChange={e => setPayoutAmount(e.target.value)}
                                    required
                                    placeholder="50,000"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-6 font-black text-2xl outline-none"
                                />
                            </div>
                            <button className="w-full py-5 bg-cloaka-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20">Authorize Transfer</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1 text-cloaka-primary">
                            <span className="w-2 h-2 rounded-full bg-current shadow-lg shadow-current/30"></span>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Directory</p>
                        </div>
                        <h1 className="text-4xl font-black">Recipients Management</h1>
                        <p className="text-slate-500 mt-2 font-medium">Add employees to enable automated payroll and digital onboarding.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type="file" accept=".csv, .xlsx, .xls" className="hidden" ref={fileInputRef} onChange={handleBulkUpload} />
                        <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                            <span className="material-symbols-outlined text-lg">{uploading ? 'sync' : 'upload_file'}</span>
                            {uploading ? 'Parsing...' : 'Bulk Import'}
                        </button>
                        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20">
                            <span className="material-symbols-outlined text-lg">person_add</span>
                            New Recipient
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 dark:border-slate-800">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Rapid Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    <tr><td colSpan="3" className="py-20 text-center font-black text-slate-300 uppercase animate-pulse tracking-[0.3em]">Syncing Directory...</td></tr>
                                ) : recipients.length === 0 ? (
                                    <tr><td colSpan="3" className="py-20 text-center font-black text-slate-300 uppercase tracking-widest">No staff registered</td></tr>
                                ) : (
                                    recipients.map((r) => (
                                        <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                        {r.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-slate-900 dark:text-white capitalize">{r.name}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 uppercase">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-right space-x-2">
                                                <button onClick={() => { setSelectedRecipient(r); setShowPayoutModal(true); }} className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                                                    Pay Now
                                                </button>
                                                <button onClick={() => handleDelete(r.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                                                    <span className="material-symbols-outlined font-black">delete_sweep</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </HRLiteLayout>
    );
};

export default RecipientsPage;
