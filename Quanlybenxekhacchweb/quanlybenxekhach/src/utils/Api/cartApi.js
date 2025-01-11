import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/carts';

// Lấy tất cả giỏ hàng
export const getAllCarts = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

// Lấy giỏ hàng theo ID
export const getCartById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
};

// Lấy giỏ hàng theo User ID
export const getCartByUserId = async (userId) => {
    const response = await axios.get(`${BASE_URL}/user/${userId}`);
    return response.data;
};

// Tạo giỏ hàng mới
export const createCart = async (cart) => {
    const response = await axios.post(BASE_URL, cart, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// Cập nhật giỏ hàng
export const updateCart = async (id, cart) => {
    const response = await axios.put(`${BASE_URL}/${id}`, cart, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// Xóa giỏ hàng
export const deleteCart = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
};