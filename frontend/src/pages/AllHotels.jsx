import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import StarRating from '../components/StarRating';
import { CheckBox, RadioButton } from '../components/FilterComponents';

const AllHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openFilters, setOpenFilters] = useState(false);

    const [availableCities, setAvailableCities] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedSortOption, setSelectedSortOption] = useState('Name A-Z');

    const navigate = useNavigate();
    const location = useLocation();
    
    const sortOptions = ['Name A-Z', 'Name Z-A', 'City A-Z', 'City Z-A'];

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/public/cities');
                setAvailableCities(response.data);
            } catch (err) {
                console.error('Failed to fetch cities.');
            }
        };
        fetchCities();
    }, []);

    const fetchHotels = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (selectedCities.length > 0) {
                params.append('city', selectedCities.join(','));
            }
            if (selectedSortOption) {
                params.append('sortBy', selectedSortOption);
            }

            const response = await axios.get('http://localhost:8080/api/public/hotels', { params });
            setHotels(response.data);
        } catch (err) {
            setError('Failed to fetch hotels.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedCities, selectedSortOption]);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const cityFromUrl = urlParams.get('city');

        // Set initial state from URL
        if (cityFromUrl) {
            setSelectedCities(cityFromUrl.split(','));
        }

        // Fetch hotels
        fetchHotels();
    }, [location.search, fetchHotels]);

    const handleCityFilterChange = (isChecked, cityLabel) => {
        let newSelectedCities;
        if (isChecked) {
            newSelectedCities = [...selectedCities, cityLabel];
        } else {
            newSelectedCities = selectedCities.filter(city => city !== cityLabel);
        }
        setSelectedCities(newSelectedCities);
        // This will trigger fetchHotels due to state change
    };

    const handleSortOptionChange = (option) => {
        setSelectedSortOption(option);
        // This will trigger fetchHotels due to state change
    };
    
    const handleClearFilters = () => {
        setSelectedCities([]);
        setSelectedSortOption('Name A-Z');
    };

    if (loading) {
        return <div className="text-center py-10">Loading hotels...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    }

    if (hotels.length === 0) {
        return <div className="text-center py-10 text-gray-500">No hotels available.</div>;
    }

    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24'>
            <div>
                <div className='flex flex-col items-start text-left'>
                    <h1 className='font-playfair text-4xl md:text-[40px]'>Our Hotels</h1>
                    <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Explore a wide range of hotels tailored to your preferences.</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8'>
                    {hotels.map((hotel) => (
                        <div key={hotel.id} className='bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300'
                             onClick={() => navigate(`/hotels/${hotel.id}`)}>
                            <img
                                src={hotel.imageUrl ? `http://localhost:8080${hotel.imageUrl}` : `https://placehold.co/400x250/E0E0E0/333333?text=${hotel.name.split(' ')[0]}`}
                                alt={hotel.name}
                                className='w-full h-48 object-cover'
                            />
                            <div className='p-6'>
                                <h3 className='text-2xl font-playfair text-gray-800 mb-2'>{hotel.name}</h3>
                                <p className='text-gray-600 mb-3'>{hotel.description.substring(0, Math.min(hotel.description.length, 100))}...</p>
                                <div className='flex items-center gap-1 text-gray-500 text-sm mb-2'>
                                    <img src={assets.locationIcon} alt="location-icon" className="w-4 h-4" />
                                    <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
                                </div>
                                <div className='flex items-center gap-1 mt-2'>
                                    <StarRating rating={hotel.averageRating} />
                                    <p className='ml-2 text-gray-600'>{hotel.reviewCount} reviews</p>
                                </div>
                                <button className='mt-4 bg-primary text-white px-5 py-2 rounded-full hover:bg-primary-dull transition-colors'>
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16'>
                <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && "border-b"}`}>
                    <p className='text-base font-medium text-gray-800'>FILTERS</p>
                    <div className='text-xs cursor-pointer'>
                        <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>
                            {openFilters ? 'HIDE' : 'SHOW'}
                        </span>
                        <span onClick={handleClearFilters} className='hidden lg:block'>CLEAR</span>
                    </div>
                </div>

                <div className={` ${openFilters ? 'h-auto' : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
                    <div className='px-5 pt-5'>
                        <p className='font-medium text-gray-800 pb-2'>Filter by City</p>
                        {availableCities.map((city, index) => (
                            <CheckBox
                                key={index}
                                label={city}
                                selected={selectedCities.includes(city)}
                                onChange={(isChecked) => handleCityFilterChange(isChecked, city)}
                            />
                        ))}
                    </div>

                    <div className='px-5 pt-5 pb-7'>
                        <p className='font-medium text-gray-800 pb-2'>Sort By</p>
                        {sortOptions.map((option, index) => (
                            <RadioButton
                                key={index}
                                label={option}
                                selected={selectedSortOption === option}
                                onChange={handleSortOptionChange}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllHotels;