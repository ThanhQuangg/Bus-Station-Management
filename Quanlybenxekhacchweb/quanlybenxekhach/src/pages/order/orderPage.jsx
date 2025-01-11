import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrdersByUserId,
  fetchOrderDetailsByOrderId,
} from "../../features/order/orderSlice";
import MainLayout from "../../layouts/MainLayout";
import { format } from "date-fns";
import "../../styles/Order.scss";

const OrderPage = () => {
  const dispatch = useDispatch();

  // Lấy `userId` từ token trong localStorage
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;
  const { orders, orderDetails, status, error } = useSelector(
    (state) => state.orders
  );
  console.log("orders: ", orders);
  console.log("orderDetails: ", orderDetails);

  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Lấy danh sách orders khi trang được load
  useEffect(() => {
    if (userId) {
      dispatch(fetchOrdersByUserId(userId));
    }
  }, [dispatch, userId]);

  // Lấy chi tiết đơn hàng khi chọn một order
  useEffect(() => {
    if (selectedOrderId) {
      dispatch(fetchOrderDetailsByOrderId(selectedOrderId));
    }
  }, [dispatch, selectedOrderId]);

  // Hiển thị trạng thái loading/error nếu có
  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <MainLayout>
      <div style={{ padding: "20px" }} className="order-page">
        <h1>Đơn hàng</h1>

        {/* Danh sách đơn hàng */}
        <div style={{ marginBottom: "20px" }} className="order-list">
          <h2>Danh sách đơn hàng</h2>
          <ul>
            {orders.map((order) => (
              <li key={order.orderId} style={{ margin: "10px 0" }}>
                <button
                  onClick={() => setSelectedOrderId(order.orderId)}
                  style={{
                    background:
                      selectedOrderId === order.orderId ? "#007bff" : "#f0f0f0",
                    color: selectedOrderId === order.orderId ? "#fff" : "#000",
                    padding: "10px 15px",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  ID đơn hàng: {order.orderId} - Tổng tiền:{" "}
                  {formatCurrency(order.total)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chi tiết đơn hàng */}

        {selectedOrderId ? (
          <>
            {/* Bảng chi tiết đơn hàng */}
            <div className="order-details">
              {/* Nút Đóng */}
              <button
                onClick={() => setSelectedOrderId(null)}
                style={{
                  background: "#dc3545",
                  color: "#fff",
                  padding: "10px 15px",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "5px",
                  marginBottom: "20px",
                }}
              >
                Đóng
              </button>
              <h2>Chi tiết đơn hàng</h2>
              {orderDetails.length > 0 ? (
                <table className="table-orders">
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
                      <th>Số ghế</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((detail) => (
                      <tr key={detail.orderDetailId}>
                        <td>{detail.orderDetailId}</td>
                        <td>{detail.ticketId.tripId.tripName}</td>
                        <td>{detail.ticketId.tripId.driverId.fullName}</td>
                        <td>{detail.ticketId.tripId.busId.busName}</td>
                        <td>{detail.ticketId.tripId.routeId.startLocation}</td>
                        <td>{detail.ticketId.tripId.routeId.endLocation}</td>
                        <td>
                          {format(
                            new Date(detail.ticketId.tripId.departureTime),
                            "dd/MM/yyyy 'lúc' H 'giờ' mm 'phút'"
                          )}
                        </td>
                        <td>
                          {format(
                            new Date(detail.ticketId.tripId.arrivalTime),
                            "dd/MM/yyyy 'lúc' H 'giờ' mm 'phút'"
                          )}
                        </td>
                        <td>{formatCurrency(detail.price)}</td>
                        <td>{detail.ticketId.seatId.seatNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No details available for this order.</p>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </MainLayout>
  );
};

export default OrderPage;
