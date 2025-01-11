import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllSeat,
  getSeatById,
  getPaginatedSeat,
  searchSeat as apiSearchSeat,
  createSeat as apiCreateSeat,
  updateSeat as apiUpdateSeat,
  deleteSeat as apiDeleteSeat,
} from "../../utils/Api/seatApi";

// Thunks cho các hành động bất đồng bộ
export const fetchAllSeats = createAsyncThunk("seat/fetchAll", async () => {
  const data = await getAllSeat();
  return data;
});

export const fetchSeatById = createAsyncThunk("seat/fetchById", async (id) => {
  const data = await getSeatById(id);
  return data;
});

export const fetchPaginatedSeats = createAsyncThunk(
  "seat/fetchPaginated",
  async ({ page, size }) => {
    const data = await getPaginatedSeat(page, size);
    return data;
  }
);

export const searchSeat = createAsyncThunk(
  "seat/search",
  async (criteria) => {
    const data = await apiSearchSeat(criteria);
    return data;
  }
);

export const createSeat = createAsyncThunk("seat/create", async (formData) => {
  const data = await apiCreateSeat(formData);
  return data;
});

export const updateSeat = createAsyncThunk(
  "seat/update",
  async ({ id, formData }) => {
    const data = await apiUpdateSeat(id, formData);
    return data;
  }
);

export const deleteSeat = createAsyncThunk("seat/delete", async (id) => {
  await apiDeleteSeat(id);
  return id;
});

// Slice
const seatSlice = createSlice({
  name: "seat",
  initialState: {
    seats: [],
    currentSeat: null,
    paginatedSeats: {
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
      // Fetch All Seats
      .addCase(fetchAllSeats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllSeats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.seats = action.payload;
      })
      .addCase(fetchAllSeats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch Seat By ID
      .addCase(fetchSeatById.fulfilled, (state, action) => {
        state.currentSeat = action.payload;
      })
      // Fetch Paginated Seats
      .addCase(fetchPaginatedSeats.fulfilled, (state, action) => {
        state.paginatedSeats = action.payload;
      })
      .addCase(searchSeat.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchSeat.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchSeat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Create Seat
      .addCase(createSeat.fulfilled, (state, action) => {
        state.seats.push(action.payload);
      })
      // Update Seat
      .addCase(updateSeat.fulfilled, (state, action) => {
        const index = state.seats.findIndex(
          (seat) => seat.id === action.payload.id
        );
        if (index !== -1) {
          state.seats[index] = action.payload;
        }
      })
      // Delete Seat
      .addCase(deleteSeat.fulfilled, (state, action) => {
        state.seats = state.seats.filter((seat) => seat.id !== action.payload);
      });
  },
});

export default seatSlice.reducer;
