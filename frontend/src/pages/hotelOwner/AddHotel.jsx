import React, { useState } from 'react';
import Title from '../../components/Title';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const AddHotel = () => {
    const navigate = useNavigate();
    const [hotelInputs, setHotelInputs] = useState({
        name: '',
        description: '',
        address: '',
        city: '',
        country: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleInputChange = (e) => {
        setHotelInputs({ ...hotelInputs, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        const formData = new FormData();
        formData.append('name', hotelInputs.name);
        formData.append('description', hotelInputs.description);
        formData.append('address', hotelInputs.address);
        formData.append('city', hotelInputs.city);
        formData.append('country', hotelInputs.country);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/vendor/hotels`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Hotel added successfully!');
            navigate('/owner/list-hotel');
        } catch (error) {
            console.error('Error adding hotel:', error.response?.data || error.message);
            alert('Failed to add hotel.');
        }
    };

    return (
        <div className="py-10 md:py-16 px-4 md:px-16 lg:px-24">
            <div className="max-w-2xl mx-auto">
                <Title align='left' font='outfit' title='Add Hotel' subTitle='Provide accurate details for your hotel listing to attract more guests.' />

                <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200 space-y-6">

                    {/* Image Upload Area */}
                    <div className="flex flex-col gap-4 items-center">
                        <p className='text-gray-800 text-lg font-medium'>Hotel Image</p>
                        <label htmlFor="hotelImage" className="cursor-pointer">
                            <img
                                src={imagePreview || assets.uploadArea}
                                alt="Hotel Preview"
                                className='h-32 w-32 object-cover rounded shadow'
                            />
                            <input type="file" id="hotelImage" hidden onChange={handleImageChange} required />
                        </label>
                    </div>

                    {/* Hotel Name */}
                    <div>
                        <p className='text-gray-800'>Hotel Name</p>
                        <input type="text" name="name" value={hotelInputs.name} onChange={handleInputChange} className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full" placeholder="e.g., The Grand Hotel" required />
                    </div>

                    {/* Description */}
                    <div>
                        <p className='text-gray-800'>Description</p>
                        <textarea name="description" value={hotelInputs.description} onChange={handleInputChange} className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full h-24" placeholder="A brief description of your hotel..." required></textarea>
                    </div>

                    {/* Address */}
                    <div>
                        <p className='text-gray-800'>Address</p>
                        <input type="text" name="address" value={hotelInputs.address} onChange={handleInputChange} className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full" placeholder="e.g., 123 Main St" required />
                    </div>

                    {/* City and Country */}
                    <div className='grid sm:grid-cols-2 gap-4'>
                        <div>
                            <p className='text-gray-800'>City</p>
                            <input type="text" name="city" value={hotelInputs.city} onChange={handleInputChange} className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full" placeholder="e.g., New York" required />
                        </div>
                        <div>
                            <p className='text-gray-800'>Country</p>
                            <input type="text" name="country" value={hotelInputs.country} onChange={handleInputChange} className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full" placeholder="e.g., USA" required />
                        </div>
                    </div>

                    <button type="submit" className='bg-primary text-white px-8 py-2 rounded mt-6 cursor-pointer w-full'>Add Hotel</button>
                </form>
            </div>
        </div>
    );
};

export default AddHotel;