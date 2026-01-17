import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { useRouter } from 'next/router';

export default function PostTask() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Fixed',
        reward: '',
        slots: '',
        deadline: '',
        skills: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateTotal = () => {
        const r = parseFloat(formData.reward) || 0;
        const s = parseInt(formData.slots) || 0;
        const subtotal = r * (formData.type === 'Fixed' ? s : 1); // Competition usually means 1 winner or top N
        const fee = subtotal * 0.15; // 15% fee
        return { subtotal, fee, total: subtotal + fee };
    };

    const handleCreate = (e) => {
        e.preventDefault();
        setStep(2); // Go to funding
    };

    const handleFund = () => {
        setLoading(true);
        // Simulate Payment
        setTimeout(() => {
            setLoading(false);
            router.push('/d2e/poster/dashboard');
        }, 2000);
    };

    const totals = calculateTotal();

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Head>
                <title>Post a Task | Resconate D2E</title>
            </Head>
            <Header />

            <main className="pt-24 pb-12 px-4 md:px-8 max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Post a New Task</h1>
                    <p className="text-gray-600">Fill in the details to find the best talent.</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        {step === 1 && (
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                                    <input
                                        name="title"
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. Design a logo for..."
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description & Requirements</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={5}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Describe what needs to be done..."
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="Fixed">Fixed Price (First Come First Serve)</option>
                                            <option value="Competition">Competition (Select Best)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg border border-gray-200 cursor-not-allowed">
                                            Draft
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reward Per Slot (₦)</label>
                                        <input
                                            name="reward"
                                            type="number"
                                            required
                                            min="1000"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="5000"
                                            value={formData.reward}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Slots</label>
                                        <input
                                            name="slots"
                                            type="number"
                                            required
                                            min="1"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="1"
                                            value={formData.slots}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (Comma separated)</label>
                                    <input
                                        name="skills"
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Graphic Design, Photoshop, etc."
                                        value={formData.skills}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                                    <input
                                        name="deadline"
                                        type="date"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center text-sm">
                                    <div className="text-gray-600">
                                        Estimated Total (incl. 15% fee)
                                    </div>
                                    <div className="font-bold text-lg text-gray-900">
                                        ₦{totals.total.toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow transition-colors"
                                    >
                                        Proceed to Payment
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="text-center py-6">
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold mb-2">Fund Escrow</h2>
                                    <p className="text-gray-500">Secure the task budget to activate your post.</p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-left mb-8 max-w-sm mx-auto">
                                    <div className="flex justify-between mb-2">
                                        <span>Subtotal</span>
                                        <span>₦{totals.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                                        <span>Platform Fee (15%)</span>
                                        <span>₦{totals.fee.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total To Pay</span>
                                        <span>₦{totals.total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 max-w-sm mx-auto">
                                    <button
                                        onClick={handleFund}
                                        disabled={loading}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md flex justify-center items-center gap-2"
                                    >
                                        {loading ? 'Processing...' : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                                Pay with Paystack
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setStep(1)}
                                        disabled={loading}
                                        className="w-full py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Back to Edit
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
