import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import StarRating from './StarRating';

const HotelCard = ({ hotel }) => {
    const navigate = useNavigate();
    
    const handleCardClick = () => {
        navigate(`/hotels/${hotel.id}`);
        window.scrollTo(0, 0);
    };

    console.log('Rendering HotelCard for:', hotel.name, 'with review count:', hotel.reviewCount); // Debugging line

    return (
        <div onClick={handleCardClick} className='bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 w-full md:w-[350px]'>
            <img
                src={hotel.imageUrl ? `http://localhost:8080${hotel.imageUrl}` : `https://placehold.co/400x250/E0E0E0/333333?text=${hotel.name.split(' ')[0]}`}
                alt={hotel.name}
                className='w-full h-48 object-cover'
            />
            <div className='p-6'>
                <h3 className='text-2xl font-playfair text-gray-800 mb-2'>{hotel.name}</h3>
                <div className='flex items-center gap-1 text-gray-500 text-sm mb-2'>
                    <img src={assets.locationIcon} alt="location-icon" className="w-4 h-4" />
                    <span>{hotel.city}, {hotel.country}</span>
                </div>
                <div className='flex items-center gap-1 mt-2'>
                   <StarRating rating={hotel.averageRating} />
                   <p className='ml-2 text-gray-600'>{hotel.reviewCount || 0} reviews</p>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;