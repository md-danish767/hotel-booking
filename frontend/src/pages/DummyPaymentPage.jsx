import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Title from '../components/Title';

const DummyPaymentPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleConfirmPayment = () => {
        setLoading(true);
        // Simulate a delay for payment processing
        setTimeout(() => {
            alert(`Simulated payment successful for Booking ID: ${bookingId}`);
            setLoading(false);
            // Redirect to My Bookings page after payment
            navigate('/my-bookings');
        }, 1500);
    };

    return (
        <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 flex justify-center">
            <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
                <Title title="Payment Gateway" subTitle="Simulating a successful payment." />
                <p className="mt-4 text-lg">Booking ID: <span className="font-bold text-primary">{bookingId}</span></p>
                <button
                    onClick={handleConfirmPayment}
                    className="w-full bg-primary text-white p-3 rounded-md font-medium mt-6 hover:bg-primary-dark transition-all"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Confirm Payment'}
                </button>
            </div>
        </div>
    );
};

export default DummyPaymentPage;