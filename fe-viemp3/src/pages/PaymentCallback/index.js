import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import config from '~/config';
import { apiGetPaymentCallback } from '~/api/services/servicePayments';
import styles from './PaymentCallback.module.scss';

const cx = classNames.bind(styles);

function PaymentCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const isCalled = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const queryParams = Object.fromEntries(new URLSearchParams(location.search));
      if (!queryParams.vnp_ResponseCode) {
        setStatus('fail');
        return;
      }
      if (isCalled.current) return;
      isCalled.current = true;

      try {
        const res = await apiGetPaymentCallback(queryParams);
        if (res && res.success) {
          setStatus('success');
        } else {
          setStatus('fail');
        }
      } catch (error) {
        console.error('Lỗi xác thực thanh toán:', error);
        setStatus('fail');
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div className={cx('wrapper')}>
      {status === 'processing' && (
        <div className={cx('processing')}>
          <h2>Đang xác thực giao dịch...</h2>
          <p>Vui lòng không đóng trình duyệt.</p>
        </div>
      )}

      {status === 'success' && (
        <div className={cx('success')}>
          <div className={cx('icon')}>✅</div>
          <h2>Thanh toán thành công!</h2>
          <p>
            Tài khoản của bạn đã được nâng cấp <strong>PREMIUM</strong>.
          </p>
          <button onClick={() => navigate(config.routes.order)} className={cx('btn', 'btn-primary')}>
            Đơn hàng của bạn
          </button>
        </div>
      )}

      {status === 'fail' && (
        <div className={cx('fail')}>
          <div className={cx('icon')}>❌</div>
          <h2>Thanh toán thất bại</h2>
          <p>Giao dịch đã bị hủy hoặc mã xác thực không hợp lệ.</p>
          <button onClick={() => navigate(config.routes.home)} className={cx('btn', 'btn-danger')}>
            Quay lại trang chủ
          </button>
        </div>
      )}
    </div>
  );
}

export default PaymentCallback;
