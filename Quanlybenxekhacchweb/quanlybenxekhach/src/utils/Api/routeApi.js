import axios from "axios";

const BASE_URL = "http://localhost:8080/api/routes";

// Lấy tất cả sản phẩm
export const getAllRoute = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// Lấy sản phẩm theo ID
export const getRouteById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const getPaginatedRoute = async (page = 0, size = 5) => {
  const response = await axios.get(`${BASE_URL}/paginated`, {
    params: { page, size },
  });
  return response.data;
};

export const searchRoutes = async ({
  name,
  startLocation,
  endLocation,
  distance,
  estimatedDuration,
}) => {
  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      name,
      startLocation,
      endLocation,
      distance,
      estimatedDuration,
    },
  });
  return response.data;
};

// Tạo sản phẩm mới
export const createRoute = async (formData) => {
  const response = await axios.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Cập nhật sản phẩm
export const updateRoute = async (id, formData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Xóa sản phẩm
export const deleteRoute = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
