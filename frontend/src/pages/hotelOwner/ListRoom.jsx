import React, { useState, useEffect, useCallback } from 'react';
import Title from '../../components/Title';
import axios from 'axios';
import { assets } from '../../assets/assets';

const ListRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [triggerFetch, setTriggerFetch] = useState(0);

    const fetchRooms = useCallback(async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError('No JWT token found');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor/rooms`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setRooms(response.data);
        } catch (err) {
            setError('Error fetching rooms: ' + (err.response?.data?.message || err.message));
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [triggerFetch]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const handleToggleAvailability = async (roomId) => {
        const token = localStorage.getItem('jwtToken');
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/vendor/rooms/${roomId}/toggle-availability`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            setTriggerFetch(prev => prev + 1);
        } catch (err) {
            setError('Failed to toggle room availability: ' + (err.response?.data?.message || err.message));
            alert('Failed to toggle room availability.');
            console.error(err);
        }
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
        <div>
            <Title align='left' font='outfit' title='Room Listings' subTitle='View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users'/>
            <p className='text-gray-500 mt-8'>All Rooms</p>
            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Hotel</th>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Room Type</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Price / night</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Availability</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {rooms.map((item) => (
                            <tr key={item.id}>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {item.hotelName}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {item.roomType}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                    {item.amenities ? item.amenities.join(', ') : ''}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                    {item.pricePerNight}
                                </td>
                                <td className='py-3 px-4 border-t border-gray-300 text-sm text-center'>
                                    <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                                        <input
                                            type="checkbox"
                                            className='sr-only peer'
                                            checked={item.isAvailable}
                                            onChange={() => handleToggleAvailability(item.id)}
                                        />
                                        <div key={item.id} className='w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200'>
                                            <span className={`dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${item.isAvailable ? 'translate-x-5' : 'translate-x-0'}`}></span>
                                        </div>
                                        <span className={`ml-4 text-xs font-medium ${item.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                                            {item.availabilityStatusMessage}
                                        </span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListRoom;