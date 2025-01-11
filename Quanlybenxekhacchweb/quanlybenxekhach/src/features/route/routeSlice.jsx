import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    getAllRoute, 
    getRouteById, 
    getPaginatedRoute, 
    searchRoutes as apiSearchDriver,
    createRoute as apiCreateRoute, 
    updateRoute as apiUpdateRoute, 
    deleteRoute as apiDeleteRoute 
} from '../../utils/Api/routeApi';

// Thunk để fetch danh sách tất cả routes
export const fetchRoutes = createAsyncThunk(
    'routes/fetchRoutes',
    async () => {
        const response = await getAllRoute();
        return response;
    }
);

// Thunk để fetch route theo ID
export const fetchRouteDetail = createAsyncThunk(
    'routes/fetchRouteDetail',
    async (id) => {
        const response = await getRouteById(id);
        return response;
    }
);

// Thunk để fetch route phân trang
export const fetchPaginatedRoutes = createAsyncThunk(
    'routes/fetchPaginatedRoutes',
    async ({ page, size }) => {
        const response = await getPaginatedRoute(page, size);
        return response;
    }
);

export const searchRoute = createAsyncThunk(
    "routes/search",
    async (criteria) => {
      const data = await apiSearchDriver(criteria);
      return data;
    }
  );

// Thunk để tạo route mới
export const createRoute = createAsyncThunk(
    'routes/createRoute',
    async (formData) => {
        const response = await apiCreateRoute(formData);
        return response;
    }
);

// Thunk để cập nhật route
export const updateRoute = createAsyncThunk(
    'routes/updateRoute',
    async ({ id, formData }) => {
        const response = await apiUpdateRoute(id, formData);
        return response;
    }
);

// Thunk để xóa route
export const deleteRoute = createAsyncThunk(
    'routes/deleteRoute',
    async (id) => {
        await apiDeleteRoute(id);
        return id;
    }
);

// Tạo slice
const routeSlice = createSlice({
    name: 'routes',
    initialState: {
        routes: [],
        currentRoute: null,
        paginatedRoutes: {
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
            // Xử lý trạng thái fetchRoutes
            .addCase(fetchRoutes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoutes.fulfilled, (state, action) => {
                state.loading = false;
                state.routes = action.payload;
            })
            .addCase(fetchRoutes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Xử lý trạng thái fetchRouteDetail
            .addCase(fetchRouteDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRouteDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRoute = action.payload;
            })
            .addCase(fetchRouteDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Xử lý trạng thái fetchPaginatedRoutes
            .addCase(fetchPaginatedRoutes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaginatedRoutes.fulfilled, (state, action) => {
                state.loading = false;
                state.paginatedRoutes = action.payload;
            })
            .addCase(fetchPaginatedRoutes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(searchRoute.pending, (state) => {
                state.status = "loading";
              })
              .addCase(searchRoute.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.searchResults = action.payload;
              })
              .addCase(searchRoute.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
              })
            // Xử lý trạng thái createRoute
            .addCase(createRoute.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRoute.fulfilled, (state, action) => {
                state.loading = false;
                state.routes.push(action.payload);
            })
            .addCase(createRoute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Xử lý trạng thái updateRoute
            .addCase(updateRoute.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRoute.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.routes.findIndex(route => route.id === action.payload.id);
                if (index !== -1) {
                    state.routes[index] = action.payload;
                }
            })
            .addCase(updateRoute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Xử lý trạng thái deleteRoute
            .addCase(deleteRoute.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRoute.fulfilled, (state, action) => {
                state.loading = false;
                state.routes = state.routes.filter(route => route.id !== action.payload);
            })
            .addCase(deleteRoute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default routeSlice.reducer;