import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://localhost:3000/my-bookings',
            },
        });

        if (result.error) {
            alert(result.error.message);
        } else {
            alert('Payment successful!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button
                disabled={!stripe}
                className="w-full bg-primary text-white p-3 rounded-md font-medium mt-6 hover:bg-primary-dark transition-all"
            >
                Pay
            </button>
        </form>
    );
};

export default PaymentForm;