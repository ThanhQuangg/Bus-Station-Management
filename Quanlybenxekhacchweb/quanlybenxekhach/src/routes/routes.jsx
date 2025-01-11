import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import Schedule from '../pages/home/Schedule';
import Auth from '../pages/user/Auth';
import CartPage from '../pages/cart/CartPage';
import TicketBooking from '../pages/home/TicketBooking';
import Order from '../pages/order/orderPage';
import AdminBus from '../pages/bus/AdminBus';
import AdminDriver from '../pages/driver/AdminDriver';
import AdminRoute from '../pages/route/AdminRoute';
import AdminSeat from '../pages/seat/AdminSeat';
import AdminTicket from '../pages/ticket/AdminTicket';
import AdminTrip from '../pages/trip/AdminTrip';
import AdminUser from '../pages/user/AdminUser';
import PrivateRoute from '../pages/home/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/schedule' element={<Schedule/>}/>
        <Route path='/login' element={<Auth/>}/>
        <Route path='/cart' element={<CartPage/>}/>
        <Route path='/booking' element={<TicketBooking/>}/>
        <Route path='/order' element={<Order/>}/>
        
        <Route path="/admin/bus" element={ <PrivateRoute role="ROLE_Admin"><AdminBus /></PrivateRoute>} />
        <Route path="/admin/driver" element={<PrivateRoute role="ROLE_Admin"><AdminDriver /></PrivateRoute>} />
        <Route path="/admin/route" element={<PrivateRoute role="ROLE_Admin"><AdminRoute /></PrivateRoute>} />
        <Route path="/admin/seat" element={<PrivateRoute role="ROLE_Admin"><AdminSeat /></PrivateRoute>} />
        <Route path="/admin/ticket" element={<PrivateRoute role="ROLE_Admin"><AdminTicket /></PrivateRoute>} />
        <Route path="/admin/trip" element={<PrivateRoute role="ROLE_Admin"><AdminTrip /></PrivateRoute>} />
        <Route path="/admin/user" element={<PrivateRoute role="ROLE_Admin"><AdminUser /></PrivateRoute>} />
    </Routes> 
  );
};

export default AppRoutes;