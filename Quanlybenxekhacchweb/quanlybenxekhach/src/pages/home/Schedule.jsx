import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import {
  fetchRoutes,
  fetchPaginatedRoutes,
} from "../../features/route/routeSlice";
import { searchTrips } from "../../features/trip/tripSlice";
import "../../styles/Schedule.scss";
import { format } from "date-fns";
import { addCartDetail } from "../../features/cart/cartDetailSlice";
import { fetchCartByUserId } from "../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Schedule = ({ trips }) => {
  const dispatch = useDispatch();
  const { routes, paginatedRoutes, loading } = useSelector(
    (state) => state.routes
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [matchingTrips, setMatchingTrips] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState({});
  const [seatData, setSeatData] = useState({});

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleFind = async (startLocation, endLocation) => {
    try {
      const response = await dispatch(
        searchTrips({ startLocation, endLocation, tripName: null })
      ).unwrap(); // Lấy kết quả từ Redux thunk

      if (response.length === 0) {
        alert("Không tìm thấy chuyến xe phù hợp.");
      } else {
        setMatchingTrips(response); // Cập nhật state với kết quả
      }
    } catch (error) {
      console.error("Lỗi khi tìm chuyến xe:", error);
    }
  };

  const fetchSeats = async (busId) => {
    try {
      const busIdValue = busId?.toString(); // Chuyển đổi busId thành chuỗi nếu cần
      const response = await axios.get(
        `http://localhost:8080/api/seats/search?busId=${busIdValue}&status=available`
      );

      setSeatData((prev) => {
        const updatedSeatData = {
          ...prev,
          [busId]: response.data, // Lưu trữ ghế cho bus cụ thể
        };

        return updatedSeatData;
      });
    } catch (error) {
      console.error(`Lỗi khi lấy danh sách ghế cho busId ${busId}:`, error);
    }
  };

  const handleSeatDropdownClick = (busId) => {
    if (!seatData[busId]) {
      fetchSeats(busId); // Fetch seats if not already fetched
    }
  };

  const handleSeatChange = (tripId, seatId) => {
    setSelectedSeats((prev) => ({
      ...prev,
      [tripId]: seatId,
    }));
    console.log("seatId: ", seatId);

  };

  const fetchTicketByTripAndSeat = async (tripId, seatId) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/tickets/by-trip-and-seat",
        {
          params: { tripId, seatId },
        }
      );
      return response.data; // API trả về thông tin vé
    } catch (error) {
      console.error("Lỗi khi lấy ticketId:", error);
      throw error;
    }
  };

  const handleBookClick = async (tripId) => {
    const seatId = selectedSeats[tripId];
    if (!seatId) {
      alert("Vui lòng chọn ghế trước khi đặt vé!");
      return;
    }

    if (!currentUser?.cartId) {
      alert("Không tìm thấy thông tin giỏ hàng của bạn. Vui lòng thử lại!");
      return;
    }

    try {
      // Lấy ticketId từ API
      const ticket = await fetchTicketByTripAndSeat(tripId, seatId);
      const ticketId = ticket.ticketId; // Lấy ticketId từ kết quả API
      const price = ticket.tripId.ticketPrice;
      if (!ticketId) {
        alert("Không tìm thấy thông tin vé phù hợp.");
        return;
      }
      // Dữ liệu cho API 1
      const cartDetailPayload = {
        ticketId: { ticketId },
        seatId: { seatId },
        quantity: 1,
        price: price, // Giá vé
        cart: { cartId: currentUser.cartId }, // Sử dụng cartId từ state
      };

      // Dữ liệu cho API 2
      const ticketPayload = {
        tripId,
        seatId,
        userId: currentUser.userId, // currentUser là userId từ token
      };

      // Gọi hai API đồng thời
      const [cartDetailResponse, ticketResponse] = await Promise.all([
        axios.post("http://localhost:8080/api/cartdetails", cartDetailPayload),
        // axios.post("http://localhost:8080/api/tickets/book", ticketPayload),
        await axios.post("http://localhost:8080/api/tickets/book", null, {
          params: ticketPayload,
        }),
      ]);

      // Xử lý kết quả trả về
      console.log("Cart Detail Response:", cartDetailResponse.data);
      console.log("Ticket Booking Response:", ticketResponse.data);

      alert("Đặt vé thành công!");
      navigate(`/booking/confirmation?tripId=${tripId}`);
    } catch (error) {
      console.error("Lỗi khi đặt vé:", error);
      alert("Đặt vé thất bại. Vui lòng thử lại!");
    }
  };
 
  useEffect(() => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Giải mã token
        const userId = decodedToken?.userId; // Lấy userId từ token
        if (userId) {
          // setCurrentUser(userId); // Cập nhật trạng thái currentUser nếu userId tồn tại
          dispatch(fetchCartByUserId(userId))
            .unwrap()
            .then((cart) => {
              if (cart && cart.cartId) {
                setCurrentUser({ userId, cartId: cart.cartId }); // Cập nhật cả userId và cartId
              } else {
                setCurrentUser({ userId }); // Chỉ cập nhật userId nếu không có cartId
              }
            })
            .catch((error) => {
              console.error("Lỗi khi lấy cartId:", error);
              setCurrentUser({ userId }); // Cập nhật userId ngay cả khi có lỗi
            });
        }
      } catch (error) {
        console.error("Invalid token:", error); // Xử lý lỗi nếu token không hợp lệ
      }
    } else {
      console.error("No token found in localStorage"); // Log lỗi nếu không tìm thấy token
    }
  }, []);

  useEffect(() => {
    dispatch(fetchPaginatedRoutes({ page: currentPage, size: pageSize }));
  }, [dispatch, currentPage, pageSize]);
  return (
    <MainLayout>
      <div className="schedule-container">
        <h1>Lịch trình các tuyến xe</h1>
        <table className="schedule-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên tuyến xe</th>
              <th>Điểm bắt đầu</th>
              <th>Điểm kết thúc</th>
              <th>Khoảng cách</th>
              <th>Thời gian di chuyển</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRoutes.content.map((route) => (
              <tr key={route.routeId}>
                <td>{route.routeId}</td>
                <td>{route.name}</td>
                <td>{route.startLocation}</td>
                <td>{route.endLocation}</td>
                <td>{route.distance} km</td>
                <td>{route.estimatedDuration}</td>
                <td>
                  <button
                    onClick={() =>
                      handleFind(route.startLocation, route.endLocation)
                    }
                  >
                    Tìm chuyến xe phù hợp
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
        {matchingTrips.length > 0 && (
          <div className="matching-trips">
            <h1 style={{ marginTop: "25px" }}>Danh sách chuyến xe phù hợp</h1>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên chuyến</th>
                  <th>Tên tài xế</th>
                  <th>Tên xe khách</th>
                  <th>Điểm bắt đầu</th>
                  <th>Điểm kết thúc</th>
                  <th>Thời gian xuất phát</th>
                  <th>Thời gian đến</th>
                  <th>Giá vé</th>
                  <th>Chọn ghế</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {matchingTrips.map((trip) => (
                  <tr key={trip.tripId}>
                    <td>{trip.tripId}</td>
                    <td>{trip.tripName}</td>
                    <td>{trip.driverId.fullName}</td>
                    <td>{trip.busId.busName}</td>
                    <td>{trip.routeId.startLocation}</td>
                    <td>{trip.routeId.endLocation}</td>
                    <td>
                      {format(
                        new Date(trip.departureTime),
                        "dd/MM/yyyy 'lúc' H 'giờ' mm 'phút'"
                      )}
                    </td>
                    <td>
                      {format(
                        new Date(trip.arrivalTime),
                        "dd/MM/yyyy 'lúc' H 'giờ' mm 'phút'"
                      )}
                    </td>
                    <td>{formatCurrency(trip.ticketPrice)}</td>
                    <td>
                      <select
                        value={selectedSeats[trip.tripId] || ""}
                        onClick={() => {
                          handleSeatDropdownClick(trip.busId.busId);
                        }}
                        onChange={(e) =>
                          handleSeatChange(trip.tripId, e.target.value)
                        }
                        // onClick={() =>
                        //   handleSeatDropdownClick(trip.busId)}
                        // onChange={(e) =>
                        //   handleSeatChange(trip.tripId, e.target.value)
                        // }
                      >
                        <option value="">Chọn ghế</option>
                        {seatData[trip.busId.busId]?.map((seat) => (
                          <option key={seat.seatId} value={seat.seatId}>
                            {seat.seatNumber}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button onClick={() => handleBookClick(trip.tripId)}>
                        Đặt vé xe
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Schedule;
