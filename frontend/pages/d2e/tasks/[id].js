import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';
import Link from 'next/link';

export default function TaskDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [claimStatus, setClaimStatus] = useState('idle'); // idle, claiming, claimed

    // Mock Data Fetch
    useEffect(() => {
        if (!id) return;

        setLoading(true);
        // Simulate Fetch
        setTimeout(() => {
            setTask({
                id: id,
                title: 'Design a Logo for Coffee Shop',
                poster: 'Brew & Bean Co.',
                posterType: 'Company',
                posterVerified: true,
                reward: 15000,
                currency: '₦',
                type: 'Fixed',
                description: `
          We are launching a new artisan coffee shop in Victoria Island, Lagos. We need a modern, minimalist logo that captures the essence of premium Nigerian coffee.
          
          The logo should work well on signage, cups, and social media.
          
          Preferences:
          - Colors: Earthy tones (Brown, Cream, Green)
          - Style: Minimalist, clean lines
          - Deliverables: Source file (AI/EPS), PNG (transparent), and JPG.
        `,
                requirements: [
                    'Must have portfolio with logo designs',
                    'Proficient in Adobe Illustrator',
                    'Ability to deliver within 48 hours'
                ],
                deadline: 'Oct 25, 2024',
                daysLeft: 2,
                slots: { filled: 2, total: 5 },
                postedAt: '2 days ago'
            });
            setLoading(false);
        }, 1000);
    }, [id]);

    const handleClaim = () => {
        if (claimStatus === 'claimed') return;
        setClaimStatus('claiming');
        setTimeout(() => {
            setClaimStatus('claimed');
            // In real app, would redirect to submission page or show submission form
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading task details...</p>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Task Not Found</h1>
                        <Link href="/d2e/tasks" className="text-indigo-600 hover:underline mt-2 inline-block">Back to Tasks</Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head>
                <title>{task.title} | Resconate D2E</title>
            </Head>
            <Header />

            <main className="pt-24 pb-12 px-4 md:px-8 max-w-6xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-500">
                    <Link href="/d2e" className="hover:text-indigo-600">Home</Link> &gt;
                    <Link href="/d2e/tasks" className="hover:text-indigo-600 ml-1">Tasks</Link> &gt;
                    <span className="text-gray-900 ml-1 truncate">{task.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Task Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <span className="flex items-center">
                                            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide mr-2">{task.type}</span>
                                            Posted {task.postedAt}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center text-orange-600">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            {task.daysLeft} days left
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-indigo max-w-none text-gray-700 mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <div className="whitespace-pre-line">{task.description}</div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                                <ul className="space-y-2">
                                    {task.requirements.map((req, i) => (
                                        <li key={i} className="flex items-start text-gray-700">
                                            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Safety Notice */}
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start text-sm text-blue-800">
                                <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p>
                                    <strong>Escrow Protection:</strong> The payment of {task.currency}{task.reward.toLocaleString()} is currently held in Resconate Escrow. It will be released to your wallet immediately after your work is approved.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Action Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
                            <div className="mb-6">
                                <div className="text-sm text-gray-500 mb-1">Total Pay</div>
                                <div className="text-3xl font-bold text-green-600">{task.currency}{task.reward.toLocaleString()}</div>
                                <div className="text-xs text-gray-400">per person</div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Slots Available</span>
                                    <span className="font-medium text-gray-900">{task.slots.total - task.slots.filled} / {task.slots.total}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(task.slots.filled / task.slots.total) * 100}%` }}></div>
                                </div>
                            </div>

                            {claimStatus === 'claimed' ? (
                                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100 mb-4">
                                    <div className="font-bold text-green-700 mb-1">🎉 Task Claimed!</div>
                                    <p className="text-sm text-green-600">Please complete the work before the deadline.</p>
                                </div>
                            ) : (
                                <button
                                    onClick={handleClaim}
                                    disabled={claimStatus === 'claiming'}
                                    className={`w-full py-4 text-center rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${claimStatus === 'claiming' ? 'bg-gray-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                >
                                    {claimStatus === 'claiming' ? 'Processing...' : 'Claim Task Now'}
                                </button>
                            )}

                            {claimStatus === 'claimed' && (
                                <button className="w-full py-3 bg-white border-2 border-indigo-600 text-indigo-700 font-bold rounded-xl mt-3 hover:bg-indigo-50">
                                    Submit Work
                                </button>
                            )}

                            <hr className="my-6 border-gray-100" />

                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-lg mr-3">
                                    {task.poster.substring(0, 1)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{task.poster}</h4>
                                    <div className="flex items-center text-xs text-green-600">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                        Payment Verified
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
