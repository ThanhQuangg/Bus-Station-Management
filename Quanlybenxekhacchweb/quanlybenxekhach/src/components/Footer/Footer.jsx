import React from "react";
import '../../styles/Footer.scss';

const Footer = () => (
  <footer className="footer bg-dark text-white py-5">
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <h5 className="footer-title">Quản Lý Bến Xe Khách</h5>
          <p className="footer-description">
            Hệ thống quản lý bến xe khách giúp kết nối, hỗ trợ các nhà xe và hành khách một cách nhanh chóng và hiệu quả.
          </p>
        </div>
        <div className="col-md-4">
          <h5 className="footer-title">Liên Kết Nhanh</h5>
          <ul className="footer-links list-unstyled">
            <li><a href="/" className="text-white text-decoration-none">Trang Chủ</a></li>
            <li><a href="/schedule" className="text-white text-decoration-none">Đặt Vé</a></li>
          </ul>
          <div className="text-center mt-4">
            <p className="mb-0">&copy; 2024 Quản Lý Bến Xe Khách. All rights reserved.</p>
          </div>
        </div>
        <div className="col-md-4">
          <h5 className="footer-title">Liên Hệ</h5>
          <p><i className="bi bi-telephone"></i> Hotline: 0987 654 321</p>
          <p><i className="bi bi-envelope"></i> Email: support@benxekhach.com</p>
          <p><i className="bi bi-geo-alt"></i> Địa chỉ: 123 Đường Quốc Lộ 1A, TP. Hồ Chí Minh</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
