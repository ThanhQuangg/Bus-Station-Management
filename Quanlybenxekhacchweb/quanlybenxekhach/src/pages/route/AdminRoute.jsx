import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import {
  fetchRoutes,
  fetchPaginatedRoutes,
  searchRoute,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../../features/route/routeSlice";
import "../../styles/AdminRoute.scss";

const AdminRouteManagement = () => {
  const dispatch = useDispatch();
  const { routes, paginatedRoutes, loading, searchResults } = useSelector(
    (state) => state.routes
  );

  const [form, setForm] = useState({
    name: "",
    startLocation: "",
    endLocation: "",
    distance: "",
    estimatedDuration: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentRouteId, setCurrentRouteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [routesPerPage, setRoutesPerPage] = useState(2);
  const [customRoutesPerPage, setCustomRoutesPerPage] = useState("");

  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    startLocation: "",
    endLocation: "",
    distance: "",
    estimatedDuration: "",
  });
  const [visibleSearch, setVisibleSearch] = useState({
    name: false,
    startLocation: false,
    endLocation: false,
    distance: false,
    estimatedDuration: false,
  });

  useEffect(() => {
    if (
      searchCriteria.name ||
      searchCriteria.startLocation ||
      searchCriteria.endLocation ||
      searchCriteria.distance ||
      searchCriteria.estimatedDuration
    ) {
      dispatch(searchRoute(searchCriteria));
    } else {
      dispatch(
        fetchPaginatedRoutes({ page: currentPage, size: routesPerPage })
      );
    }
  }, [dispatch, currentPage, routesPerPage, searchCriteria]);
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };
  const routesToShow =
    searchResults.length > 0 ? searchResults : paginatedRoutes.content;
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
      setRoutesPerPage(""); // Reset giá trị nếu chọn "Tùy chỉnh"
    } else {
      setRoutesPerPage(Number(value));
      setCustomRoutesPerPage(""); // Xóa giá trị tùy chỉnh nếu chọn option khác
    }
  };
  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    const number = Number(value);
    if (!isNaN(number) && number > 0) {
      setRoutesPerPage(number); // Cập nhật số lượng người dùng khi nhập đúng số
    }
    setCustomRoutesPerPage(value); // Lưu giá trị trong input
  };

  useEffect(() => {
    dispatch(fetchPaginatedRoutes({ page: currentPage, size: routesPerPage }));
  }, [dispatch, currentPage, routesPerPage]);

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
    formData.append("name", form.name);
    formData.append("startLocation", form.startLocation);
    formData.append("endLocation", form.endLocation);
    formData.append("distance", form.distance);
    formData.append("estimatedDuration", form.estimatedDuration);

    if (isEditing) {
      dispatch(updateRoute({ id: currentRouteId, formData })); // Gửi formData khi chỉnh sửa
    } else {
      dispatch(createRoute(formData)); // Gửi formData khi thêm mới
    }

    resetForm();
  };
  const resetForm = () => {
    setForm({
      name: "",
      startLocation: "",
      endLocation: "",
      distance: "",
      estimatedDuration: "",
    });
    setIsEditing(false);
    setCurrentRouteId(null);
  };

  const handleEdit = (route) => {
    setForm({
      name: route.name,
      startLocation: route.startLocation,
      endLocation: route.endLocation,
      distance: route.distance,
      estimatedDuration: route.estimatedDuration,
    });
    setIsEditing(true);
    setCurrentRouteId(route.routeId);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tuyến xe này?")) {
      dispatch(deleteRoute(id));
    }
  };

  return (
    <MainLayout>
      <div className="admin-route-management">
        <h1>Quản lý tuyến xe</h1>
        <select
          className="form-select w-25"
          value={routesPerPage || "custom"}
          onChange={handleSelectChange}
        >
          <option value={2}>2 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value="custom">Tùy chỉnh</option>
        </select>
        {routesPerPage === "" && (
          <input
            type="number"
            className="form-control w-25 mt-2"
            placeholder="Nhập số xe khách mỗi trang"
            value={customRoutesPerPage}
            onChange={handleCustomInputChange}
            min={1}
          />
        )}
        <form className="route-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Tên chuyến xe"
            value={form.name}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="startLocation"
            placeholder="Điểm xuất phát"
            value={form.startLocation}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="endLocation"
            placeholder="Điểm kết thúc"
            value={form.endLocation}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="distance"
            placeholder="Khoảng cách"
            value={form.distance}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="estimatedDuration"
            placeholder="Thời gian di chuyển dự kiến"
            value={form.estimatedDuration}
            onChange={handleInputChange}
            required
          />
          <button type="submit">
            {isEditing ? "Cập nhật" : "Thêm tuyến xe"}
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <table className="route-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    <span onClick={() => toggleSearch("name")}>
                      Tên tuyến xe
                    </span>
                    {visibleSearch.name && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="name"
                          placeholder="Nhập tên tuyến xe"
                          value={searchCriteria.name}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("name")}>Xóa</button>
                      </div>
                    )}
                  </th>
                  <th>
                    <span onClick={() => toggleSearch("startLocation")}>
                      Điểm bắt đầu
                    </span>
                    {visibleSearch.startLocation && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="startLocation"
                          placeholder="Nhập điểm xuất phát"
                          value={searchCriteria.startLocation}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("startLocation")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
                  <th>
                    <span onClick={() => toggleSearch("endLocation")}>
                      Điểm kết thúc
                    </span>
                    {visibleSearch.endLocation && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="endLocation"
                          placeholder="Nhập điểm kết thúc"
                          value={searchCriteria.endLocation}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("endLocation")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
                  <th>
                    <span onClick={() => toggleSearch("distance")}>
                      Khoảng cách
                    </span>
                    {visibleSearch.distance && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="distance"
                          placeholder="Nhập khoảng cách"
                          value={searchCriteria.distance}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("distance")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
                  <th>
                    <span onClick={() => toggleSearch("estimatedDuration")}>
                      Thời gian di chuyển
                    </span>
                    {visibleSearch.estimatedDuration && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="estimatedDuration"
                          placeholder="Nhập thời gian di chuyển"
                          value={searchCriteria.estimatedDuration}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("estimatedDuration")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>

                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {routesToShow.map((route) => (
                  <tr key={route.routeId}>
                    <td>{route.routeId}</td>
                    <td>{route.name}</td>
                    <td>{route.startLocation}</td>
                    <td>{route.endLocation}</td>
                    <td>{route.distance} km</td>
                    <td>{route.estimatedDuration}</td>
                    <td>
                      <button onClick={() => handleEdit(route)}>Sửa</button>
                      <button onClick={() => handleDelete(route.routeId)}>
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
                Trang {currentPage + 1} / {paginatedRoutes.totalPages}
              </span>
              <button
                disabled={currentPage + 1 === paginatedRoutes.totalPages}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, paginatedRoutes.totalPages - 1)
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

export default AdminRouteManagement;
