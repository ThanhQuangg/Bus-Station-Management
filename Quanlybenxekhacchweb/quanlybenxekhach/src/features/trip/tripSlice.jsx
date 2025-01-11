import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllTrip,
  getTripById,
  getPaginatedTrip,
  search_Trip as apiSearch_Trip,
  createTrip as apiCreateTrip,
  updateTrip as apiUpdateTrip,
  deleteTrip as apiDeleteTrip,
  searchTrip as apiSearchTrip,
} from "../../utils/Api/tripApi";

// Thunks cho các hành động bất đồng bộ
export const fetchAllTrips = createAsyncThunk("trip/fetchAll", async () => {
  const data = await getAllTrip();
  return data;
});

export const fetchTripById = createAsyncThunk("trip/fetchById", async (id) => {
  const data = await getTripById(id);
  return data;
});

export const fetchPaginatedTrips = createAsyncThunk(
  "trip/fetchPaginated",
  async ({ page, size }) => {
    const data = await getPaginatedTrip(page, size);
    return data;
  }
);

export const searchTrips = createAsyncThunk(
  "trip/search",
  async ({ startLocation, endLocation, tripName }) => {
    const data = await apiSearchTrip({ startLocation, endLocation, tripName });
    return data;
  }
);

export const search_Trip = createAsyncThunk(
  "trip/search_advanced",
  async (criteria) => {
    const data = await apiSearch_Trip(criteria);
    return data;
  }
);

export const createTrip = createAsyncThunk("trip/create", async (formData) => {
  const data = await apiCreateTrip(formData);
  return data;
});

export const updateTrip = createAsyncThunk("trip/update", async ({ id, formData }) => {
  const data = await apiUpdateTrip(id, formData);
  return data;
});

export const deleteTrip = createAsyncThunk("trip/delete", async (id) => {
  await apiDeleteTrip(id);
  return id;
});

// Slice
const tripSlice = createSlice({
  name: "trip",
  initialState: {
    trips: [],
    currentTrip: null,
    paginatedTrips: {
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
      // Fetch All Trips
      .addCase(fetchAllTrips.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllTrips.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trips = action.payload;
      })
      .addCase(fetchAllTrips.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch Trip By ID
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.currentTrip = action.payload;
      })
      // Fetch Paginated Trips
      .addCase(fetchPaginatedTrips.fulfilled, (state, action) => {
        state.paginatedTrips = action.payload;
      })
      .addCase(searchTrips.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchTrips.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchTrips.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(search_Trip.pending, (state) => {
        state.status = "loading";
      })
      .addCase(search_Trip.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(search_Trip.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Create Trip
      .addCase(createTrip.fulfilled, (state, action) => {
        state.trips.push(action.payload);
      })
      // Update Trip
      .addCase(updateTrip.fulfilled, (state, action) => {
        const index = state.trips.findIndex((trip) => trip.id === action.payload.id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
      })
      // Delete Trip
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.trips = state.trips.filter((trip) => trip.id !== action.payload);
      });
  },
});

export default tripSlice.reducer;
