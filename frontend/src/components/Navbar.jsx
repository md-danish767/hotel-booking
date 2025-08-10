import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from './../assets/assets';

const BookIcon = () => (
    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
    </svg>
);

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/hotels' },
        { name: 'Experience', path: '/experience' },
        { name: 'About', path: '/about' },
    ];

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const role = localStorage.getItem('userRole');
        setIsLoggedIn(!!token);
        setUserRole(role);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUserRole(null);
        navigate('/');
    };

    const getDashboardLink = () => {
        if (userRole === 'ROLE_VENDOR') {
            return '/vendor';
        }
        if (userRole === 'ROLE_USER') {
            return '/my-bookings';
        }
        return '/';
    };

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 bg-white/90 shadow-md text-gray-700 backdrop-blur-md py-3 md:py-4`}>

            <Link to='/'>
                <img src={assets.logo} alt="logo" className={`h-9  opacity-100`} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <Link key={i} to={link.path} className={`group flex flex-col gap-0.5 font-medium text-gray-700`}>
                        {link.name}
                        <div className={`bg-gray-700 h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                    </Link>
                ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                <img src={assets.searchIcon} alt="search" className={`h-7 transition-all duration-500 cursor-pointer`} />

                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        <Link
                            to={getDashboardLink()}
                            className={`flex items-center gap-2 font-medium transition-all duration-500 hover:text-primary text-gray-700`}
                        >
                            {userRole === 'ROLE_VENDOR' ? 'Dashboard' : 'My Bookings'}
                            <BookIcon/>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-red-500 transition-all duration-500 hover:text-red-600 font-medium"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to='/login' className={`font-medium transition-all duration-500 hover:text-primary text-gray-700`}>
                            Login
                        </Link>
                        <Link to='/register' className="bg-black text-white px-6 py-2.5 rounded-full font-medium transition-all duration-500 hover:bg-gray-800">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
            
            {/* Mobile Nav Toggle */}
            <div className="md:hidden flex items-center">
                 <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <img src={assets.menuIcon} alt="menu" className={`h-7 invert`} />
                </button>
            </div>
            
            {/* Mobile Nav Menu */}
             {isMenuOpen && (
                 <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden flex flex-col gap-4 p-4 text-gray-700">
                    {navLinks.map((link, i) => (
                        <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)} className="py-2 px-4 rounded hover:bg-gray-100">
                            {link.name}
                        </Link>
                    ))}
                     <hr/>
                     {isLoggedIn ? (
                         <>
                             <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)} className="py-2 px-4 rounded hover:bg-gray-100">
                                {userRole === 'ROLE_VENDOR' ? 'Dashboard' : 'My Bookings'}
                             </Link>
                             <button onClick={handleLogout} className="py-2 px-4 rounded bg-red-600 text-white">Logout</button>
                         </>
                     ) : (
                         <>
                             <Link to='/login' onClick={() => setIsMenuOpen(false)} className="py-2 px-4 rounded bg-black text-white">Login</Link>
                             <Link to='/register' onClick={() => setIsMenuOpen(false)} className="py-2 px-4 rounded bg-gray-200 text-black">Sign Up</Link>
                         </>
                     )}
                 </div>
             )}
        </nav>
    );
};

export default Navbar;