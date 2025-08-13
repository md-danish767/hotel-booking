import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import HotelCard from '../components/HotelCard';
import axios from 'axios';

const FeaturedDestination = () => {
    const navigate = useNavigate();
    const [featuredHotels, setFeaturedHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedHotels = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/public/featured-hotels`);
                setFeaturedHotels(response.data);
            } catch (err) {
                setError('Failed to fetch featured hotels.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedHotels();
    }, []);

    if (loading) {
        return <div className="text-center py-20">Loading featured hotels...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">Error: {error}</div>;
    }

    if (featuredHotels.length === 0) {
        return null;
    }

    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
            <Title title='Featured Destination' subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.'/>
            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
                {featuredHotels.slice(0, 4).map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                ))}
            </div>
            <button onClick={() => { navigate('/hotels'); window.scrollTo(0, 0); }} className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
                View All Destinations
            </button>
        </div>
    );
};

export default FeaturedDestination;