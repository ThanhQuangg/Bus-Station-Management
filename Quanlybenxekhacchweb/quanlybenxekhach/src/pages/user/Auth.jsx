import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  createUser,
  logoutUser,
} from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.scss";
const AuthComponent = () => {
  const dispatch = useDispatch();
  const { loading, error, currentUser } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phoneNumber: "",
    userRole: "",
    avatar: null,
  });

  useEffect(() => {
    if (currentUser) {
      navigate("/"); // Chuyển hướng về trang chủ sau khi đăng nhập thành công
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (registerSuccess) {
      setIsRegister(false); // Chuyển sang giao diện đăng nhập
      navigate("/login"); // Điều hướng đến trang đăng nhập
    }
  }, [registerSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      return;
    }
    if (isRegister) {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("password", formData.password);
      data.append("userRole", formData.userRole);
      if (formData.avatar) data.append("avatar", formData.avatar);

      // dispatch(createUser(data));
      try {
        await dispatch(createUser(data)).unwrap(); // unwrap để kiểm tra lỗi
        setRegisterSuccess(true); // Cập nhật trạng thái đăng ký thành công
      } catch (err) {
        console.error("Error during registration:", err);
      }
    } else {
      dispatch(
        loginUser({ username: formData.username, password: formData.password })
      );
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="auth-container">
      <h2>{isRegister ? "Đăng ký" : "Đăng nhập"}</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* {isRegister && (
          <div>
            <label>Họ và tên:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
        )} */}

        <div>
          <label>Tên đăng nhập:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* {isRegister && (
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
        )} */}
        {/* {isRegister && (
          <div>
            <label>Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
        )} */}

        {/* {isRegister && (
          <div>
            <label>Số điện thoại:</label>
            <input
              type="number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
        )} */}

        {isRegister && (
          <div>
            <label>Vai trò:</label>
            <input type="hidden" name="userRole" value="ROLE_Customer" />
            <p> ROLE_Customer</p>
          </div>
        )}

        {isRegister && (
          <div>
            <label>Avatar:</label>
            <input type="file" name="avatar" onChange={handleFileChange} />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : isRegister ? "Đăng ký" : "Đăng nhập"}
        </button>
      </form>

      <p>
        {isRegister ? "Đã có tài khoản?" : "Bạn chưa có tài khoản?"}{" "}
        &nbsp;
        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Đăng nhập" : "Đăng ký"}
        </button>
      </p>
    </div>
  );
};

export default AuthComponent;
