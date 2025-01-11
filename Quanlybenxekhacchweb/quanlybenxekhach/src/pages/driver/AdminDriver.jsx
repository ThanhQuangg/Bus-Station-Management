import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import {
  fetchAllDrivers,
  fetchPaginatedDrivers,
  searchDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../../features/driver/driverSlice";
import "../../styles/AdminDriver.scss";

const AdminDriverManagement = () => {
  const dispatch = useDispatch();
  const { drivers, paginatedDrivers, loading, searchResults } = useSelector(
    (state) => state.drivers
  );

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    licenseNumber: "",
    avatar: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentDriverId, setCurrentDriverId] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [driversPerPage, setDriversPerPage] = useState(2);
  const [customDriversPerPage, setCustomDriversPerPage] = useState("");

  const [searchCriteria, setSearchCriteria] = useState({
    fullName: "",
    phoneNumber: "",
    licenseNumber: "",
  });
  const [visibleSearch, setVisibleSearch] = useState({
    fullName: false,
    phoneNumber: false,
    licenseNumber: false,
  });

  useEffect(() => {
    if (
      searchCriteria.fullName ||
      searchCriteria.phoneNumber ||
      searchCriteria.licenseNumber
    ) {
      dispatch(searchDrivers(searchCriteria));
    } else {
      dispatch(
        fetchPaginatedDrivers({ page: currentPage, size: driversPerPage })
      );
    }
  }, [dispatch, currentPage, driversPerPage, searchCriteria]);
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };
  const driversToShow =
    searchResults.length > 0 ? searchResults : paginatedDrivers.content;
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
      setDriversPerPage(""); // Reset giá trị nếu chọn "Tùy chỉnh"
    } else {
      setDriversPerPage(Number(value));
      setCustomDriversPerPage(""); // Xóa giá trị tùy chỉnh nếu chọn option khác
    }
  };
  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    const number = Number(value);
    if (!isNaN(number) && number > 0) {
      setDriversPerPage(number); // Cập nhật số lượng người dùng khi nhập đúng số
    }
    setCustomDriversPerPage(value); // Lưu giá trị trong input
  };

  useEffect(() => {
    dispatch(
      fetchPaginatedDrivers({ page: currentPage, size: driversPerPage })
    );
  }, [dispatch, currentPage, driversPerPage]);

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
    formData.append("fullName", form.fullName);
    formData.append("phoneNumber", form.phoneNumber);
    formData.append("licenseNumber", form.licenseNumber);

    if (form.avatar) {
      formData.append("avatar", form.avatar); // Chỉ thêm avatar nếu tồn tại
    }

    if (isEditing) {
      dispatch(updateDriver({ id: currentDriverId, formData })); // Gửi formData khi chỉnh sửa
    } else {
      dispatch(createDriver(formData)); // Gửi formData khi thêm mới
    }

    resetForm();
  };
  const resetForm = () => {
    setForm({
      fullName: "",
      phoneNumber: "",
      licenseNumber: "",
      avatar: null,
    });
    setIsEditing(false);
    setCurrentDriverId(null);
  };

  const handleEdit = (driver) => {
    setForm({
      fullName: driver.fullName,
      phoneNumber: driver.phoneNumber,
      licenseNumber: driver.licenseNumber,
      avatar: driver.avatar,
    });
    setIsEditing(true);
    setCurrentDriverId(driver.driverId);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài xế này?")) {
      dispatch(deleteDriver(id));
    }
  };

  return (
    <MainLayout>
      <div className="admin-driver-management">
        <h1>Quản lý tài xế</h1>
        <select
          className="form-select w-25"
          value={driversPerPage || "custom"}
          onChange={handleSelectChange}
        >
          <option value={2}>2 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value="custom">Tùy chỉnh</option>
        </select>
        {driversPerPage === "" && (
          <input
            type="number"
            className="form-control w-25 mt-2"
            placeholder="Nhập số xe khách mỗi trang"
            value={customDriversPerPage}
            onChange={handleCustomInputChange}
            min={1}
          />
        )}
        <form className="driver-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Tên tài xế"
            value={form.fullName}
            onChange={handleInputChange}
            required
          />

          <input
            type="number"
            name="phoneNumber"
            placeholder="Số điện thoại"
            value={form.phoneNumber}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="licenseNumber"
            placeholder="Số giấy phép lái xe"
            value={form.licenseNumber}
            onChange={handleInputChange}
            required
          />

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
            {isEditing ? "Cập nhật" : "Thêm tài xế"}
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <table className="driver-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    <span onClick={() => toggleSearch("fullName")}>
                      Tên tài xế
                    </span>
                    {visibleSearch.fullName && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Nhập tên tài xế"
                          value={searchCriteria.fullName}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("fullName")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
                  <th>
                    <span onClick={() => toggleSearch("phoneNumber")}>
                      Số điện thoại
                    </span>
                    {visibleSearch.phoneNumber && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="phoneNumber"
                          placeholder="Nhập số điện thoại"
                          value={searchCriteria.phoneNumber}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("phoneNumber")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
                  <th>
                    <span onClick={() => toggleSearch("licenseNumber")}>
                      Số giấy phép lái xe
                    </span>
                    {visibleSearch.licenseNumber && (
                      <div className="search-input">
                        <input
                          type="number"
                          name="licenseNumber"
                          placeholder="Nhập số giấy phép lái xe"
                          value={searchCriteria.licenseNumber}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("licenseNumber")}>
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
                {driversToShow.map((driver) => (
                  <tr key={driver.driverId}>
                    <td>{driver.driverId}</td>
                    <td>{driver.fullName}</td>
                    <td>{driver.phoneNumber}</td>
                    <td>{driver.licenseNumber}</td>
                    {/* <td>{driver.avatar}</td> */}
                    <td>
                      <img
                        src={driver.avatar}
                        alt="Driver Avatar"
                        width="50"
                        height="50"
                        style={{ objectFit: "cover" }} // Đảm bảo ảnh được cắt và hiển thị trong hình vuông
                      />
                    </td>
                    <td>
                      <button onClick={() => handleEdit(driver)}>Sửa</button>
                      <button onClick={() => handleDelete(driver.driverId)}>
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
                Trang {currentPage + 1} / {paginatedDrivers.totalPages}
              </span>
              <button
                disabled={currentPage + 1 === paginatedDrivers.totalPages}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, paginatedDrivers.totalPages - 1)
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

export default AdminDriverManagement;
