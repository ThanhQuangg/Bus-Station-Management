import axios from "axios";

const BASE_URL = "http://localhost:8080/api/trips";

// Lấy tất cả sản phẩm
export const getAllTrip = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// Lấy sản phẩm theo ID
export const getTripById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const searchTrip = async ({ startLocation, endLocation, tripName }) => {
  const response = await axios.get(`${BASE_URL}/search`, {
    params: { startLocation, endLocation, tripName },
  });
  return response.data;
};

export const getPaginatedTrip = async (page = 0, size = 5) => {
  const response = await axios.get(`${BASE_URL}/paginated`, {
    params: { page, size },
  });
  return response.data;
};

export const search_Trip = async ({ tripName, busName, fullName, departureTime, arrivalTime, ticketPrice, name }) => {
  const response = await axios.get(`${BASE_URL}/search-trip`, {
    params: {
      tripName,
      busName,
      fullName,
      departureTime,
      arrivalTime,
      ticketPrice,
      name
    },
  });
  return response.data;
};

// Tạo sản phẩm mới
export const createTrip = async (formData) => {
  const response = await axios.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Cập nhật sản phẩm
export const updateTrip = async (id, formData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Xóa sản phẩm
export const deleteTrip = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
