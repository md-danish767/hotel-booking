import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../assets/assets';

const CityDropdown = () => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const navigate = useNavigate();

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

    const handleSearch = () => {
        if (selectedCity) {
            navigate(`/hotels?city=${selectedCity}`);
        }
    };

    return (
        <div className="fixed top-20 md:top-24 left-0 w-full z-40 bg-white shadow-md">
            <div className="max-w-7xl mx-auto py-4 px-4 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between">
                <p className="text-gray-600 font-medium hidden sm:block">Find hotels in your city</p>
                <div className="flex-1 max-w-sm ml-0 sm:ml-8 flex gap-2">
                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="flex-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="">Select a city</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleSearch}
                        className="bg-primary text-white p-2 rounded-md hover:bg-primary-dark transition-colors"
                        disabled={!selectedCity}
                    >
                        <img src={assets.searchIcon} alt="search" className="w-5 h-5 invert" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CityDropdown;