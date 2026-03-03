import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const UserTestingDashboard = () => {
    const [testPhone, setTestPhone] = useState('2348000000000');
    const [logs, setLogs] = useState([]);
    const [handbookUrl, setHandbookUrl] = useState(null);

    const addLog = (msg) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    const simulateTrigger = async (type) => {
        addLog(`Simulating ${type} trigger...`);
        try {
            const res = await fetch('/api/hr/lite/test/whatsapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: testPhone, type })
            });
            const data = await res.json();
            if (data.success) addLog(`SUCCESS: ${type} sent to ${testPhone} (Mock ID: ${data.message_id})`);
            else addLog(`ERROR: ${data.error}`);
        } catch (e) {
            addLog(`CRITICAL ERROR: ${e.message}`);
        }
    };

    const simulateOnboarding = async () => {
        addLog('Starting Full Onboarding Simulation...');
        // Mock data logic
        addLog('1. Creating business identity...');
        addLog('2. Simulating Plan choice: "Growth"');
        addLog('3. Simulating Funding: "Cloaka Wallet"');
        addLog('4. Generating PDF Staff Handbook...');

        try {
            // In a real test we'd hit /api/hr/lite/business/:id/generate-handbook
            // Here we just simulate the success state
            setTimeout(() => {
                setHandbookUrl('/handbooks/placeholder.pdf');
                addLog('SUCCESS: Staff Handbook generated successfully.');
                simulateTrigger('handbook');
            }, 1500);
        } catch (e) {
            addLog('ERROR: Simulation failed.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 font-display text-white p-8 md:p-12">
            <Head>
                <title>User Testing | Resconate HR Lite</title>
            </Head>

            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 underline-offset-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Resconate Labs</p>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter">Micro-Business Flow Testing</h1>
                        <p className="text-slate-400 mt-4 text-lg font-medium">Verify the conversational onboarding and automated triggers for HR Lite.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/hr/lite/signup" className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Launch Onboarding</Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Test Controller */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-slate-900/50 border border-white/5 rounded-[40px] p-8">
                            <h3 className="text-xl font-black mb-6">Test Controls</h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Recipient Phone</label>
                                    <input
                                        type="text"
                                        value={testPhone}
                                        onChange={(e) => setTestPhone(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <button onClick={() => simulateTrigger('welcome')} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/10">Simulate Welcome WA</button>
                                    <button onClick={simulateOnboarding} className="w-full py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Run Full Simulation</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-white/5 rounded-[40px] p-8">
                            <h3 className="text-xl font-black mb-6">Micro-Business Feedback</h3>
                            <div className="space-y-4">
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">Simulate a persona like "Mama Beka", a food stand owner with a team of 4. Does the language feel too corporate?</p>
                                <textarea
                                    placeholder="Enter tester notes here..."
                                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm resize-none focus:border-indigo-500 transition-colors"
                                ></textarea>
                                <button className="w-full py-3 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all">Save Feedback</button>
                            </div>
                        </div>
                    </div>

                    {/* Simulation Logs */}
                    <div className="lg:col-span-2">
                        <div className="bg-black/60 border border-white/10 rounded-[40px] h-full flex flex-col overflow-hidden">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-xl font-black">Simulation Output</h3>
                                <button onClick={() => setLogs([])} className="text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">delete_sweep</span>
                                </button>
                            </div>
                            <div className="flex-1 p-8 font-mono text-xs overflow-y-auto space-y-2">
                                {logs.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-50">
                                        <span className="material-symbols-outlined text-4xl mb-4">terminal</span>
                                        <p>No activity recorded yet...</p>
                                    </div>
                                ) : (
                                    logs.map((log, i) => (
                                        <p key={i} className={log.includes('SUCCESS') ? 'text-green-400' : log.includes('ERROR') ? 'text-red-400' : 'text-slate-300'}>{log}</p>
                                    ))
                                )}
                            </div>
                            {handbookUrl && (
                                <div className="p-8 bg-indigo-600/10 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined text-indigo-400">picture_as_pdf</span>
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-sm">Staff_Handbook_2024.pdf</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Ready for review</p>
                                        </div>
                                    </div>
                                    <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest">Download</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserTestingDashboard;
