import React, { useState, useEffect } from 'react';
import Title from '../../components/Title';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const ListHotel = () => {
    const [hotels, setHotels] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchHotels = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                console.error('No JWT token found');
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor/hotels`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setHotels(response.data);
            } catch (error) {
                console.error('Error fetching hotels:', error.response?.data || error.message);
            }
        };

        fetchHotels();
    }, []);

     const handleAddRoomClick = (hotelId) => {
        navigate(`/vendor/add-room/${hotelId}`);
    };

    return (
        <div>
            <Title align='left' font='outfit' title='Hotel Listings' subTitle='View and manage all your listed hotels.' />
            <p className='text-gray-500 mt-8'>All Hotels</p>
            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>City</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Address</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {hotels.map((hotel) => (
                            <tr key={hotel.id}>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {hotel.name}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                    {hotel.city}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                    {hotel.address}
                                </td>
                                 <td className='py-3 px-4 border-t border-gray-300 text-sm text-center'>
                                    <button 
                                        onClick={() => handleAddRoomClick(hotel.id)}
                                        className='text-blue-600 hover:underline mx-2'
                                    >
                                        Add Rooms
                                    </button>
                                    <button className='text-red-600 hover:underline mx-2'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListHotel;