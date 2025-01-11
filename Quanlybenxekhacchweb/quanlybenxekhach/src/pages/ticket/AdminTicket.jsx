import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import {
  fetchAllTickets,
  fetchPaginatedTickets,
  searchTicket,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../../features/ticket/ticketSlice";
import { fetchAllTrips } from "../../features/trip/tripSlice";
import { fetchAllSeats } from "../../features/seat/seatSlice";
import { fetchAllCustomers } from "../../features/customer/customerSlice";
import "../../styles/Adminticket.scss";

const AdminTicketManagement = () => {
  const dispatch = useDispatch();
  const { tickets, paginatedTickets, loading, searchResults } = useSelector(
    (state) => state.tickets
  );
  const { trips } = useSelector((state) => state.trips);
  const { seats } = useSelector((state) => state.seats);
  const { customers } = useSelector((state) => state.customers);

  const [form, setForm] = useState({
    tripId: "",
    seatId: "",
    customerId: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentticketId, setCurrentticketId] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [ticketsPerPage, setTicketsPerPage] = useState(2);
  const [customTicketsPerPage, setCustomTicketsPerPage] = useState("");

  const [searchCriteria, setSearchCriteria] = useState({
    tripName: "",
    seatNumber: "",
    username: "",
  });
  const [visibleSearch, setVisibleSearch] = useState({
    tripName: false,
    seatNumber: false,
    username: false,
  });

  useEffect(() => {
    if (
      searchCriteria.tripName ||
      searchCriteria.seatNumber ||
      searchCriteria.username
    ) {
      dispatch(searchTicket(searchCriteria));
    } else {
      dispatch(
        fetchPaginatedTickets({ page: currentPage, size: ticketsPerPage })
      );
    }
  }, [dispatch, currentPage, ticketsPerPage, searchCriteria]);
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };
  const ticketsToShow =
    searchResults.length > 0 ? searchResults : paginatedTickets.content;
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
      setTicketsPerPage(""); // Reset giá trị nếu chọn "Tùy chỉnh"
    } else {
      setTicketsPerPage(Number(value));
      setCustomTicketsPerPage(""); // Xóa giá trị tùy chỉnh nếu chọn option khác
    }
  };
  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    const number = Number(value);
    if (!isNaN(number) && number > 0) {
      setTicketsPerPage(number); // Cập nhật số lượng người dùng khi nhập đúng số
    }
    setCustomTicketsPerPage(value); // Lưu giá trị trong input
  };

  useEffect(() => {
    dispatch(fetchPaginatedTickets({ page: currentPage, size: ticketsPerPage }));
  }, [dispatch, currentPage, ticketsPerPage]);
  useEffect(() => {
    dispatch(fetchAllTrips());
    dispatch(fetchAllSeats());
    dispatch(fetchAllCustomers());
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
    formData.append("tripId", form.tripId);
    formData.append("seatId", form.seatId);
    formData.append("customerId", form.customerId);

    if (isEditing) {
      dispatch(updateTicket({ id: currentticketId, formData })); // Gửi formData khi chỉnh sửa
    } else {
      dispatch(createTicket(formData)); // Gửi formData khi thêm mới
    }

    resetForm();
  };
  const resetForm = () => {
    setForm({
      tripId: "",
      seatId: "",
      customerId: "",
    });
    setIsEditing(false);
    setCurrentticketId(null);
  };

  const handleEdit = (ticket) => {
    setForm({
      tripId: ticket.tripId.tripId,
      seatId: ticket.seatId.seatId,
    });
    setIsEditing(true);
    setCurrentticketId(ticket.ticketId);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vé xe này?")) {
      dispatch(deleteTicket(id));
    }
  };

  return (
    <MainLayout>
      <div className="admin-ticket-management">
        <h1>Quản lý vé xe </h1>
        <select
          className="form-select w-25"
          value={ticketsPerPage || "custom"}
          onChange={handleSelectChange}
        >
          <option value={2}>2 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value="custom">Tùy chỉnh</option>
        </select>
        {ticketsPerPage === "" && (
          <input
            type="number"
            className="form-control w-25 mt-2"
            placeholder="Nhập số xe khách mỗi trang"
            value={customTicketsPerPage}
            onChange={handleCustomInputChange}
            min={1}
          />
        )}
        <form className="ticket-form" onSubmit={handleSubmit}>
          <select
            name="tripId"
            value={form.tripId}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn chuyến xe</option>
            {trips.map((trip) => (
              <option key={trip.tripId} value={trip.tripId}>
                {trip.tripName}
              </option>
            ))}
          </select>
          <select
            name="seatId"
            value={form.seatId}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn ghế</option>
            {seats.map((seat) => (
              <option key={seat.seatId} value={seat.seatId}>
                {seat.seatNumber}
              </option>
            ))}
          </select>

          <button type="submit">
            {isEditing ? "Cập nhật vé xe" : "Thêm vé xe"}
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <table className="ticket-table">
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
                          value={searchCriteria.tripName}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("tripName")}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </th>
                  <th>
                    <span onClick={() => toggleSearch("seatNumber")}>
                      Số ghế
                    </span>
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
                  <th>
                    <span onClick={() => toggleSearch("username")}>
                      Tên khách hàng
                    </span>
                    {visibleSearch.username && (
                      <div className="search-input">
                        <input
                          type="text"
                          name="username"
                          placeholder="Nhập tên khách hàng"
                          value={searchCriteria.username}
                          onChange={handleSearchChange}
                        />
                        <button onClick={() => clearSearch("username")}>
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
                {ticketsToShow.map((ticket) => (
                  <tr key={ticket.ticketId}>
                    <td>{ticket.ticketId}</td>
                    <td>{ticket.tripId.tripName}</td>
                    <td>{ticket.seatId.seatNumber}</td>
                    <td>{ticket.userId.username}</td>
                    <td>{ticket.status}</td>
                    <td>
                      <button onClick={() => handleEdit(ticket)}>Sửa</button>
                      <button onClick={() => handleDelete(ticket.ticketId)}>
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
                Trang {currentPage + 1} / {paginatedTickets.totalPages}
              </span>
              <button
                disabled={currentPage + 1 === paginatedTickets.totalPages}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, paginatedTickets.totalPages - 1)
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

export default AdminTicketManagement;
