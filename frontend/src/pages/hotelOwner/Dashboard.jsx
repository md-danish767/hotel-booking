import React, { useState, useEffect, useCallback } from 'react';
import Title from './../../components/Title';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = useCallback(async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError("Authorization token missing.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setDashboardData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);
    
    const handleApproveBooking = async (bookingId) => {
        const token = localStorage.getItem('jwtToken');
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/bookings/vendor/${bookingId}/approve`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            toast.success('Booking approved successfully!');
            fetchDashboardData();
        } catch (err) {
            toast.error('Failed to approve booking: ' + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    }

    if (!dashboardData) {
        return <div className="text-center py-10 text-gray-500">No data available.</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center">
                <Title align='left' font='outfit' title='Dashboard' subTitle='Monitor your room listings, track bookings and analyze revenue-all in one place. Stay updated real-time insights to ensure smooth operations.'/>
                <button
                    onClick={fetchDashboardData}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dull transition-colors"
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8'>
                <div className='bg-white rounded-xl shadow-lg flex p-4'>
                    <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-gray-500 text-lg'>Total Bookings</p>
                        <p className='text-gray-800 text-2xl'>{dashboardData.totalBookings || 0}</p>
                    </div>
                </div>
                <div className='bg-white rounded-xl shadow-lg flex p-4'>
                    <img src={assets.pendingBookingIcon} alt="" className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-yellow-600 text-lg'>Pending Bookings</p>
                        <p className='text-gray-800 text-2xl'>{dashboardData.pendingBookings || 0}</p>
                    </div>
                </div>
                <div className='bg-white rounded-xl shadow-lg flex p-4'>
                    <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-green-600 text-lg'>Total Revenue</p>
                        <p className='text-gray-800 text-2xl'>Rs.{dashboardData.totalRevenue ? dashboardData.totalRevenue.toFixed(2) : '0.00'}</p>
                    </div>
                </div>
            </div>

            <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>
            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Hotel Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {dashboardData.bookings && dashboardData.bookings.map((item) => (
                            <tr key={item.id}>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {item.user?.username}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                    {item.room?.hotelName}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                    {item.room?.roomType}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                    Rs.{item.totalPrice?.toFixed(2)}
                                </td>
                                <td className='py-3 px-4 border-t border-gray-300 flex'>
                                    <span className={`py-1 px-3 text-xs rounded-full mx-auto font-medium ${item.status === 'CONFIRMED' ? 'bg-green-200 text-green-600' : 'bg-amber-200 text-yellow-600'}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                    {item.status === 'PENDING' ? (
                                        <button 
                                            onClick={() => handleApproveBooking(item.id)}
                                            className='bg-green-500 text-white px-3 py-1 rounded-md text-xs hover:bg-green-600'
                                        >
                                            Approve
                                        </button>
                                    ) : (
                                        <p className='text-gray-400 text-xs'>N/A</p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;