import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllCustomer,
  getCustomerById,
  getPaginatedCustomer,
  createCustomer as apiCreateCustomer,
  updateCustomer as apiUpdateCustomer,
  deleteCustomer as apiDeleteCustomer,
} from "../../utils/Api/customerApi";

// Thunks cho các hành động bất đồng bộ
export const fetchAllCustomers = createAsyncThunk("customer/fetchAll", async () => {
  const data = await getAllCustomer();
  return data;
});

export const fetchCustomerById = createAsyncThunk(
  "customer/fetchById",
  async (id) => {
    const data = await getCustomerById(id);
    return data;
  }
);

export const fetchPaginatedCustomers = createAsyncThunk(
  "customer/fetchPaginated",
  async ({ page, size }) => {
    const data = await getPaginatedCustomer(page, size);
    return data;
  }
);

export const createCustomer = createAsyncThunk("customer/create", async (formData) => {
  const data = await apiCreateCustomer(formData);
  return data;
});

export const updateCustomer = createAsyncThunk(
  "customer/update",
  async ({ id, formData }) => {
    const data = await apiUpdateCustomer(id, formData);
    return data;
  }
);

export const deleteCustomer = createAsyncThunk("customer/delete", async (id) => {
  await apiDeleteCustomer(id);
  return id;
});

// Slice
const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customers: [],
    currentCustomer: null,
    paginatedCustomers: {
      content: [],
      page: 0,
      size: 5,
      totalElements: 0,
      totalPages: 0,
    },
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Customers
      .addCase(fetchAllCustomers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers = action.payload;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch Customer By ID
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.currentCustomer = action.payload;
      })
      // Fetch Paginated Customers
      .addCase(fetchPaginatedCustomers.fulfilled, (state, action) => {
        state.paginatedCustomers = action.payload;
      })
      // Create Customer
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      // Update Customer
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(
          (customer) => customer.id === action.payload.id
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      // Delete Customer
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(
          (customer) => customer.id !== action.payload
        );
      });
  },
});

export default customerSlice.reducer;
