import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createOrder, getOrdersByUserId, getOrderDetailsByOrderId } from '../../utils/API/orderApi';

// Thunk để tạo đơn hàng mới
export const createNewOrder = createAsyncThunk('orders/create', async (order) => {
    const response = await createOrder(order);
    return response;
});

// Thunk để lấy đơn hàng theo userId
export const fetchOrdersByUserId = createAsyncThunk('orders/fetchByUserId', async (userId) => {
    const response = await getOrdersByUserId(userId);
    return response;
});

// Thunk để lấy chi tiết đơn hàng theo orderId
export const fetchOrderDetailsByOrderId = createAsyncThunk('orders/fetchDetailsByOrderId', async (orderId) => {
    const response = await getOrderDetailsByOrderId(orderId);
    return response;
});

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        orderDetails: [],
        order: null,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createNewOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createNewOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.order = action.payload;
            })
            .addCase(createNewOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchOrdersByUserId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrdersByUserId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchOrdersByUserId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchOrderDetailsByOrderId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrderDetailsByOrderId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orderDetails = action.payload;
            })
            .addCase(fetchOrderDetailsByOrderId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default ordersSlice.reducer;