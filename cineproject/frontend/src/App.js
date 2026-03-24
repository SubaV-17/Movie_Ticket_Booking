import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import { Navbar } from './components/Layout';
import Home        from './pages/Home';
import Movies      from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import SeatSelection from './pages/SeatSelection';
import Payment     from './pages/Payment';
import Confirmed   from './pages/Confirmed';
import { Login, Register } from './pages/Auth';
import MyBookings  from './pages/MyBookings';
import Contact     from './pages/Contact';
import AdminPanel from './pages/AdminPanel';

const NoNav = ({ children }) => <>{children}</>;
const WithNav = ({ children }) => <><Navbar />{children}</>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Auth pages — no navbar */}
        <Route path="/login"    element={<NoNav><Login /></NoNav>} />
        <Route path="/register" element={<NoNav><Register /></NoNav>} />

        {/* All other pages — with navbar */}
        <Route path="/" element={<WithNav><Home /></WithNav>} />
        <Route path="/movies" element={<WithNav><Movies /></WithNav>} />
        <Route path="/movies/:id" element={<WithNav><MovieDetail /></WithNav>} />
        <Route path="/seats/:id" element={<WithNav><SeatSelection /></WithNav>} />
        <Route path="/payment/:id" element={<WithNav><Payment /></WithNav>} />
        <Route path="/confirmed" element={<WithNav><Confirmed /></WithNav>} />
        <Route path="/bookings" element={<WithNav><MyBookings /></WithNav>} />
        <Route path="/contact" element={<WithNav><Contact /></WithNav>} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<WithNav><Home /></WithNav>} />
      </Routes>
    </BrowserRouter>
  );
}
