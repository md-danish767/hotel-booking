import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import RoomCard from '../components/RoomCard';
import { assets, facilityIcons } from '../assets/assets';



const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [allHotelImages, setAllHotelImages] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/public/hotels/${id}`);
                setHotel(response.data);
                
                const roomImages = response.data.rooms.flatMap(room => room.images);
                const allImages = [response.data.imageUrl, ...roomImages];
                setAllHotelImages(allImages);
                setMainImage(response.data.imageUrl);

                const reviewsResponse = await axios.get(`http://localhost:8080/api/public/hotels/${id}/reviews`);
                setReviews(reviewsResponse.data);
                
            } catch (err) {
                setError('Failed to fetch hotel details.');
            } finally {
                setLoading(false);
            }
        };
        fetchHotelDetails();
    }, [id]);

    const handleAvailabilityCheck = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAvailableRooms([]);
        setShowResults(false);

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('Please log in to check availability.');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/public/hotels/${id}/available-rooms`, {
                params: { checkInDate, checkOutDate },
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const roomsFilteredByGuests = response.data.filter(room => room.capacity >= guests);
            setAvailableRooms(roomsFilteredByGuests);
            setShowResults(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to check room availability.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleBookNow = async (roomId) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('Please log in to book a room.');
            navigate('/login');
            return;
        }

        try {
            const bookingDto = {
                roomId,
                checkInDate,
                checkOutDate,
                guestCount: guests,
            };

            const response = await axios.post('http://localhost:8080/api/bookings', bookingDto, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            alert('Booking created successfully! Redirecting to payment...');
            
            // Extract the booking ID from the response and redirect to the payment page
            const bookingId = response.data.id;
            navigate(`/payment/${bookingId}`);

        } catch (error) {
            console.error('Booking failed:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Booking failed.');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('Please log in to submit a review.');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/api/public/hotels/${id}/reviews`, newReview, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setReviews([...reviews, response.data]);
            setNewReview({ rating: 5, comment: '' });
            alert('Review submitted successfully!');
        } catch (error) {
            console.error('Review submission failed:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Review submission failed.');
        }
    };
    
    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
    if (!hotel) return <div className="text-center py-20">No hotel found.</div>;

    return (
        <div className='py-28 md:py-35 px-4 md:px-16 lg: px-24 xl:px-32'>
            {/* Header and Rating */}
            <div className='flex flex-col md: flex-row items-start md:items-center gap-2'>
                <h1 className='text-3x1 md:text-4xl font-playfair'>{hotel.name}</h1>
            </div>
            <div className='flex items-center gap-1 mt-2'>
                <StarRating rating={hotel.averageRating} />
                <p className='m1-2'>{hotel.reviewCount || 0} reviews</p>
            </div>
            <div className='flex items-center gap-1 text-gray-500 mt-2'><img src={assets.locationIcon} alt="location-icon" /><span>{hotel.address}, {hotel.city}</span></div>

            {/* Main Content Area: Left side for images, right for form */}
            <div className="flex flex-col md:flex-row mt-6 gap-6">

                {/* Left Side: Image Gallery */}
                <div className="md:w-2/3 flex flex-col gap-4">
                    <img src={`http://localhost:8080${mainImage}`} alt="Main Hotel" className='w-full h-96 object-cover rounded-xl shadow-md' />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {allHotelImages.slice(0, 4).map((image, index) => (
                            <img
                                key={index}
                                src={`http://localhost:8080${image}`}
                                alt={`Room image ${index}`}
                                className={`w-full h-24 object-cover rounded-xl shadow-md cursor-pointer transition-transform duration-200 ${mainImage === image ? 'ring-2 ring-primary scale-105' : 'hover:scale-105'}`}
                                onClick={() => setMainImage(image)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Side: Availability Form */}
                <div className="md:w-1/3">
                    <form onSubmit={handleAvailabilityCheck} className='bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl border border-gray-200'>
                        <h2 className="text-xl font-medium mb-4">Check Availability</h2>
                        <div className='flex flex-col gap-4 text-gray-500'>
                            <div className='flex flex-col'>
                                <label htmlFor="checkInDate" className='font-medium'>Check-In</label>
                                <input type="date" id='checkInDate' value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="checkOutDate" className='font-medium'>Check-Out</label>
                                <input type="date" id='checkOutDate' value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="guests" className='font-medium'>Guests</label>
                                <input type="number" id='guests' value={guests} onChange={(e) => setGuests(parseInt(e.target.value))} placeholder='0' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>
                            </div>
                        </div>
                        <button type='submit' className='bg-primary hover:bg-primary-dull active: scale-95 transition-all text-white rounded-md w-full mt-6 py-3 text-base cursor-pointer'>Check Availability</button>
                    </form>
                </div>
            </div>
            
            {/* Hotel Description and Amenities */}
            <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
                <h2 className='text-3xl font-playfair'>Hotel Description</h2>
                <p>{hotel.description}</p>
            </div>

            {/* Common Specifications */}
            <div className='mt-10 space-y-4'>
                <h2 className='text-3xl font-playfair'>Hotel Facilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {hotel.rooms.flatMap(room => room.amenities).filter((value, index, self) => self.indexOf(value) === index).map((amenity, index) => (
                        <div key={index} className='flex items-start gap-2 p-4 bg-gray-100 rounded-lg'>
                            <img src={facilityIcons[amenity]} alt={amenity} className='w-6' />
                            <div>
                                <p className='text-base font-medium'>{amenity}</p>
                                <p className='text-gray-500 text-sm'>Available in some rooms</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Reviews Section */}
            <div className='mt-16'>
                <h2 className='text-3xl font-playfair'>Customer Reviews ({reviews.length})</h2>
                <div className='mt-8 space-y-6'>
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.id} className='p-4 bg-white rounded-lg shadow-sm border border-gray-200'>
                                <div className='flex items-center gap-2'>
                                    <StarRating rating={review.rating} />
                                    <p className='font-medium text-gray-800'>{review.userName}</p>
                                    <p className='text-sm text-gray-500'>- {new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                                <p className='mt-2 text-gray-600'>{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className='text-center text-gray-500'>No reviews yet. Be the first to review this hotel!</p>
                    )}
                </div>
                
                {/* Review Submission Form */}
                <form onSubmit={handleSubmitReview} className='mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200'>
                    <h3 className='text-xl font-playfair'>Write a Review</h3>
                    <div className='mt-4 flex flex-col gap-4'>
                        <div>
                            <p className='text-gray-800'>Rating</p>
                            <select 
                                value={newReview.rating} 
                                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })} 
                                className="border border-gray-300 mt-1 rounded p-2 w-full"
                            >
                                {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Stars</option>)}
                            </select>
                        </div>
                        <div>
                            <p className='text-gray-800'>Comment</p>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                className="border border-gray-300 mt-1 rounded p-2 w-full h-24"
                                placeholder='Your review here...'
                                required
                            ></textarea>
                        </div>
                    </div>
                    <button type="submit" className='bg-primary text-white px-8 py-2 rounded mt-4 cursor-pointer'>Submit Review</button>
                </form>
            </div>
            
            {/* Available Rooms Display */}
            {showResults && (
                <>
                    <h2 className="text-3xl font-playfair mt-16">Available Rooms</h2>
                    {availableRooms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {availableRooms.map(room => (
                                <RoomCard key={room.id} room={room} handleBookNow={handleBookNow} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center mt-8 text-gray-500">No rooms available for the selected dates or guest count.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default HotelDetails;