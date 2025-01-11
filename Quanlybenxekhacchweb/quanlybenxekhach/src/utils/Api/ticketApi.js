import axios from "axios";

const BASE_URL = "http://localhost:8080/api/tickets";

// Lấy tất cả vé xe
export const getAllTicket = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// Lấy vé xe theo ID
export const getTicketById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const getPaginatedTicket = async (page = 0, size = 5) => {
  const response = await axios.get(`${BASE_URL}/paginated`, {
    params: { page, size },
  });
  return response.data;
};
export const searchTicket = async ({ tripName, seatNumber, username }) => {
  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      tripName,
      seatNumber,
      username,
    },
  });
  return response.data;
};
// Tạo vé xe mới
export const createTicket = async (formData) => {
  const response = await axios.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Cập nhật vé xe
export const updateTicket = async (id, formData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Xóa vé xe
export const deleteTicket = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

// Đặt vé mới
export const bookTicket = async (tripId, seatId, userId) => {
  const response = await axios.post(`${BASE_URL}/book`, null, {
    params: { tripId, seatId, userId },
  });
  return response.data;
};

// Lấy vé xe theo Trip ID và Seat ID
export const getTicketByTripAndSeat = async (tripId, seatId) => {
  const response = await axios.get(`${BASE_URL}/by-trip-and-seat`, {
    params: { tripId, seatId },
  });
  return response.data;
};
