import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import {
  fetchPaginatedSeats,
  fetchAllSeats,
  searchSeat,
  createSeat,
  updateSeat,
  deleteSeat,
} from "../../features/seat/seatSlice";
import {
  fetchPaginatedBuses,
  fetchAllBuses,
} from "../../features/bus/busSlice";
import "../../styles/AdminSeat.scss";

const AdminSeatManagement = () => {
  const dispatch = useDispatch();
  const { seats, paginatedSeats, loading, searchResults } = useSelector(
    (state) => state.seats
  );
  const { buses, paginatedBuses } = useSelector((state) => state.buses);

  const [form, setForm] = useState({
    busId: "",
    seatNumber: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentSeatId, setCurrentSeatId] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [seatsPerPage, setSeatsPerPage] = useState(2);
  const [customSeatsPerPage, setCustomSeatsPerPage] = useState("");

  const [searchCriteria, setSearchCriteria] = useState({
    seatNumber: "",
    busName: "",
  });
  const [visibleSearch, setVisibleSearch] = useState({
    seatNumber: false,
    busName: false,
  });

  useEffect(() => {
    if (searchCriteria.seatNumber || searchCriteria.busName) {
      dispatch(searchSeat(searchCriteria));
    } else {
      dispatch(fetchPaginatedSeats({ page: currentPage, size: seatsPerPage }));
    }
  }, [dispatch, currentPage, seatsPerPage, searchCriteria]);
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };
  const seatsToShow =
    searchResults.length > 0 ? searchResults : paginatedSeats.content;
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
      setSeatsPerPage(""); // Reset giá trị nếu chọn "Tùy chỉnh"
    } else {
      setSeatsPerPage(Number(value));
      setCustomSeatsPerPage(""); // Xóa giá trị tùy chỉnh nếu chọn option khác
    }
  };
  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    const number = Number(value);
    if (!isNaN(number) && number > 0) {
      setSeatsPerPage(number); // Cập nhật số lượng người dùng khi nhập đúng số
    }
    setCustomSeatsPerPage(value); // Lưu giá trị trong input
  };

  useEffect(() => {
    dispatch(fetchPaginatedSeats({ page: currentPage, size: seatsPerPage }));
    dispatch(fetchAllBuses());
  }, [dispatch, currentPage, seatsPerPage]);

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
    formData.append("seatNumber", form.seatNumber);

    if (isEditing) {
      dispatch(updateSeat({ id: currentSeatId, formData })); // Gửi formData khi chỉnh sửa
    } else {
      dispatch(createSeat(formData)); // Gửi formData khi thêm mới
    }

    resetForm();
  };
  const resetForm = () => {
    setForm({
      busId: "",
      seatNumber: "",
    });
    setIsEditing(false);
    setCurrentSeatId(null);
  };

  const handleEdit = (seat) => {
    setForm({
      busId: seat.busId,
      seatNumber: seat.seatNumber,
    });
    setIsEditing(true);
    setCurrentSeatId(seat.seatId);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ghế này?")) {
      dispatch(deleteSeat(id));
    }
  };

  return (
    <MainLayout>
      <div className="admin-seat-management">
        <h1>Quản lý ghế</h1>
        <select
          className="form-select w-25"
          value={seatsPerPage || "custom"}
          onChange={handleSelectChange}
        >
          <option value={2}>2 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value="custom">Tùy chỉnh</option>
        </select>
        {seatsPerPage === "" && (
          <input
            type="number"
            className="form-control w-25 mt-2"
            placeholder="Nhập số ghế mỗi trang"
            value={customSeatsPerPage}
            onChange={handleCustomInputChange}
            min={1}
          />
        )}
        <form className="seat-form" onSubmit={handleSubmit}>
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

          <input
            type="text"
            name="seatNumber"
            placeholder="Số ghế"
            value={form.seatNumber}
            onChange={handleInputChange}
            required
          />

          <button type="submit">
            {isEditing ? "Cập nhật" : "Thêm ghế xe"}
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <table className="seat-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    <span onClick={() => toggleSearch("busName")}>
                      Tên chuyến xe
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
                    <span onClick={() => toggleSearch("seatNumber")}>Số ghế</span>
                    {visibleSearch.seatNumber && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="seatNumber"
                          placeholder="Nhập số ghế"
                          value={searchCriteria.seatNumber}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("seatNumber")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
  
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {seatsToShow.map((seat) => (
                  <tr key={seat.seatId}>
                    <td>{seat.seatId}</td>
                    <td>{seat.busId.busName}</td>
                    <td>{seat.seatNumber}</td>
                    <td>{seat.status}</td>
                    <td>
                      <button onClick={() => handleEdit(seat)}>Sửa</button>
                      <button onClick={() => handleDelete(seat.seatId)}>
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
                Trang {currentPage + 1} / {paginatedSeats.totalPages}
              </span>
              <button
                disabled={currentPage + 1 === paginatedSeats.totalPages}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, paginatedSeats.totalPages - 1)
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

export default AdminSeatManagement;
