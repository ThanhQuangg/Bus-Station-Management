import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllBus, 
  getPaginatedBus,
  searchBuses as apiSearchBuses,
  createBus as apiCreateBus,
  updateBus as apiUpdateBus,
  deleteBus as apiDeleteBus,
} from "../../utils/Api/busApi";

// Thunks cho các hành động bất đồng bộ
export const fetchAllBuses = createAsyncThunk("bus/fetchAll", async () => {
  const data = await getAllBus();
  return data;
});

export const fetchPaginatedBuses = createAsyncThunk(
  "bus/fetchPaginated",
  async ({ page, size }) => {
    const data = await getPaginatedBus(page, size);
    return data;
  }
);

export const searchBuses = createAsyncThunk(
  "bus/search",
  async (criteria) => {
    const data = await apiSearchBuses(criteria);
    return data;
  }
);


export const createBus = createAsyncThunk("bus/create", async (formData) => {
  const data = await apiCreateBus(formData);
  return data;
});

export const updateBus = createAsyncThunk(
  "bus/update",
  async ({ id, formData }) => {
    const data = await apiUpdateBus(id, formData);
    return data;
  }
);

export const deleteBus = createAsyncThunk("bus/delete", async (id) => {
  await apiDeleteBus(id);
  return id;
});

// Slice
const busSlice = createSlice({
  name: "bus",
  initialState: {
    buses: [],
    currentBus: null,
    paginatedBuses: {
      content: [],
      page: 0,
      size: 5,
      totalElements: 0,
      totalPages: 0,
    },
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    searchResults: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Buses
      .addCase(fetchAllBuses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllBuses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.buses = action.payload;
      })
      .addCase(fetchAllBuses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch Paginated Buses
      .addCase(fetchPaginatedBuses.fulfilled, (state, action) => {
        state.paginatedBuses = action.payload;
      })
      // Search Buses
      .addCase(searchBuses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchBuses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchBuses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createBus.fulfilled, (state, action) => {
        state.buses.push(action.payload);
      })
      // Update Bus
      .addCase(updateBus.fulfilled, (state, action) => {
        const index = state.buses.findIndex(
          (bus) => bus.id === action.payload.id
        );
        if (index !== -1) {
          state.buses[index] = action.payload;
        }
      })
      // Delete Bus
      .addCase(deleteBus.fulfilled, (state, action) => {
        state.buses = state.buses.filter((bus) => bus.id !== action.payload);
      });
  },
});

export default busSlice.reducer;
