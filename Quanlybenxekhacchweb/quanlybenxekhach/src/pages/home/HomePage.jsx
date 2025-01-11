import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBuses } from "../../features/bus/busSlice";
import { fetchRoutes } from "../../features/route/routeSlice";
import "../../styles/HomePage.scss";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import banner1 from "../../assets/image/banner1.jpg";
import banner2 from "../../assets/image/banner2.jpg";
import banner3 from "../../assets/image/banner3.jpg";
import { searchTrips } from "../../features/trip/tripSlice";
import { format } from "date-fns";

const HomePage = () => {
  const dispatch = useDispatch();
  const { routes, loading, error } = useSelector((state) => state.routes);
  const [matchingTrips, setMatchingTrips] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchRoutes());
  }, [dispatch]);
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

  //   const handleProductClick = (productId) => {
  //     navigate(`/products/${productId}`);
  //   };
  if (loading) return <div>Loading...</div>; // Hiển thị loading khi dữ liệu đang được tải
  if (error) return <div>Error: {error}</div>; // Hiển thị lỗi nếu có

  const bannerImages = [banner1, banner2, banner3];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    pauseOnFocus: true,
  };
  return (
    <MainLayout>
      <div className="homepage">
        {/* Banner */}
        <Slider {...settings}>
          {bannerImages.map((image, index) => {
            return (
              <div key={index}>
                <img
                  className="banner-image"
                  style={{ width: "100%", height: "600px", objectFit: "cover" }}
                  src={image}
                  alt={`Banner ${index + 1}`}
                />
              </div>
            );
          })}
        </Slider>
        <div className="banner">
          <h1>Chào mừng bạn đến với website</h1>
          <p className="lead">
            Chất lượng hàng đầu - Dịch vụ uy tín - Giá cả hợp lý
          </p>
        </div>

        {/* Featured Products */}

        <div className="content">
          <h2>Các tuyến phổ biến</h2>
          <h3>Được khách hàng tin tưởng và lựa chọn</h3>
          <div className="bus-container">
            <div className="buses">
              {routes.map((route) => (
                <div
                  className="bus-card"
                  key={route.routeId}
                  // onClick={() => handleProductClick(route.routeId)}
                >
                  <h5>{route.name}</h5>
                  <p>Điểm xuất phát: {route.startLocation}</p>
                  <p>Điểm kết thúc: {route.endLocation}</p>
                  <p>Khoảng cách: {route.distance}</p>
                  <p>Thời gian di chuyển dự kiến: {route.estimatedDuration}</p>

                  {/* <img src={bus.avatar || "https://via.placeholder.com/300x200"} alt={bus.busName} /> */}

                  {/* <p>{product.description}</p> */}
                  {/* <p>Giá: {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p> */}
                  <button
                    onClick={() =>
                      handleFind(route.startLocation, route.endLocation)
                    }
                  >
                    Tìm chuyến xe phù hợp
                  </button>
                </div>
              ))}
            </div>
          </div>
          {matchingTrips.length > 0 && (
            <div className="matching-trips">
              <h1 style={{ marginTop: "25px" }}>Danh sách chuyến xe phù hợp</h1>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên chuyến</th>
                    <th>Điểm bắt đầu</th>
                    <th>Điểm kết thúc</th>
                    <th>Thời gian xuất phát</th>
                    <th>Thời gian đến</th>
                    <th>Giá vé</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {matchingTrips.map((trip) => (
                    <tr key={trip.tripId}>
                      <td>{trip.tripId}</td>
                      <td>{trip.tripName}</td>
                      <td>{trip.routeId.startLocation}</td>
                      <td>{trip.routeId.endLocation}</td>
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

                      <td>
                        <button
                        // onClick={() =>
                        //   handleFind(route.startLocation, route.endLocation)
                        // }
                        >
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

        {/* About Section */}
        {/* <div className="about">
          <h2>Về chúng tôi</h2>
          <p>
            Chúng tôi cung cấp các sản phẩm tổ yến chất lượng cao, mang lại sức khỏe và giá trị tốt nhất
            cho khách hàng. Cam kết 100% sản phẩm tự nhiên, không chất bảo quản.
          </p>
        </div> */}
      </div>
    </MainLayout>
  );
};

export default HomePage;
