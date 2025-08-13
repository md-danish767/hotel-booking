import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets, facilityIcons } from '../assets/assets';

const RoomCard = ({ room, handleBookNow }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-4 rounded-xl shadow-lg">
            <img src={`${import.meta.env.VITE_API_URL}${room.images[0]}`} alt={room.roomType} className="w-full h-48 object-cover rounded-xl" />
            <h3 className="text-xl font-playfair mt-4">{room.roomType}</h3>
            <p className="text-gray-600">Price: Rs.{room.pricePerNight}/night</p>
            <p className="text-gray-600">Capacity: {room.capacity} guests</p>
            <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                {room.amenities.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                        <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                        <p className='text-xs'>{item}</p>
                    </div>
                ))}
            </div>
            <button onClick={() => handleBookNow(room.id)} className="mt-4 bg-primary text-white w-full p-2 rounded-md">Book Now</button>
        </div>
    );
};

export default RoomCard;