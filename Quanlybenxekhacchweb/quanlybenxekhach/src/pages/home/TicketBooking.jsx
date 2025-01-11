import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
// import { bookTicket } from "../../features/ticket/ticketSlice";
// import "../../styles/Booking.scss";

const Booking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const tripId = location.state?.tripId;
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    numberOfTickets: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(
        bookTicket({
          tripId,
          ...formData,
        })
      ).unwrap();

      alert("Đặt vé thành công! Mã vé: " + response.ticketId);
      navigate("/success", { state: { ticketId: response.ticketId } });
    } catch (error) {
      console.error("Error booking ticket:", error);
      alert("Đã xảy ra lỗi khi đặt vé. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="booking-container">
      <h1>Đặt vé xe</h1>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="fullName">Họ và tên</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Số điện thoại</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="numberOfTickets">Số lượng vé</label>
          <input
            type="number"
            id="numberOfTickets"
            name="numberOfTickets"
            value={formData.numberOfTickets}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <button type="submit">Xác nhận đặt vé</button>
      </form>
    </div>
  );
};

export default Booking;