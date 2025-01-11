import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/cartdetails';

// Lấy tất cả chi tiết giỏ hàng
export const getAllCartDetails = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

// Lấy chi tiết giỏ hàng theo ID
export const getCartDetailById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
};

// Lấy chi tiết giỏ hàng theo cartId
export const getCartDetailsByCartId = async (cartId) => {
    const response = await axios.get(`${BASE_URL}/cart/${cartId}`);
    return response.data;
};

// Tạo chi tiết giỏ hàng mới
export const createCartDetail = async (cartDetail) => {
    const response = await axios.post(BASE_URL, cartDetail, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

// Cập nhật chi tiết giỏ hàng
export const updateCartDetail = async (id, cartDetail) => {
    const response = await axios.put(`${BASE_URL}/${id}`, cartDetail, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

// Xóa chi tiết giỏ hàng
export const deleteCartDetail = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
};

// Tính tổng giá của giỏ hàng
export const calculateTotalPrice = async (cartId) => {
    const response = await axios.get(`${BASE_URL}/cart/${cartId}/total-price`);
    return response.data;
};
