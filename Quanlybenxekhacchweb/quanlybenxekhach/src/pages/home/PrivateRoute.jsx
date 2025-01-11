import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const userRole = localStorage.getItem('roles'); // Lấy role từ localStorage hoặc từ context/state

  if (userRole !== role) {
    return <div>Bạn không có quyền truy cập</div>; // Hiển thị thông báo lỗi
  }

  return children; // Cho phép truy cập nếu đúng vai trò
};

export default PrivateRoute;
