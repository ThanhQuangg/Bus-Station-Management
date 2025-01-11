import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import {
  fetchAllTrips,
  fetchPaginatedTrips,
  search_Trip,
  createTrip,
  updateTrip,
  deleteTrip,
} from "../../features/trip/tripSlice";
import { fetchAllDrivers } from "../../features/driver/driverSlice";
import { fetchAllBuses } from "../../features/bus/busSlice";
import { fetchRoutes } from "../../features/route/routeSlice";
import "../../styles/Admintrip.scss";
import { format } from "date-fns";

const AdmintripManagement = () => {
  const dispatch = useDispatch();
  const { trips, paginatedTrips, loading, searchResults } = useSelector(
    (state) => state.trips
  );
  const { buses } = useSelector((state) => state.buses);
  const { routes } = useSelector((state) => state.routes);
  const { drivers } = useSelector((state) => state.drivers);
  const [form, setForm] = useState({
    busId: "",
    departureTime: "",
    arrivalTime: "",
    ticketPrice: "",
    routeId: "",
    tripName: "",
    driverId: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currenttripId, setCurrenttripId] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [tripsPerPage, setTripsPerPage] = useState(2);
  const [customTripsPerPage, setCustomTripsPerPage] = useState("");

  const [searchCriteria, setSearchCriteria] = useState({
    tripName: "",
    busName: "",
    fullName: "",
    departureTime: "",
    arrivalTime: "",
    ticketPrice: "",
    name: "",
  });
  const [visibleSearch, setVisibleSearch] = useState({
    tripName: false,
    busName: false,
    fullName: false,
    departureTime: false,
    arrivalTime: false,
    ticketPrice: false,
    name: false,
  });

  useEffect(() => {
    if (
      searchCriteria.tripName ||
      searchCriteria.busName ||
      searchCriteria.fullName ||
      searchCriteria.departureTime ||
      searchCriteria.arrivalTime ||
      searchCriteria.ticketPrice ||
      searchCriteria.name
    ) {
      dispatch(search_Trip(searchCriteria));
    } else {
      dispatch(fetchPaginatedTrips({ page: currentPage, size: tripsPerPage }));
    }
  }, [dispatch, currentPage, tripsPerPage, searchCriteria]);
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };
  const tripsToShow =
    searchResults.length > 0 ? searchResults : paginatedTrips.content;
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
      setTripsPerPage(""); // Reset giá trị nếu chọn "Tùy chỉnh"
    } else {
      setTripsPerPage(Number(value));
      setCustomTripsPerPage(""); // Xóa giá trị tùy chỉnh nếu chọn option khác
    }
  };
  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    const number = Number(value);
    if (!isNaN(number) && number > 0) {
      setTripsPerPage(number); // Cập nhật số lượng người dùng khi nhập đúng số
    }
    setCustomTripsPerPage(value); // Lưu giá trị trong input
  };

  useEffect(() => {
    dispatch(fetchPaginatedTrips({ page: currentPage, size: tripsPerPage }));
  }, [dispatch, currentPage, tripsPerPage]);
  useEffect(() => {
    dispatch(fetchAllBuses());
    dispatch(fetchRoutes());
    dispatch(fetchAllDrivers());
  }, [dispatch]);

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
    formData.append("busId", form.busId);
    formData.append("departureTime", form.departureTime);
    formData.append("arrivalTime", form.arrivalTime);
    formData.append("ticketPrice", form.ticketPrice);
    formData.append("routeId", form.routeId);
    formData.append("tripName", form.tripName);
    formData.append("driverId", form.driverId);

    if (form.avatar) {
      formData.append("avatar", form.avatar); // Chỉ thêm avatar nếu tồn tại
    }

    if (isEditing) {
      dispatch(updateTrip({ id: currenttripId, formData })); // Gửi formData khi chỉnh sửa
    } else {
      dispatch(createTrip(formData)); // Gửi formData khi thêm mới
    }

    resetForm();
  };
  const resetForm = () => {
    setForm({
      busId: "",
      departureTime: "",
      arrivalTime: "",
      ticketPrice: "",
      routeId: "",
      tripName: "",
      driverId: "",
    });
    setIsEditing(false);
    setCurrenttripId(null);
  };

  const handleEdit = (trip) => {
    setForm({
      busId: trip.busId.busId,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      ticketPrice: trip.ticketPrice,
      routeId: trip.routeId.routeId,
      tripName: trip.tripName,
      driverId: trip.driverId.driverId,
    });
    setIsEditing(true);
    setCurrenttripId(trip.tripId);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chuyến xe này?")) {
      dispatch(deleteTrip(id));
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="admin-trip-management">
        <h1>Quản lý chuyến xe</h1>
        <select
          className="form-select w-25"
          value={tripsPerPage || "custom"}
          onChange={handleSelectChange}
        >
          <option value={2}>2 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value="custom">Tùy chỉnh</option>
        </select>
        {tripsPerPage === "" && (
          <input
            type="number"
            className="form-control w-25 mt-2"
            placeholder="Nhập số xe khách mỗi trang"
            value={customTicketsPerPage}
            onChange={handleCustomInputChange}
            min={1}
          />
        )}
        <form className="trip-form" onSubmit={handleSubmit}>
          <select
            name="busId"
            value={form.busId}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn xe khách</option>
            {buses.map((bus) => (
              <option key={bus.busId} value={bus.busId}>
                {bus.busName}
              </option>
            ))}
          </select>
          <select
            name="driverId"
            value={form.driverId}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn tài xế</option>
            {drivers.map((driver) => (
              <option key={driver.driverId} value={driver.driverId}>
                {driver.fullName}
              </option>
            ))}
          </select>
          <select
            name="routeId"
            value={form.routeId}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn tuyến xe</option>
            {routes.map((route) => (
              <option key={route.routeId} value={route.routeId}>
                {route.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="tripName"
            placeholder="Tên chuyến xe"
            value={form.tripName}
            onChange={handleInputChange}
            required
          />

          <input
            type="datetime-local"
            name="departureTime"
            placeholder="Thời gian xuất phát"
            value={form.departureTime}
            onChange={handleInputChange}
            required
          />

          <input
            type="datetime-local"
            name="arrivalTime"
            placeholder="Thời gian đến"
            value={form.arrivalTime}
            onChange={handleInputChange}
            required
          />

          <input
            type="number"
            name="ticketPrice"
            placeholder="Giá vé"
            value={form.ticketPrice}
            onChange={handleInputChange}
            required
          />

          {/* <input type="file" name="avatar" onChange={handleFileChange} /> */}
          <button type="submit">
            {isEditing ? "Cập nhật" : "Thêm chuyến xe"}
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <table className="trip-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    <span onClick={() => toggleSearch("tripName")}>
                      Tên chuyến xe
                    </span>
                    {visibleSearch.tripName && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="tripName"
                          placeholder="Nhập tên chuyến xe"
                          value={searchCriteria.seatNumber}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("seatNumber")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
                  <th>
                    <span onClick={() => toggleSearch("busName")}>
                      Tên xe khách
                    </span>
                    {visibleSearch.busName && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="busName"
                          placeholder="Nhập tên xe khách"
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
                    <span onClick={() => toggleSearch("departureTime")}>
                      Thời gian khởi hành
                    </span>
                    {visibleSearch.departureTime && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="departureTime"
                          placeholder="Nhập thời gian khởi hành"
                          value={searchCriteria.departureTime}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("departureTime")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
                  <th>
                    <span onClick={() => toggleSearch("arrivalTime")}>
                      Thời gian đến
                    </span>
                    {visibleSearch.arrivalTime && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="arrivalTime"
                          placeholder="Nhập thời gian đến"
                          value={searchCriteria.arrivalTime}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("arrivalTime")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
                  <th>
                    <span onClick={() => toggleSearch("ticketPrice")}>
                      Giá vé
                    </span>
                    {visibleSearch.ticketPrice && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="ticketPrice"
                          placeholder="Nhập giá vé"
                          value={searchCriteria.ticketPrice}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("ticketPrice")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
                  <th>
                    <span onClick={() => toggleSearch("name")}>
                     Tên chuyến xe
                    </span>
                    {visibleSearch.name && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="name"
                          placeholder="Nhập tên chuyến xe"
                          value={searchCriteria.name}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("name")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tripsToShow.map((trip) => (
                  <tr key={trip.tripId}>
                    <td>{trip.tripId}</td>
                    <td>{trip.tripName}</td>
                    <td>{trip.busId.busName}</td>
                    <td>{trip.driverId.fullName}</td>
                    <td>
                      {format(
                        new Date(trip.departureTime),
                        "dd/MM/yyyy 'lúc' H 'giờ'"
                      )}
                    </td>
                    <td>
                      {format(
                        new Date(trip.arrivalTime),
                        "dd/MM/yyyy 'lúc' H 'giờ'"
                      )}
                    </td>
                    <td>{formatCurrency(trip.ticketPrice)}</td>
                    <td>{trip.routeId.name}</td>
                   
                    
                    
                    <td>
                      <button onClick={() => handleEdit(trip)}>Sửa</button>
                      <button onClick={() => handleDelete(trip.tripId)}>
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
                Trang {currentPage + 1} / {paginatedTrips.totalPages}
              </span>
              <button
                disabled={currentPage + 1 === paginatedTrips.totalPages}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, paginatedTrips.totalPages - 1)
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

export default AdmintripManagement;
