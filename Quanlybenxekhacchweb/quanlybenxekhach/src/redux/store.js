import { configureStore } from '@reduxjs/toolkit';
import busReducer from '../features/bus/busSlice';
import routeReducer from '../features/route/routeSlice';
import customerReducer from '../features/customer/customerSlice';
// import authReducer from '../features/auth/authSlice';
import driverReducer from '../features/driver/driverSlice';
import seatReducer from '../features/seat/seatSlice';
import ticketReducer from '../features/ticket/ticketSlice';
import tripReducer from '../features/trip/tripSlice';
import userReducer from '../features/user/userSlice';
import orderReducer from '../features/order/orderSlice';
const store = configureStore({
  reducer: {
    buses: busReducer,
    routes: routeReducer,
    customers: customerReducer,
    drivers: driverReducer,
    seats: seatReducer,
    tickets: ticketReducer,
    trips: tripReducer,
    users: userReducer,
    orders: orderReducer,
    orderDetails: orderReducer,
  },
});
export default store;