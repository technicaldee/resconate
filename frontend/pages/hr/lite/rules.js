import React, { useState, useEffect } from 'react';
import HRLiteLayout from '../../../src/components/HRLite/Layout';
import Head from 'next/head';

const RulesPage = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [formData, setFormData] = useState({
        rule_name: '',
        trigger_condition: 'Scheduled Date',
        action_type: 'Disburse Salary'
    });

    const fetchRules = async () => {
        const bid = localStorage.getItem('hr_lite_business_id');
        try {
            const res = await fetch(`/api/hr/lite/rules?business_id=${bid}`);
            const data = await res.json();
            if (data.success) setRules(data.data);
        } catch (e) {
            console.error('Fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const bid = localStorage.getItem('hr_lite_business_id');
        try {
            const res = await fetch('/api/hr/lite/rules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, business_id: bid })
            });
            const data = await res.json();
            if (data.success) {
                setRules([data.data, ...rules]);
                setIsDrawerOpen(false);
                setFormData({ rule_name: '', trigger_condition: 'Scheduled Date', action_type: 'Disburse Salary' });
            }
        } catch (e) {
            alert('Failed to save rule.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`/api/hr/lite/rules/${id}`, { method: 'DELETE' });
            setRules(rules.filter(r => r.id !== id));
        } catch (e) {
            alert('Delete failed.');
        }
    };

    return (
        <HRLiteLayout>
            <Head>
                <title>Payment Rules | Resconate HR Lite</title>
            </Head>
            <div className="flex flex-col gap-8 relative h-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-cloaka-primary"></span>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Automation</p>
                        </div>
                        <h1 className="text-4xl font-black">Payment Rules Engine</h1>
                        <p className="text-slate-500 mt-2 font-medium">Configure conditional logic to automate your payroll cycles and bonuses.</p>
                    </div>
                    <div>
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm hover:opacity-90 transition-all shadow-2xl shadow-slate-900/20 group"
                        >
                            <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">add</span>
                            Create Rule
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="xl:col-span-2 py-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse">Syncing Engine...</div>
                    ) : rules.length === 0 ? (
                        <div className="xl:col-span-2 py-20 text-center font-black text-slate-300 uppercase tracking-widest">No active rules configured</div>
                    ) : (
                        rules.map((rule) => (
                            <div key={rule.id} className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl transition-all group">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-indigo-50 dark:bg-slate-800 text-indigo-600 rounded-2xl flex items-center justify-center border border-transparent group-hover:border-indigo-500 transition-all">
                                            <span className="material-symbols-outlined text-2xl font-black">bolt</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black mb-1 capitalize">{rule.rule_name}</h3>
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active System Rule</span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(rule.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined font-black">delete_sweep</span>
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trigger</p>
                                        <p className="text-sm font-bold">{rule.trigger_condition}</p>
                                    </div>
                                    <div className="p-5 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/20">
                                        <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1">Action</p>
                                        <p className="text-sm font-bold">{rule.action_type}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Drawer */}
                {isDrawerOpen && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
                        <div className="relative w-full max-w-xl bg-white dark:bg-slate-950 h-full shadow-3xl animate-in slide-in-from-right duration-300 flex flex-col">
                            <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-3xl font-black tracking-tighter">New Rule</h2>
                                <button onClick={() => setIsDrawerOpen(false)} className="material-symbols-outlined font-black text-slate-400">close</button>
                            </div>
                            <form onSubmit={handleSave} className="p-10 flex-1 space-y-10 overflow-y-auto">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Internal Name</label>
                                    <input required value={formData.rule_name} onChange={e => setFormData({ ...formData, rule_name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 text-sm font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Condition</label>
                                    <select value={formData.trigger_condition} onChange={e => setFormData({ ...formData, trigger_condition: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 text-sm font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all">
                                        <option>Scheduled Date</option>
                                        <option>Employee Onboarded</option>
                                        <option>Task Completed</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Automation Action</label>
                                    <select value={formData.action_type} onChange={e => setFormData({ ...formData, action_type: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 text-sm font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all">
                                        <option>Disburse Salary</option>
                                        <option>Pay Bonus</option>
                                        <option>Notify Admin</option>
                                    </select>
                                </div>
                                <button className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30">Activate Automation</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </HRLiteLayout>
    );
};

export default RulesPage;
