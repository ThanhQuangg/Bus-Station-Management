import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCartByUserId } from "../../features/cart/cartSlice";
import {
  fetchCartDetailsByCartId,
  fetchTotalPrice,
  removeCartDetail,
} from "../../features/cart/cartDetailSlice";
import { createNewOrder } from "../../features/order/orderSlice";
import "../../styles/Cart.scss";
import MainLayout from "../../layouts/MainLayout";
// import payment from '../../assets/image/avatar.png';

const CartPage = () => {
  const dispatch = useDispatch();
  const [carts, setCarts] = useState([]);
  const [cartDetails, setCartDetails] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartStatus, setCartStatus] = useState("idle");
  const [cartDetailsStatus, setCartDetailsStatus] = useState("idle");
  const [currentUser, setCurrentUser] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState([]);

  // Lấy userId từ token và gọi API
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Giải mã token
        const userId = decodedToken?.userId;

        if (userId) {
          setCurrentUser(userId); // Cập nhật trạng thái currentUser
          setCartStatus("loading");
          dispatch(fetchCartByUserId(userId))
            .unwrap()
            .then((response) => {
              setCarts([response]); // Đảm bảo rằng phản hồi được lưu trữ dưới dạng mảng
              setCartStatus("succeeded");
            })
            .catch((error) => {
              setCartStatus("failed");
              console.error("Error fetching cart:", error);
            });
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      console.error("No token found in localStorage");
    }
  }, [dispatch]);

  // Lấy chi tiết giỏ hàng theo cartId
  useEffect(() => {
    if (carts.length > 0) {
      const cartId = carts[0].cartId; // Sử dụng carts[0].cartId
      if (cartId) {
        setCartDetailsStatus("loading");
        dispatch(fetchCartDetailsByCartId(cartId))
          .unwrap()
          .then((response) => {
            setCartDetails(response);
            setCartDetailsStatus("succeeded");
          })
          .catch((error) => {
            setCartDetailsStatus("failed");
            console.error("Error fetching cart details:", error);
          });

        dispatch(fetchTotalPrice(cartId))
          .unwrap()
          .then((response) => {
            setTotalPrice(response);
          })
          .catch((error) => {
            console.error("Error fetching total price:", error);
          });
      }
    }
  }, [dispatch, carts]);

  const handlePayment = () => {
    setShowImage(true); // Hiển thị ảnh
    setShowConfirmation(true); // Hiển thị thông báo và các nút
  };

  const handleConfirmPayment = async () => {
    const selectedDetails = cartDetails.filter((detail) =>
      selectedTickets.includes(detail.cartDetailId)
    );

    const order = {
      userId: currentUser,
      orderDetails: selectedDetails.map((detail) => ({
        ticketId: detail.ticketId.ticketId,
        quantity: detail.quantity,
        price: detail.price,
      })),
    };
    console.log("Order data:", order);
    try {
      await dispatch(createNewOrder(order)).unwrap();
      setSelectedTickets([]);
      // setShowImage(false);
      // setShowConfirmation(false);
      // Xóa các chi tiết giỏ hàng sau khi tạo đơn hàng thành công
      selectedDetails.forEach((detail) => {
        dispatch(removeCartDetail(detail.cartDetailId));
      });
      // Xử lý sau khi tạo đơn hàng thành công (ví dụ: điều hướng đến trang xác nhận)
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleCancelPayment = () => {
    setShowImage(false); // Ẩn ảnh
    setShowConfirmation(false); // Ẩn thông báo và các nút
  };

  const handleCheckboxChange = (ticketId) => {
    setSelectedTickets(
      (prevSelected) =>
        prevSelected.includes(ticketId)
          ? prevSelected.filter((id) => id !== ticketId) // Bỏ chọn
          : [...prevSelected, ticketId] // Chọn thêm
    );
  };

  const totalAmount = cartDetails
    .filter((detail) => selectedTickets.includes(detail.cartDetailId))
    .reduce((sum, detail) => sum + detail.price, 0);

  if (cartStatus === "loading" || cartDetailsStatus === "loading") {
    return <div>Loading...</div>;
  }
  if (cartStatus === "failed" || cartDetailsStatus === "failed") {
    return <div>Error loading cart data.</div>;
  }

  if (cartStatus === "loading" || cartDetailsStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (cartStatus === "failed" || cartDetailsStatus === "failed") {
    return <div>Error loading cart data.</div>;
  }

  return (
    <MainLayout>
      <div className="cart-page">
        <h1>Giỏ hàng</h1>
        <h2>Thông tin đơn hàng</h2>
        {cartDetails.length > 0 ? (
          <>
            <table className="cart-details-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên chuyến xe</th>
                  <th>Tên xe khách</th>
                  <th>Tên tài xế</th>
                  <th>Số ghế</th>
                  <th>Giá</th>
                  <th>Demo</th>
                </tr>
              </thead>
              <tbody>
                {cartDetails.map((detail) => (
                  <tr key={detail.cartDetailsId}>
                    <td>{detail.cartDetailId}</td>
                    <td>{detail.ticketId.tripId.tripName}</td>
                    <td>{detail.ticketId.tripId.busId.busName}</td>
                    <td>{detail.ticketId.tripId.driverId.fullName}</td>
                    <td>{detail.ticketId.seatId.seatNumber}</td>
                    {/* <td>{detail.quantity}</td> */}
                    <td>
                      {detail.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>
                      <input
                        className="checkbox"
                        type="checkbox"
                        checked={selectedTickets.includes(detail.cartDetailId)}
                        onChange={() =>
                          handleCheckboxChange(detail.cartDetailId)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-total">
              <h3>
                Tổng cộng:{" "}
                {totalAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </h3>
              <button
                className="checkout-button"
                onClick={handleConfirmPayment} // Thanh toán cho các ticket đã chọn
                disabled={selectedTickets.length === 0} // Vô hiệu hóa nếu không có ticket nào được chọn
              >
                Thanh toán
              </button>
            </div>
          </>
        ) : (
          <p>No items found in the cart.</p>
        )}

        {/* <div className="cart-total">
          <h3>
            Tổng cộng:{" "}
            {totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </h3>
        </div> */}

        {/* {showImage && (
          <div className="payment-image">
            <img src={payment} alt="Processing Payment" />
          </div>
        )}
        {showConfirmation && (
          <div className="confirmation">
            <p>Đã quét mã?</p>
            <button onClick={handleConfirmPayment}>Đã quét</button>
            <button onClick={handleCancelPayment}>Hủy</button>
          </div>
        )} */}
      </div>
    </MainLayout>
  );
};

export default CartPage;
