import React from 'react';
import { useRouter } from 'next/router';
import CheckoutForm from '../src/components/CheckoutForm';

const CheckoutPage = () => {
  const router = useRouter();
  const { plan = '', price = '' } = router.query;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold">Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">Complete your purchase — secure and simple.</p>
        </div>
        <CheckoutForm initialPlan={plan} initialPrice={price} />
      </div>
    </div>
  );
};

export default CheckoutPage;
