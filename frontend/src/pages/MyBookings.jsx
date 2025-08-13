import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setError("You must be logged in to view your bookings.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setBookings(response.data);
            } catch (err) {
                setError('Failed to fetch bookings.');
                console.error(err);
                toast.error('Failed to fetch bookings.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return <div className="text-center py-10">Loading bookings...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    if (bookings.length === 0) return <div className="text-center py-10 text-gray-500">You have no bookings yet.</div>;
    
    return (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title title='My Bookings' subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks' align='left'/>
            <div className='max-w-6xl mt-8 w-full text-gray-800'>
                <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
                    <div className='w-1/3'>Hotels</div>
                    <div className='w-1/3'>Date & Timings</div>
                    <div className='w-1/3'>Payment</div>
                </div>
                {bookings.map((booking) => (
                    <div key={booking.id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>
                        <div className='flex flex-col md:flex-row'>
                            {booking.roomImages && booking.roomImages.length > 0 && (
                                <img src={`${import.meta.env.VITE_API_URL}${booking.roomImages[0]}`} alt="hotel-img" className='min-md:w-44 rounded shadow object-cover' />
                            )}
                            <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                                <p className='font-playfair text-2xl'>{booking.hotelName}<span className='font-inter text-sm'> ({booking.roomType})</span></p>
                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <img src={assets.locationIcon} alt="location-icon" />
                                    <span>{booking.hotelAddress}</span>
                                </div>
                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <img src={assets.guestsIcon} alt="guests-icon" />
                                    <span>Guests: {booking.guestCount}</span>
                                </div>
                                <p className='text-base'>Total: Rs.{booking.totalPrice?.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className='flex flex-row md:items-center md:gap mt-3 gap-8'>
                            <div><p>Check-In:</p><p className='className="text-gray-500 text-sm"'>{new Date(booking.checkInDate).toDateString()}</p></div>
                            <div><p>Check-Out:</p><p className='className="text-gray-500 text-sm"'>{new Date(booking.checkOutDate).toDateString()}</p></div>
                        </div>
                        <div className='flex flex-col items-start justify-center pt-3'>
                            <div className='flex items-center gap-2'>
                                <div className={`h-3 w-3 rounded-full ${booking.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                <p className={`text-sm ${booking.status === 'CONFIRMED' ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {booking.status}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookings;