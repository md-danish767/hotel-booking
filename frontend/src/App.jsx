import React from 'react';
import { Routes, Route, BrowserRouter, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import About from './pages/About'
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import AddRoom from './pages/hotelOwner/AddRoom';
import ListRoom from './pages/hotelOwner/ListRoom';
import AddHotel from './pages/hotelOwner/AddHotel';
import ListHotel from './pages/hotelOwner/ListHotel';
import AllHotels from './pages/AllHotels';
import HotelDetails from './pages/HotelDetails';
import PaymentPage from './pages/PaymentPage';
import MyBookings from './pages/MyBookings';
import AllRooms from './pages/AllRooms';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DummyPaymentPage from './pages/DummyPaymentPage';
import Experience from './pages/Experience';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
     <ToastContainer />
      <Navbar />
      <div className='flex-1'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} /> 
          <Route path="/about" element={<About />} /> 
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          
          {/* Public Routes */}
          <Route path="/hotels" element={<AllHotels />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          
          {/* Vendor-specific routes */}
          <Route path="/vendor" element={<Layout/>}>
            <Route index element={<Dashboard />} />
            <Route path="add-hotel" element={<AddHotel />} />
            <Route path="list-hotel" element={<ListHotel />} />
           <Route path="add-room" element={<AddRoom />} />
            <Route path="add-room/:hotelId" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
          </Route>

         
          <Route path="/payment/:bookingId" element={<DummyPaymentPage />} /> 
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;