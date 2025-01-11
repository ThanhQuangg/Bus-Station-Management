import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import {
  fetchAllBuses,
  fetchPaginatedBuses,
  searchBuses,
  createBus,
  updateBus,
  deleteBus,
} from "../../features/bus/busSlice";
import "../../styles/AdminBus.scss";

const AdminBusManagement = () => {
  const dispatch = useDispatch();
  const { buses, paginatedBuses, loading, searchResults } = useSelector(
    (state) => state.buses
  );

  const [form, setForm] = useState({
    busName: "",
    busType: "",
    totalSeats: "",
    licensePlate: "",
    avatar: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentBusId, setCurrentBusId] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [busesPerPage, setBusesPerPage] = useState(2);
  const [customBusesPerPage, setCustomBusesPerPage] = useState("");

  const [searchCriteria, setSearchCriteria] = useState({
    busName: "",
    busType: "",
    totalSeats: "",
    licensePlate: "",
  });
  const [visibleSearch, setVisibleSearch] = useState({
    busName: false,
    busType: false,
    licensePlate: false,
    totalSeats: false,
  });
  useEffect(() => {
    if (
      searchCriteria.busName ||
      searchCriteria.busType ||
      searchCriteria.totalSeats ||
      searchCriteria.licensePlate
    ) {
      dispatch(searchBuses(searchCriteria));
    } else {
      dispatch(fetchPaginatedBuses({ page: currentPage, size: busesPerPage }));
    }
  }, [dispatch, currentPage, busesPerPage, searchCriteria]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };
  const busesToShow =
    searchResults.length > 0 ? searchResults : paginatedBuses.content;
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
      setBusesPerPage(""); // Reset giá trị nếu chọn "Tùy chỉnh"
    } else {
      setBusesPerPage(Number(value));
      setCustomBusesPerPage(""); // Xóa giá trị tùy chỉnh nếu chọn option khác
    }
  };
  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    const number = Number(value);
    if (!isNaN(number) && number > 0) {
      setBusesPerPage(number); // Cập nhật số lượng người dùng khi nhập đúng số
    }
    setCustomBusesPerPage(value); // Lưu giá trị trong input
  };
 

  useEffect(() => {
    dispatch(
      fetchPaginatedBuses({
        page: currentPage,
        size: busesPerPage,
      })
    );
    // dispatch(fetchCategories());
  }, [dispatch, currentPage, busesPerPage]);
 

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
    formData.append("busName", form.busName); // Thêm các giá trị cần thiết vào formData
    formData.append("busType", form.busType);
    formData.append("totalSeats", form.totalSeats);
    formData.append("licensePlate", form.licensePlate);

    if (form.avatar) {
      formData.append("avatar", form.avatar); // Chỉ thêm avatar nếu tồn tại
    }

    if (isEditing) {
      dispatch(updateBus({ id: currentBusId, formData })); // Gửi formData khi chỉnh sửa
    } else {
      dispatch(createBus(formData)); // Gửi formData khi thêm mới
    }

    resetForm();
  };
  const resetForm = () => {
    setForm({
      busName: "",
      busType: "",
      totalSeats: "",
      licensePlate: "",
      avatar: null,
    });
    setIsEditing(false);
    setCurrentBusId(null);
  };

  const handleEdit = (bus) => {
    setForm({
      busName: bus.busName,
      busType: bus.busType,
      totalSeats: bus.totalSeats,
      licensePlate: bus.licensePlate,
      avatar: null,
    });
    setIsEditing(true);
    setCurrentBusId(bus.busId);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa xe này?")) {
      dispatch(deleteBus(id));
    }
  };

 

  return (
    <MainLayout>
      <div className="admin-bus-management">
        <h1>Quản lý xe khách</h1>
        <select
          className="form-select w-25"
          value={busesPerPage || "custom"}
          onChange={handleSelectChange}
        >
          <option value={2}>2 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value="custom">Tùy chỉnh</option>
        </select>
        {busesPerPage === "" && (
          <input
            type="number"
            className="form-control w-25 mt-2"
            placeholder="Nhập số xe khách mỗi trang"
            value={customBusesPerPage}
            onChange={handleCustomInputChange}
            min={1}
          />
        )}
        <form className="bus-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="busName"
            placeholder="Tên xe khách"
            value={form.busName}
            onChange={handleInputChange}
            required
          />

          <select
            name="busType"
            value={form.busType}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn loại xe khách</option>
            {/* {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))} */}
            <option value="Giường nằm"> Giường nằm</option>
            <option value="Giường nằm"> Limosine</option>
          </select>

          <input
            type="number"
            name="totalSeats"
            placeholder="Số ghế ngồi"
            value={form.totalSeats}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="licensePlate"
            placeholder="Biển số xe"
            value={form.licensePlate}
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
            {isEditing ? "Cập nhật" : "Thêm xe khách"}
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <table className="bus-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    <span onClick={() => toggleSearch("busName")}>
                      Tên xe khách
                    </span>
                    {visibleSearch.busName && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="busName"
                          placeholder="Tìm tên xe khách"
                          value={searchCriteria.busName}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("busName")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
                  <th>
                  <span onClick={() => toggleSearch("busType")}>
                    Loại xe khách
                  </span>
                  {visibleSearch.busType && (
                    <div className="search-input">
                      <input
                        type="text"
                        name="busType"
                        placeholder="Tìm loại xe khách"
                        value={searchCriteria.busType}
                        onChange={handleSearchChange}
                      />
                      <button onClick={() => clearSearch("busType")}>
                        Xóa
                      </button>
                    </div>
                  )}
                </th>
                <th>
                  <span onClick={() => toggleSearch("totalSeats")}>
                    Số ghế ngồi
                  </span>
                  {visibleSearch.totalSeats && (
                    <div className="search-input">
                      <input
                        type="number"
                        name="totalSeats"
                        placeholder="Tìm số ghế"
                        value={searchCriteria.totalSeats}
                        onChange={handleSearchChange}
                      />
                      <button onClick={() => clearSearch("totalSeats")}>
                        Xóa
                      </button>
                    </div>
                  )}
                </th>
                <th>
                  <span onClick={() => toggleSearch("licensePlate")}>
                    Biển số xe
                  </span>
                  {visibleSearch.licensePlate && (
                    <div className="search-input">
                      <input
                        type="text"
                        name="licensePlate"
                        placeholder="Tìm biển số"
                        value={searchCriteria.licensePlate}
                        onChange={handleSearchChange}
                      />
                      <button onClick={() => clearSearch("licensePlate")}>
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
                {busesToShow.map((bus) => (
                  <tr key={bus.busId}>
                    <td>{bus.busId}</td>
                    <td>{bus.busName}</td>
                    <td>{bus.busType}</td>
                    <td>{bus.totalSeats}</td>
                    <td>{bus.licensePlate}</td>
                    <td>
                      <img
                        src={bus.avatar}
                        alt="Bus Avatar"
                        width="50"
                        height="50"
                        style={{ objectFit: "cover" }}
                      />
                    </td>
                    {/* <td>{
                    categories.find((c) => c.categoryId === bus.categoryId)?.categoryName ||
                    'Không xác định'
                  }</td> */}
                    <td>
                      <button onClick={() => handleEdit(bus)}>Sửa</button>
                      <button onClick={() => handleDelete(bus.busId)}>
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
                Trang {currentPage + 1} / {paginatedBuses.totalPages}
              </span>
              <button
                disabled={currentPage + 1 === paginatedBuses.totalPages}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, paginatedBuses.totalPages - 1)
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

export default AdminBusManagement;
