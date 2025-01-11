import axios from "axios";

const BASE_URL = "http://localhost:8080/api/users";

// Lấy tất cả sản phẩm
export const getAllUser = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// Lấy sản phẩm theo ID
export const getUserById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const getPaginatedUser = async (page = 0, size = 5) => {
  const response = await axios.get(`${BASE_URL}/paginated`, {
    params: { page, size },
  });
  return response.data;
};

export const searchUser = async ({ username, userRole }) => {
  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      username,
      userRole,
    },
  });
  return response.data;
};
// Tạo sản phẩm mới
export const createUser = async (formData) => {
  const response = await axios.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Cập nhật sản phẩm
export const updateUser = async (id, formData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Xóa sản phẩm
export const deleteUser = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const login = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    username,
    password,
  });
  return response.data;
};
