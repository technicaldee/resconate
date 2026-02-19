import React, { useState } from 'react';

const formatAmount = (price) => {
  if (!price) return '';
  return price;
};

const CheckoutForm = ({ initialPlan = '', initialPrice = '' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [payerName, setPayerName] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (method === 'card') {
        // Use Flutterwave if configured, otherwise fall back to create-payment-intent endpoint
        if (process.env.NEXT_PUBLIC_FLW_ENABLED === 'true') {
          const resp = await fetch('/api/checkout/flutterwave/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: initialPrice || 0, name, email, plan: initialPlan })
          });
          const data = await resp.json();
          if (!resp.ok) throw new Error(data.error || 'Could not initialize Flutterwave');
          // Redirect user to the Flutterwave hosted payment page
          if (data.link) {
            window.location.href = data.link;
            return;
          }
          setMessage({ type: 'success', text: `Initialized: ${JSON.stringify(data)}` });
        } else {
          const res = await fetch('/api/checkout/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: initialPrice || 0, name, email, plan: initialPlan })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Payment failed');
          setMessage({ type: 'success', text: `Payment initialized${data.mock ? ' (mock)' : ''}. Reference: ${data.clientSecret}` });
        }
      } else if (method === 'transfer') {
        // Open modal to collect receipt and details before sending
        setShowModal(true);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (f) setReceiptFile(f);
  };

  const handleUpload = async (e) => {
    e && e.preventDefault();
    if (!receiptFile) return setMessage({ type: 'error', text: 'Please attach a receipt file.' });
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('receipt', receiptFile);
      fd.append('name', payerName || name);
      fd.append('email', email);
      fd.append('comment', comment || '');
      fd.append('amount', initialPrice || '');
      fd.append('plan', initialPlan || '');

      const resp = await fetch('/api/checkout/transfer/upload', {
        method: 'POST',
        body: fd
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Upload failed');
      setMessage({ type: 'success', text: data.message || 'Receipt sent. Our team will verify shortly.' });
      setShowModal(false);
      setReceiptFile(null);
      setComment('');
      setPayerName('');
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <h2 className="text-lg font-medium text-black">Plan</h2>
          <div className="mt-4 bg-gray-50 p-4 rounded">
            <div className="text-sm text-black">{initialPlan || 'Selected plan'}</div>
            <div className="mt-2 text-2xl font-bold text-black">{formatAmount(initialPrice) || 'Contact us'}</div>
          </div>
        </div>
        <div className="col-span-1">
          <h2 className="text-lg font-medium text-black">Payment</h2>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-black">Full name</label>
              <input required value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Email</label>
              <input required value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="mt-1 block w-full border border-gray-300 rounded p-2" />
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-black">Payment method</legend>
              <div className="mt-2 space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="method" value="card" checked={method==='card'} onChange={()=>setMethod('card')} />
                  <span>Card (instant)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="method" value="transfer" checked={method==='transfer'} onChange={()=>setMethod('transfer')} />
                  <span>Bank transfer (manual)</span>
                </label>
              </div>
            </fieldset>

            {method === 'card' && (
              <div className="mt-2 bg-gray-100 p-3 rounded">
                <div className="text-sm text-black">Card details are collected securely at checkout. If Stripe or Flutterwave is configured the payment will be processed automatically; otherwise a mock payment will be created for testing.</div>
                <div className="mt-2">
                  <label className="block text-sm text-gray-600">Card number</label>
                  <input className="mt-1 block w-full border border-gray-300 rounded p-2" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input className="block w-full border border-gray-300 rounded p-2" placeholder="MM/YY" />
                  <input className="block w-full border border-gray-300 rounded p-2" placeholder="CVC" />
                </div>
              </div>
            )}

            <div>
              <button type="submit" disabled={loading} className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                {loading ? 'Processing...' : `Pay ${initialPrice || ''}`}
              </button>
            </div>
          </form>
          {message && (
            <div className={`mt-4 p-3 rounded ${message.type==='success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      {/* Transfer modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-xl w-full p-6">
            <h3 className="text-lg font-medium text-black">Upload payment receipt</h3>
            <p className="text-sm text-black mt-1">Attach your bank transfer receipt, add your name and any notes, then send. We'll notify the team via WhatsApp.</p>
            <form className="mt-4 space-y-4" onSubmit={handleUpload} onDrop={handleFileDrop} onDragOver={(e)=>e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-black">Payer name</label>
                <input value={payerName} onChange={(e)=>setPayerName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Receipt (image/pdf)</label>
                <div className="mt-1 flex items-center">
                  <input type="file" accept="image/*,.pdf" onChange={handleFileDrop} />
                </div>
                {receiptFile && <div className="mt-2 text-sm text-black">Attached: {receiptFile.name}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Additional comment</label>
                <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded p-2"></textarea>
              </div>
              <div className="flex space-x-2 justify-end">
                <button type="button" onClick={()=>{setShowModal(false); setReceiptFile(null);}} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? 'Sending...' : 'Send receipt'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
