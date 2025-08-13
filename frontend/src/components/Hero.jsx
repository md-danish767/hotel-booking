import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const Hero = () => {
    const [cities, setCities] = useState([]);
    const [city, setCity] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);
    const navigate = useNavigate();

    // Fetch dynamic list of cities from the backend
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/public/cities`);
                setCities(response.data);
            } catch (error) {
                console.error('Failed to fetch cities:', error);
            }
        };
        fetchCities();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (city) params.append('city', city);
        if (checkInDate) params.append('checkInDate', checkInDate);
        if (checkOutDate) params.append('checkOutDate', checkOutDate);
        if (guests > 0) params.append('guests', guests);

        navigate(`/hotels?${params.toString()}`);
    };

    return (
        <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.jpg")] bg-no-repeat bg-cover bg-center h-screen'>
            <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>Your One Stop Destination</p>
            <h1 className='font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>Discover Your Perfect Gateway Destination</h1>
            <p className='max-w-130 mt-2 text-sm md:text-base'>Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts.Start your journey today.</p>

           

        </div>
    );
};

export default Hero;