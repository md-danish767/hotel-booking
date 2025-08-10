import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Title from './Title';
import StarRating from './StarRating';
import { assets } from '../assets/assets';

const Testimonial = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/public/reviews');
                setReviews(response.data);
            } catch (err) {
                setError('Failed to fetch testimonials.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) return <div className="text-center py-20">Loading reviews...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
    if (reviews.length === 0) return null;

    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
            <Title title='Testimonials' subTitle='Hear from our happy guests about their unforgettable experiences with our exceptional services.' />
            <div className='flex flex-wrap justify-center gap-6 mt-20'>
                {reviews.map((review, index) => (
                    <div key={review.id} className='max-w-md bg-white p-6 rounded-xl shadow-lg border border-gray-200'>
                        <div className='flex items-center gap-2'>
                            <StarRating rating={review.rating} />
                            <p className='font-medium text-gray-800'>{review.userName}</p>
                        </div>
                        <p className='mt-4 text-gray-600'>{review.comment}</p>
                        {review.hotelName && (
                            <p className='mt-2 text-sm text-gray-400'>- Reviewed for {review.hotelName}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonial;