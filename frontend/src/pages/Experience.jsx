import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';

const Experience = () => {
    return (
        <div className='flex flex-col'>
            {/* Parallax Hero Section */}
            <div className='relative flex flex-col items-center justify-center text-white text-center h-screen bg-fixed bg-cover bg-center' style={{ backgroundImage: `url(${assets.exp1})` }}>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative px-4">
                    <h1 className='font-playfair text-4xl md:text-6xl font-bold max-w-3xl leading-tight'>
                        Unforgettable Journeys Begin Here
                    </h1>
                    <p className='mt-4 text-lg md:text-xl max-w-2xl'>
                        Explore our world of exceptional stays and bespoke adventures, curated just for you.
                    </p>
                </div>
            </div>

            <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
                <Title
                    title='Curated Experiences'
                    subTitle='Discover unique and unforgettable stays, from urban escapes to serene countryside retreats.'
                    align='center'
                />

                {/* Section 1: Unrivaled Hotels */}
                <div className="flex flex-col md:flex-row gap-8 items-center mt-16">
                    <div className="md:w-1/2 group">
                        <img 
                            src={assets.exp2}
                            alt="Luxury Hotel"
                            className="w-full rounded-xl shadow-lg h-96 object-cover transform transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-playfair text-gray-800 mb-4">Unrivaled Stays</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Every journey deserves a remarkable place to stay. Our collection of hotels is meticulously selected for its unique character, exceptional service, and prime locations. From boutique guesthouses with local charm to grand resorts offering every luxury imaginable, your perfect haven awaits.
                        </p>
                    </div>
                </div>

                {/* Section 2: Exquisite Villas */}
                <div className="flex flex-col md:flex-row-reverse gap-8 items-center mt-16">
                    <div className="md:w-1/2 group">
                        <img 
                            src={assets.exp3}
                            alt="Serene Villa"
                            className="w-full rounded-xl shadow-lg h-96 object-cover transform transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-playfair text-gray-800 mb-4">Exquisite Villas</h2>
                        <p className="text-gray-600 leading-relaxed">
                            For the ultimate in privacy and bespoke experiences, our villas offer a sanctuary away from the world. Whether you seek a secluded mountain cabin or a sun-drenched estate by the sea, each villa is a home with an adventure. Live your fantasy, one unforgettable stay at a time.
                        </p>
                    </div>
                </div>

                {/* Section 3: Captivating Destinations */}
                <div className="flex flex-col md:flex-row gap-8 items-center mt-16">
                    <div className="md:w-1/2 group">
                        <img 
                            src={assets.exp4}
                            alt="Unique Destinations"
                            className="w-full rounded-xl shadow-lg h-96 object-cover transform transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-playfair text-gray-800 mb-4">Captivating Destinations</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We believe that the destination is just as important as the journey. Our platform connects you with properties in the world’s most mesmerizing locations, from the historic streets of European capitals to the breathtaking landscapes of Asian islands.
                        </p>
                    </div>
                </div>

                <div className="text-center mt-20">
                    <button onClick={() => window.scrollTo(0, 0) || navigate('/hotels')} className='px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors'>
                        Start Your Journey Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Experience;