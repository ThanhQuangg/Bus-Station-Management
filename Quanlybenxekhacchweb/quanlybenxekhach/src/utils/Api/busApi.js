import axios from "axios";

const BASE_URL = "http://localhost:8080/api/buses";

// Lấy tất cả sản phẩm
export const getAllBus = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getPaginatedBus = async (page = 0, size = 5) => {
  const response = await axios.get(`${BASE_URL}/paginated`, {
      params: { page, size },
  });
  return response.data; 
};

export const searchBuses = async ({ busName, busType, totalSeats, licensePlate }) => {
  const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        busName,
        busType,
        totalSeats,
        licensePlate,
      },
  });
  return response.data;
};

// Tạo sản phẩm mới
export const createBus = async (formData) => {
  const response = await axios.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Cập nhật sản phẩm
export const updateBus = async (id, formData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Xóa sản phẩm
export const deleteBus = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};


