import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllDriver,
  getDriverById,
  getPaginatedDriver,
  searchDrivers as apiSearchDriver,
  createDriver as apiCreateDriver,
  updateDriver as apiUpdateDriver,
  deleteDriver as apiDeleteDriver,
} from "../../utils/Api/driverApi";

// Thunks cho các hành động bất đồng bộ
export const fetchAllDrivers = createAsyncThunk("driver/fetchAll", async () => {
  const data = await getAllDriver();
  return data;
});

export const fetchDriverById = createAsyncThunk("driver/fetchById", async (id) => {
  const data = await getDriverById(id);
  return data;
});

export const fetchPaginatedDrivers = createAsyncThunk(
  "driver/fetchPaginated",
  async ({ page, size }) => {
    const data = await getPaginatedDriver(page, size);
    return data;
  }
);

export const searchDrivers = createAsyncThunk(
  "driver/search",
  async (criteria) => {
    const data = await apiSearchDriver(criteria);
    return data;
  }
);

export const createDriver = createAsyncThunk("driver/create", async (formData) => {
  const data = await apiCreateDriver(formData);
  return data;
});

export const updateDriver = createAsyncThunk(
  "driver/update",
  async ({ id, formData }) => {
    const data = await apiUpdateDriver(id, formData);
    return data;
  }
);

export const deleteDriver = createAsyncThunk("driver/delete", async (id) => {
  await apiDeleteDriver(id);
  return id;
});

// Slice
const driverSlice = createSlice({
  name: "driver",
  initialState: {
    drivers: [],
    currentDriver: null,
    paginatedDrivers: {
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
      // Fetch All Drivers
      .addCase(fetchAllDrivers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllDrivers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.drivers = action.payload;
      })
      .addCase(fetchAllDrivers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch Driver By ID
      .addCase(fetchDriverById.fulfilled, (state, action) => {
        state.currentDriver = action.payload;
      })
      // Fetch Paginated Drivers
      .addCase(fetchPaginatedDrivers.fulfilled, (state, action) => {
        state.paginatedDrivers = action.payload;
      })
      // Search Driver
      .addCase(searchDrivers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchDrivers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchDrivers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Create Driver
      .addCase(createDriver.fulfilled, (state, action) => {
        state.drivers.push(action.payload);
      })
      // Update Driver
      .addCase(updateDriver.fulfilled, (state, action) => {
        const index = state.drivers.findIndex(
          (driver) => driver.id === action.payload.id
        );
        if (index !== -1) {
          state.drivers[index] = action.payload;
        }
      })
      // Delete Driver
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.drivers = state.drivers.filter((driver) => driver.id !== action.payload);
      });
  },
});

export default driverSlice.reducer;
