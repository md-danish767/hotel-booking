import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import axios from 'axios';

// Load Stripe with your public key
const stripePromise = loadStripe('pk_test_51Ru9OK8avceaSrhiUo83y3VkUKoxgeS8LGc7uLbMCCmvw5g3NL0obVGWEWvIcbhvrIUDhT1lMnh2n18kOvej9Iqt003xfumZ1B');

const PaymentPage = () => {
    const { bookingId } = useParams();
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClientSecret = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token || !bookingId) {
                setError("Booking ID or authorization token missing.");
                setLoading(false);
                return;
            }
            try {
                const response = await axios.post('http://localhost:8080/api/bookings/create-payment-intent', { bookingId }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setClientSecret(response.data);
            } catch (err) {
                console.error('Failed to fetch client secret:', err);
                setError(err.response?.data?.message || "Could not create payment intent.");
            } finally {
                setLoading(false);
            }
        };
        fetchClientSecret();
    }, [bookingId]);

    const options = { clientSecret };

    if (loading) {
        return <div className="text-center py-20">Loading payment details...</div>;
    }
    
    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    return (
        <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 flex justify-center">
            {clientSecret && (
                <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-lg">
                    <h2 className="text-2xl font-playfair mb-4 text-center">Complete Your Payment</h2>
                    <Elements stripe={stripePromise} options={options}>
                        <PaymentForm />
                    </Elements>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;