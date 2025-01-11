import axios from "axios";

const BASE_URL = "http://localhost:8080/api/seats";

// Lấy tất cả sản phẩm
export const getAllSeat = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// Lấy sản phẩm theo ID
export const getSeatById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const getPaginatedSeat = async (page = 0, size = 5) => {
  const response = await axios.get(`${BASE_URL}/paginated`, {
    params: { page, size },
  });
  return response.data;
};

export const searchSeat = async ({ seatNumber, busName }) => {
  const response = await axios.get(`${BASE_URL}/search-seat`, {
    params: {
      seatNumber,
      busName,
    },
  });
  return response.data;
};

// Tạo sản phẩm mới
export const createSeat = async (formData) => {
  const response = await axios.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Cập nhật sản phẩm
export const updateSeat = async (id, formData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Xóa sản phẩm
export const deleteSeat = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
