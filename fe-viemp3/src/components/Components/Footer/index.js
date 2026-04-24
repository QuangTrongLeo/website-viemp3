import React from 'react';
import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import config from '~/config';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Footer() {
  return (
    <footer className={cx('footer', 'text-white', 'pt-5', 'pb-4', 'text-center', 'text-md-start')}>
      <div className="container">
        <hr className="border-secondary" />

        <div className="row row-cols-1 row-cols-md-4 row-cols-sm-2 g-4">
          <div>
            <h5 className="fw-bold">Công ty</h5>
            <ul className="list-unstyled">
              <li>
                <Link to={config.routes.home}>Giới thiệu</Link>
              </li>
              <li>
                <Link to={config.routes.home}>Việc làm</Link>
              </li>
              <li>
                <Link to={config.routes.home}>For the Record</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="fw-bold">Cộng đồng</h5>
            <ul className="list-unstyled">
              <li>
                <Link to={config.routes.home}>Dành cho các Nghệ sĩ</Link>
              </li>
              <li>
                <Link to={config.routes.home}>Nhà phát triển</Link>
              </li>
              <li>
                <Link to={config.routes.home}>Quảng cáo</Link>
              </li>
              <li>
                <Link to={config.routes.home}>Nhà đầu tư</Link>
              </li>
              <li>
                <Link to={config.routes.home}>Nhà cung cấp</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="fw-bold">Liên kết hữu ích</h5>
            <ul className="list-unstyled">
              <li>
                <Link to={config.routes.home}>Hỗ trợ</Link>
              </li>
              <li>
                <Link to={config.routes.home}>Ứng dụng Di động Miễn phí</Link>
              </li>
              <li>
                <Link to={config.routes.home}>Phổ biến theo quốc gia</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="fw-bold">Các gói của VieMp3</h5>
            <ul className="list-unstyled">
              <li>
                <Link to={config.routes.home}>Premium Individual</Link>
              </li>
              <li>
                <Link to={config.routes.home}>Premium Student</Link>
              </li>
              <li>
                <Link to={config.routes.home}>VieMp3 Free</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-3 my-4">
          <Link to={config.routes.home}>
            <i className="fab fa-instagram fs-4"></i>
          </Link>
          <Link to={config.routes.home}>
            <i className="fab fa-twitter fs-4"></i>
          </Link>
          <Link to={config.routes.home}>
            <i className="fab fa-facebook fs-4"></i>
          </Link>
        </div>

        <hr className="border-secondary" />

        <div className="d-flex flex-wrap justify-content-between text-secondary small">
          <div className="d-flex flex-wrap gap-3">
            <Link to={config.routes.home}>Pháp lý</Link>
            <Link to={config.routes.home}>Trung tâm an toàn và quyền riêng tư</Link>
            <Link to={config.routes.home}>Chính sách quyền riêng tư</Link>
            <Link to={config.routes.home}>Cookie</Link>
            <Link to={config.routes.home}>Giới thiệu Quảng cáo</Link>
            <Link to={config.routes.home}>Hỗ trợ tiếp cận</Link>
          </div>
          <div>© 2026 VieMp3</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
