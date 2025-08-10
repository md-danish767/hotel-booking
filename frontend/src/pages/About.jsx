import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      <div className="max-w-7xl mx-auto">
        <Title
          title='Our Story'
          subTitle='Discover our mission, our values, and the passion that drives us to create unforgettable experiences.'
          align='center'
        />

        {/* Section 1: Our Mission */}
        <div className="flex flex-col md:flex-row gap-8 items-center mt-16">
          <div className="md:w-1/2 group">
            <img 
              src={assets.about}
              alt="Our Mission"
              className="w-full rounded-xl shadow-lg h-96 object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-playfair text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a world where finding the perfect place to stay is not just a transaction, but the start of a story. Our platform is built on the belief that every traveler, whether for business or leisure, deserves an experience that is seamless, personalized, and truly memorable. We are dedicated to connecting travelers with unique properties and exceptional hosts who share our passion for hospitality.
            </p>
          </div>
        </div>

        {/* Section 2: Our Values */}
        <div className="flex flex-col md:flex-row-reverse gap-8 items-center mt-16">
          <div className="md:w-1/2 group">
            <img 
              src={assets.about2}
              alt="Our Values"
              className="w-full rounded-xl shadow-lg h-96 object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-playfair text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600 leading-relaxed">
              We are guided by a commitment to integrity, transparency, and community. We believe in empowering our vendors with the tools they need to succeed and providing our customers with the trust and reliability they deserve. Our platform is a reflection of our core values: to build a travel community that is both innovative and human-centered.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <h2 className='text-3xl font-playfair text-gray-800 mb-4'>Join Our Community</h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Whether you are a traveler seeking your next adventure or a property owner looking to share your space, we invite you to join us.
          </p>
          <button onClick={() => navigate('/register')} className='px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors mt-6'>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;