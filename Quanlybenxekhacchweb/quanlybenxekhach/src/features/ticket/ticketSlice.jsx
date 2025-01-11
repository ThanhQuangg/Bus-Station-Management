import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllTicket,
  getTicketById,
  getPaginatedTicket,
  searchTicket as apiSearchTicket,
  bookTicket as apiBookTicket,
  createTicket as apiCreateTicket,
  updateTicket as apiUpdateTicket,
  deleteTicket as apiDeleteTicket,
} from "../../utils/Api/ticketApi";

// Thunks cho các hành động bất đồng bộ
export const fetchAllTickets = createAsyncThunk("ticket/fetchAll", async () => {
  const data = await getAllTicket();
  return data;
});

export const fetchTicketById = createAsyncThunk("ticket/fetchById", async (id) => {
  const data = await getTicketById(id);
  return data;
});

export const fetchPaginatedTickets = createAsyncThunk(
  "ticket/fetchPaginated",
  async ({ page, size }) => {
    const data = await getPaginatedTicket(page, size);
    return data;
  }
);

export const searchTicket = createAsyncThunk(
  "ticket/search",
  async (criteria) => {
    const data = await apiSearchTicket(criteria);
    return data;
  }
);

export const createTicket = createAsyncThunk("ticket/create", async (formData) => {
  const data = await apiCreateTicket(formData);
  return data;
});

export const updateTicket = createAsyncThunk(
  "ticket/update",
  async ({ id, formData }) => {
    const data = await apiUpdateTicket(id, formData);
    return data;
  }
);

export const deleteTicket = createAsyncThunk("ticket/delete", async (id) => {
  await apiDeleteTicket(id);
  return id;
});

export const bookTicket = createAsyncThunk(
  "ticket/book",
  async ({ tripId, seatId, userId }) => {
    const data = await apiBookTicket(tripId, seatId, userId);
    return data;
  }
);

export const fetchTicketByTripAndSeat = createAsyncThunk(
  "ticket/fetchByTripAndSeat",
  async ({ tripId, seatId }) => {
    const data = await getTicketByTripAndSeat(tripId, seatId);
    return data;
  }
);

// Slice
const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    tickets: [],
    currentTicket: null,
    paginatedTickets: {
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
      // Fetch All Tickets
      .addCase(fetchAllTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tickets = action.payload;
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch Ticket By ID
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.currentTicket = action.payload;
      })
      // Fetch Paginated Tickets
      .addCase(fetchPaginatedTickets.fulfilled, (state, action) => {
        state.paginatedTickets = action.payload;
      })
      .addCase(searchTicket.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchTicket.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchTicket.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Create Ticket
      .addCase(createTicket.fulfilled, (state, action) => {
        state.tickets.push(action.payload);
      })
      // Update Ticket
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(
          (ticket) => ticket.id === action.payload.id
        );
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      // Delete Ticket
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter((ticket) => ticket.id !== action.payload);
      })
      // Book Ticket
      .addCase(bookTicket.fulfilled, (state, action) => {
        state.tickets.push(action.payload);
      })
      // Fetch Ticket By Trip And Seat
    .addCase(fetchTicketByTripAndSeat.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchTicketByTripAndSeat.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.currentTicket = action.payload;
    })
    .addCase(fetchTicketByTripAndSeat.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export default ticketSlice.reducer;
