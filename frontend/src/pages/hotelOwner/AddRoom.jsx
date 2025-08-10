import React, { useState ,useEffect} from 'react'
import { assets } from '../../assets/assets'
import Title from './../../components/Title';
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddRoom = () => {
  const { hotelId: urlHotelId } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null
  })
  const [inputs, setInputs] = useState({
    roomType: '',
    pricePerNight: '',
    amenities: {
      'Free Breakfast': false,
      'Room Service': false,
      'Mountain View': false,
      'Pool Access': false,
    },
    hotelId: urlHotelId || '',
  })

  useEffect(() => {
    if (urlHotelId) {
      setInputs(prevInputs => ({ ...prevInputs, hotelId: urlHotelId }));
    }
  }, [urlHotelId]);

  const handleImageChange = (e, key) => {
    setImages({ ...images, [key]: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (amenity) => {
    setInputs({
      ...inputs,
      amenities: {
        ...inputs.amenities,
        [amenity]: !inputs.amenities[amenity],
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const amenitiesArray = Object.keys(inputs.amenities).filter(key => inputs.amenities[key]);
    
    const roomDto = {
      roomType: inputs.roomType,
      pricePerNight: parseFloat(inputs.pricePerNight),
      amenities: amenitiesArray,
      hotelId: inputs.hotelId,
    };
    formData.append('roomDto', new Blob([JSON.stringify(roomDto)], { type: 'application/json' }));

    Object.values(images).forEach(file => {
      if (file) {
        formData.append('images', file);
      }
    });

    const token = localStorage.getItem('jwtToken');

    try {
      await axios.post('http://localhost:8080/api/vendor/rooms', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Room added successfully!');
      navigate('/vendor/list-room');
    } catch (error) {
      console.error('Error adding room:', error.response?.data || error.message);
      toast.error('Failed to add room.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Title align='left' font='outfit' title='Add Room' subTitle='Fill in the details carefully and accurate room details, pricing, and amenities,  to enhance the user booking experience'/>
      <p className='text-gray-800 mt-10'>Images</p>
      <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <img 
              src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} 
              alt="Room preview" 
              className='cursor-pointer h-32 w-32 object-cover rounded shadow' 
            />
            <input type="file" accept='image/*' id={`roomImage${key}`} hidden onChange={e => handleImageChange(e, key)} />
          </label>
        ))}
      </div>
      <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
        <div className='flex-1 max-w-48'>
          <p className='text-gray-800 mt-4'>Room Type</p>
          <select name="roomType" value={inputs.roomType} onChange={handleInputChange} className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full">
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>
        <div>
          <p className='mt-4 text-gray-800'>
            Price <span className='text-xs'>/night</span>
          </p>
          <input type="number" name="pricePerNight" placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-24' value={inputs.pricePerNight} onChange={handleInputChange} />
        </div>
      </div>
      <p className='text-gray-800 mt-4'>Amenities</p>
      <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index}>
              <input type="checkbox" id={`amenities${index + 1}`} checked={inputs.amenities[amenity]} onChange={() => handleAmenityChange(amenity)} />
              <label htmlFor={`amenities${index + 1}`}>  {amenity}</label>
          </div>
        ))}
      </div>
      <button className='bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer'>Add Room</button>
    </form>
  );
};

export default AddRoom;