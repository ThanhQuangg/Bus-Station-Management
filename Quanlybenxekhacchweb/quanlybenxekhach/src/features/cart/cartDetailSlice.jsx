import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCartDetails, getCartDetailById, getCartDetailsByCartId, createCartDetail, updateCartDetail, deleteCartDetail, calculateTotalPrice} from '../../utils/Api/cartDetailApi';

export const fetchCartDetails = createAsyncThunk('cartDetails/fetchAll', async () => {
    const response = await getAllCartDetails();
    return response;
});

export const fetchCartDetailById = createAsyncThunk('cartDetails/fetchById', async (id) => {
    const response = await getCartDetailById(id);
    return response;
});

export const fetchCartDetailsByCartId = createAsyncThunk('cartDetails/fetchByCartId', async (cartId) => {
    const response = await getCartDetailsByCartId(cartId);
    return response;
});

export const addCartDetail = createAsyncThunk('cartDetails/add', async (cartDetail) => {
    const response = await createCartDetail(cartDetail);
    return response;
});

export const editCartDetail = createAsyncThunk('cartDetails/edit', async ({ id, cartDetail }) => {
    const response = await updateCartDetail(id, cartDetail);
    return response;
});

export const removeCartDetail = createAsyncThunk('cartDetails/remove', async (id) => {
    await deleteCartDetail(id);
    return id;
});

export const fetchTotalPrice = createAsyncThunk('cartDetails/fetchTotalPrice', async (cartId) => {
    const response = await calculateTotalPrice(cartId);
    return response;
});

const cartDetailsSlice = createSlice({
    name: 'cartDetails',
    initialState: {
        items: [],
        totalPrice: 0,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCartDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCartDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchCartDetailById.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            })
            .addCase(fetchCartDetailsByCartId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(addCartDetail.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(editCartDetail.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(removeCartDetail.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(fetchTotalPrice.fulfilled, (state, action) => {
                state.totalPrice = action.payload;
            });
    }
});

export default cartDetailsSlice.reducer;