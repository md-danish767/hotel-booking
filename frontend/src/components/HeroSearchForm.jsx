import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSearchForm = () => {
    const navigate = useNavigate();
    const [city, setCity] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);

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
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-full p-2 max-w-4xl mx-auto mt-8">
            {/* City Dropdown */}
            <div className="flex-1 px-4 py-2">
                <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-transparent outline-none border-none"
                >
                    <option value="">Select City</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bangalore">Bangalore</option>
                </select>
            </div>
            {/* Check-in Date */}
            <div className="flex-1 px-4 py-2 border-l border-gray-300">
                <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-transparent outline-none"
                />
            </div>
            {/* Check-out Date */}
            <div className="flex-1 px-4 py-2 border-l border-gray-300">
                <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-transparent outline-none"
                />
            </div>
            {/* Guests */}
            <div className="flex-1 px-4 py-2 border-l border-gray-300">
                <input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full bg-transparent outline-none"
                />
            </div>
            {/* Search Button */}
            <button
                type="submit"
                className="bg-primary text-white rounded-full px-6 py-3 ml-4 hover:bg-primary-dark transition-colors"
            >
                Search
            </button>
        </form>
    );
};

export default HeroSearchForm;