import React, { useState, useEffect, useCallback } from 'react';
import { assets, facilityIcons } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import axios from 'axios';

const CheckBox = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
            <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    );
};

const RadioButton = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
            <input type="radio" name="sortOption" checked={selected} onChange={(e) => onChange(label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    );
};

const AllRooms = () => {
    const navigate = useNavigate();
    const [openFilters, setOpenFilters] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for filters and sorting
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [selectedSortOption, setSelectedSortOption] = useState('Newest First');

    const roomTypes = [
        "Single Bed",
        "Double Bed",
        "Luxury Room",
        "Family Suite",
    ];
    const priceRanges = [
        '0 to 500',
        '501 to 1000',
        '1001 to 1500',
        '1501 to 2000',
    ];
    const sortOptions = [
        'Price Low to High',
        'Price High to Low',
        'Newest First',
    ];

    const handleRoomTypeChange = (isChecked, typeLabel) => {
        if (isChecked) {
            setSelectedRoomTypes([...selectedRoomTypes, typeLabel]);
        } else {
            setSelectedRoomTypes(selectedRoomTypes.filter(type => type !== typeLabel));
        }
    };

    const handlePriceRangeChange = (isChecked, rangeLabel) => {
        if (isChecked) {
            setSelectedPriceRanges([...selectedPriceRanges, rangeLabel]);
        } else {
            setSelectedPriceRanges(selectedPriceRanges.filter(range => range !== rangeLabel));
        }
    };
    
    const handleSortOptionChange = (option) => {
        setSelectedSortOption(option);
    };
    
    const fetchRooms = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (selectedRoomTypes.length > 0) {
                params.roomType = selectedRoomTypes.join(',');
            }
            if (selectedPriceRanges.length > 0) {
                params.priceRange = selectedPriceRanges.join(',');
            }
            if (selectedSortOption) {
                params.sortBy = selectedSortOption;
            }

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/public/rooms`, { params });
            setRooms(response.data);
        } catch (err) {
            setError('Failed to fetch rooms.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedRoomTypes, selectedPriceRanges, selectedSortOption]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const handleClearFilters = () => {
        setSelectedRoomTypes([]);
        setSelectedPriceRanges([]);
        setSelectedSortOption('Newest First');
    };

    if (loading) {
        return <div className="text-center py-10">Loading rooms...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    }

    if (rooms.length === 0) {
        return <div className="text-center py-10 text-gray-500">No rooms available.</div>;
    }

    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24'>
            <div>
                <div className='flex flex-col items-start text-left'>
                    <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel rooms</h1>
                    <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
                </div>
                {rooms.map((room) => (
                    <div key={room.id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'>
                        <img
                            onClick={() => { navigate(`/rooms/${room.id}`); scrollTo(0, 0); }}
                            src={room.images[0]} alt="hotel-img" title='View Room Details'
                            className='max-h65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'
                        />
                        <div className='md:w-1/2 flex flex-col gap-2'>
                            <p className='text-gray-500'>{room.hotelCity}</p>
                            <p
                                onClick={() => { navigate(`/rooms/${room.id}`); scrollTo(0, 0); }}
                                className='text-gray-800 text-3xl font-playfair cursor-pointer'
                            >
                                {room.hotelName}
                            </p>
                            <div className='flex items-center'>
                                <StarRating />
                                <p className='ml-2'>200+ reviews</p>
                            </div>
                            <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                                <img src={assets.locationIcon} alt="location-icon" />
                                <span>{room.hotelAddress}</span>
                            </div>
                            <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                                {room.amenities.map((item, index) => (
                                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                                        <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                        <p className='text-xs'>{item}</p>
                                    </div>
                                ))}
                            </div>
                            <p className='text-xl font-medium text-gray-700'>Rs.{room.pricePerNight}/night</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16'>
                <div className={`flex items-center justify-between px-5 py-2.5 min-1g: border-b border-gray-300 ${openFilters && "border-b"}`}>
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
                        <p className='font-medium text-gray-800 pb-2'>Room Types</p>
                        {roomTypes.map((type, index) => (
                            <CheckBox key={index} label={type} selected={selectedRoomTypes.includes(type)} onChange={handleRoomTypeChange} />
                        ))}
                    </div>
                    <div className='px-5 pt-5'>
                        <p className='font-medium text-gray-800 pb-2'>Price Range</p>
                        {priceRanges.map((range, index) => (
                            <CheckBox key={index} label={`Rs. ${range}`} selected={selectedPriceRanges.includes(range)} onChange={handlePriceRangeChange} />
                        ))}
                    </div>
                    <div className='px-5 pt-5 pb-7'>
                        <p className='font-medium text-gray-800 pb-2'>Sort By</p>
                        {sortOptions.map((option, index) => (
                            <RadioButton key={index} label={option} selected={selectedSortOption === option} onChange={handleSortOptionChange} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllRooms;