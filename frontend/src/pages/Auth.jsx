import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({
        email: '', password: '', firstName: '', lastName: '', phoneNumber: '', isHotelOwner: false // Changed from role to a boolean
    });

    const isLoginPath = location.pathname === '/login';

    const handleLoginChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRegisterForm({
            ...registerForm,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', loginForm);
            localStorage.setItem('jwtToken', response.data.accessToken);
            localStorage.setItem('userRole', response.data.role);
            toast.success('Login successful!');
            const userRole = response.data.role;
            if (userRole === 'ROLE_VENDOR') {
                navigate('/vendor');
            } else if (userRole === 'ROLE_USER') {
                navigate('/my-bookings');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            toast.error('Login failed. Please check your credentials.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            const registerDto = {
                ...registerForm,
                role: registerForm.isHotelOwner ? 'ROLE_VENDOR' : 'ROLE_USER' // Set the role based on the checkbox
            };

            await axios.post('http://localhost:8080/api/auth/register', registerDto);
            toast.success('Registration successful! You can now log in.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
            toast.error('Registration failed. Please try again.');
        }
    };

    return (
        <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 flex items-center justify-center min-h-screen">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-3xl font-playfair mb-6 text-center text-gray-800">
                    {isLoginPath ? 'Welcome Back!' : 'Create an Account'}
                </h2>
                
                {isLoginPath ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={loginForm.email}
                                onChange={handleLoginChange}
                                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={loginForm.password}
                                onChange={handleLoginChange}
                                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-primary text-white p-3 rounded-md font-medium hover:bg-primary-dark transition-all"
                        >
                            Login
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={registerForm.email}
                                onChange={handleRegisterChange}
                                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={registerForm.password}
                                onChange={handleRegisterChange}
                                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Create a password"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={registerForm.firstName}
                                    onChange={handleRegisterChange}
                                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={registerForm.lastName}
                                    onChange={handleRegisterChange}
                                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={registerForm.phoneNumber}
                                onChange={handleRegisterChange}
                                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        {/* Checkbox for hotel owner */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isHotelOwner"
                                checked={registerForm.isHotelOwner}
                                onChange={handleRegisterChange}
                                className="h-4 w-4 rounded text-primary focus:ring-primary border-gray-300"
                            />
                            <label className="text-gray-700 font-medium">Register as a hotel owner</label>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white p-3 rounded-md font-medium hover:bg-gray-800 transition-all"
                        >
                            Sign Up
                        </button>
                    </form>
                )}

                <p className="mt-6 text-center text-gray-600">
                    {isLoginPath ? "Don't have an account?" : "Already have an account?"}
                    <span onClick={() => navigate(isLoginPath ? '/register' : '/login')} className="text-primary font-medium cursor-pointer ml-1">
                        {isLoginPath ? "Sign Up" : "Login"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Auth;