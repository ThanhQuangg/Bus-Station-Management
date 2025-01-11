import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCarts, getCartById, getCartByUserId, createCart, updateCart, deleteCart } from '../../utils/Api/cartApi';

export const fetchCarts = createAsyncThunk('carts/fetchAll', async () => {
    const response = await getAllCarts();
    return response;
});

export const fetchCartById = createAsyncThunk('carts/fetchById', async (id) => {
    const response = await getCartById(id);
    return response;
});

export const fetchCartByUserId = createAsyncThunk('carts/fetchByUserId', async (userId) => {
    const response = await getCartByUserId(userId);
    // Giả sử response là dữ liệu giỏ hàng trực tiếp
    if (!response || response.error) {
        console.error("API response error:", response);
        throw new Error("Failed to fetch carts");
    }
    return response;
});

export const addToCart = createAsyncThunk('carts/add', async (cart) => {
    const response = await createCart(cart);
    return response;
});

export const editCart = createAsyncThunk('carts/edit', async ({ id, cart }) => {
    const response = await updateCart(id, cart);
    return response;
});

export const removeCart = createAsyncThunk('carts/remove', async (id) => {
    await deleteCart(id);
    return id;
});

const cartsSlice = createSlice({
    name: 'carts',
    initialState: {
        items: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCarts.pending, (state) => {
                console.log("Fetching carts in progress...");
                state.status = 'loading';
            })
            .addCase(fetchCarts.fulfilled, (state, action) => {
                console.log("Fetched carts:", action.payload); // Log dữ liệu fetch thành công
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCarts.rejected, (state, action) => {
                console.error("Failed to fetch carts:", action.error.message); // Log lỗi nếu có
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchCartById.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            })
            .addCase(fetchCartByUserId.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(editCart.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(removeCart.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    }
});

export default cartsSlice.reducer;