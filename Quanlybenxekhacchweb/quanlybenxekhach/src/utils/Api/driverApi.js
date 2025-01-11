import axios from "axios";

const BASE_URL = "http://localhost:8080/api/drivers";

// Lấy tất cả sản phẩm
export const getAllDriver = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// Lấy sản phẩm theo ID
export const getDriverById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const getPaginatedDriver = async (page = 0, size = 5) => {
  const response = await axios.get(`${BASE_URL}/paginated`, {
    params: { page, size },
  });
  return response.data;
};

export const searchDrivers = async ({
  fullName,
  phoneNumber,
  licenseNumber,
}) => {
  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      fullName,
      phoneNumber,
      licenseNumber,
    },
  });
  return response.data;
};
// Tạo sản phẩm mới
export const createDriver = async (formData) => {
  const response = await axios.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Cập nhật sản phẩm
export const updateDriver = async (id, formData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Xóa sản phẩm
export const deleteDriver = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
