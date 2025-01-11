import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import {
  fetchAllUsers,
  fetchPaginatedUsers,
  searchUser,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../features/user/userSlice";
import "../../styles/AdminUser.scss";

const AdminUserManagement = () => {
  const dispatch = useDispatch();
  const { users, paginatedUsers, loading, searchResults } = useSelector(
    (state) => state.users
  );
  const [form, setForm] = useState({
    userId: "",
    username: "",
    password: "",
    userRole: "",
    avatar: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentuserId, setCurrentuserId] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  
  const [usersPerPage, setUsersPerPage] = useState(2);
  const [customUsersPerPage, setCustomUsersPerPage] = useState("");

  const [searchCriteria, setSearchCriteria] = useState({
    username: "",
    userRole: "",
  });
  const [visibleSearch, setVisibleSearch] = useState({
    username: false,
    userRole: false,
  });

  useEffect(() => {
    if (
      searchCriteria.username ||
      searchCriteria.userRole 
    ) {
      dispatch(searchUser(searchCriteria));
    } else {
      dispatch(
        fetchPaginatedUsers({ page: currentPage, size: usersPerPage })
      );
    }
  }, [dispatch, currentPage, usersPerPage, searchCriteria]);
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };
  const usersToShow =
    searchResults.length > 0 ? searchResults : paginatedUsers.content;
  const toggleSearch = (field) => {
    setVisibleSearch({
      ...visibleSearch,
      [field]: !visibleSearch[field],
    });
  };
  const clearSearch = (field) => {
    setSearchCriteria({
      ...searchCriteria,
      [field]: "",
    });
    setVisibleSearch({
      ...visibleSearch,
      [field]: false,
    });
  };
  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setUsersPerPage(""); // Reset giá trị nếu chọn "Tùy chỉnh"
    } else {
      setUsersPerPage(Number(value));
      setCustomUsersPerPage(""); // Xóa giá trị tùy chỉnh nếu chọn option khác
    }
  };
  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    const number = Number(value);
    if (!isNaN(number) && number > 0) {
      setUsersPerPage(number); // Cập nhật số lượng người dùng khi nhập đúng số
    }
    setCustomUsersPerPage(value); // Lưu giá trị trong input
  };
  useEffect(() => {
    dispatch(fetchPaginatedUsers({ page: currentPage, size: usersPerPage }));
  }, [dispatch, currentPage, usersPerPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, avatar: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", form.userId);
    formData.append("username", form.username);
    formData.append("password", form.password);
    formData.append("userRole", form.userRole);

    if (form.avatar) {
      formData.append("avatar", form.avatar); // Chỉ thêm avatar nếu tồn tại
    }

    if (isEditing) {
      dispatch(updateUser({ id: currentuserId, formData })); // Gửi formData khi chỉnh sửa
    } else {
      dispatch(createUser(formData)); // Gửi formData khi thêm mới
    }

    resetForm();
  };
  const resetForm = () => {
    setForm({
      userId: "",
      username: "",
      password: "",
      userRole: "",
    });
    setIsEditing(false);
    setCurrentuserId(null);
  };

  const handleEdit = (user) => {
    setForm({
      userId: user.userId,
      username: user.username,
      password: user.password,
      userRole: user.userRole,
    });
    setIsEditing(true);
    setCurrentuserId(user.userId);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <MainLayout>
      <div className="admin-user-management">
        <h1>Quản lý người dùng</h1>
        <select
          className="form-select w-25"
          value={usersPerPage || "custom"}
          onChange={handleSelectChange}
        >
          <option value={2}>2 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value="custom">Tùy chỉnh</option>
        </select>
        {usersPerPage === "" && (
          <input
            type="number"
            className="form-control w-25 mt-2"
            placeholder="Nhập số người dùng mỗi trang"
            value={customUsersPerPage}
            onChange={handleCustomInputChange}
            min={1}
          />
        )}
        <form className="user-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="userRole">Vai trò</label>
          <select
            name="userRole"
            value={form.userRole}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn vai trò</option>
            <option value="ROLE_Admin">Quản trị viên (Admin)</option>
            <option value="ROLE_Staff">Nhân viên (Staff)</option>
          </select>

          <div className="form-group">
            <label htmlFor="avatar">Tải lên ảnh đại diện:</label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleFileChange}
            />
          </div>
          
          <button type="submit">
            {isEditing ? "Cập nhật" : "Thêm người dùng"}
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    <span onClick={() => toggleSearch("username")}>
                      Tên đăng nhập
                    </span>
                    {visibleSearch.username && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="username"
                          placeholder="Nhập tên đăng nhập"
                          value={searchCriteria.username}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("username")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
                  <th>
                    <span onClick={() => toggleSearch("userRole")}>
                      Vai trò
                    </span>
                    {visibleSearch.userRole && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="userRole"
                          placeholder="Nhập quyền người dùng"
                          value={searchCriteria.userRole}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("userRole")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
                  <th>Avatar</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {usersToShow.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.username}</td>
                    <td>{user.userRole}</td>
                    <td> <img
                        src={user.avatar}
                        alt="User Avatar"
                        width="50"
                        height="50"
                        style={{ objectFit: "cover" }} // Đảm bảo ảnh được cắt và hiển thị trong hình vuông
                      /></td>

                    <td>
                      <button onClick={() => handleEdit(user)}>Sửa</button>
                      <button onClick={() => handleDelete(user.userId)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-controls">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              >
                Previous
              </button>
              <span>
                Trang {currentPage + 1} / {paginatedUsers.totalPages}
              </span>
              <button
                disabled={currentPage + 1 === paginatedUsers.totalPages}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, paginatedUsers.totalPages - 1)
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminUserManagement;
