import React, { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Order.module.scss';
import icons from '~/assets/icons';
import { images } from '~/assets';
import LimitedList from '~/components/Components/LimitedList';
import { apiGetMyOrders, apiGetOrderById } from '~/api/services/serviceOrders';

const cx = classNames.bind(styles);

function Order() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalDetail, setModalDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await apiGetMyOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Lỗi fetch order:', error);
    }
  };

  // ===== FILTER LOGIC =====
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (filterStatus === 'all') return true;
      return order.status === filterStatus;
    });
  }, [orders, filterStatus]);

  // ===== FORMATTERS =====
  const formatDate = date => (date ? new Date(date).toLocaleString('vi-VN') : '---');
  const formatPrice = amount => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const getStatusLabel = status => {
    switch (status) {
      case 'COMPLETED':
        return 'Thành công';
      case 'PENDING':
        return 'Đang chờ';
      case 'FAILED':
        return 'Thất bại';
      case 'EXPIRED':
        return 'Hết hạn';
      default:
        return status;
    }
  };

  // ===== ACTIONS =====
  const handleOpenDetail = async orderId => {
    setModalDetail(true);
    setLoadingDetail(true);
    try {
      const data = await apiGetOrderById(orderId);
      setSelectedOrder(data);
    } catch (error) {
      console.error('Lỗi lấy chi tiết:', error);
      setModalDetail(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  // ===== RENDER ITEM =====
  const renderOrder = order => {
    return (
      <div key={order.id} className={cx('song-item')}>
        <div className={cx('song-left')}>
          <div className={cx('cover')}>
            <i className={icons.iconOrder}></i>
          </div>
          <div>
            <div className={cx('song-name')}>
              Mã: {order.vnpTxnRef || 'N/A'}
              <span className={cx('status-badge', order.status.toLowerCase())}>{getStatusLabel(order.status)}</span>
            </div>
            <div className={cx('song-sub')}>
              Gói: {order.pkg?.packageType} • {formatPrice(order.totalPrice)}
            </div>
          </div>
        </div>
        <div className={cx('song-right')}>
          <div className={cx('song-meta')}>
            <span className={cx('user-info')}>{order.user?.username || 'Khách'}</span>
            <span className={cx('date')}>{formatDate(order.orderDate)}</span>
          </div>

          <div className={cx('artist-actions')}>
            <button className="btn btn-sm btn-primary" onClick={() => handleOpenDetail(order.id)}>
              <i className="fas fa-eye"></i> Xem
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <h3>
          <i className={icons.iconOrder}></i> Giao dịch Đơn hàng PREMIUM
        </h3>
      </div>

      <div className={cx('toolbar')}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={cx('filter-select')}>
          <option value="all">Tất cả trạng thái</option>
          <option value="PENDING">Đang chờ</option>
          <option value="COMPLETED">Thành công</option>
          <option value="FAILED">Thất bại</option>
          <option value="EXPIRED">Hết hạn</option>
        </select>
      </div>

      <div className={cx('list')}>
        {filteredOrders.length > 0 ? (
          <LimitedList items={filteredOrders} renderItem={renderOrder} />
        ) : (
          <div className={cx('empty-state')}>
            <i className={icons.iconPackage}></i>
            <p>Bạn chưa có bất cứ giao dịch Đơn hàng nào</p>
          </div>
        )}
      </div>

      {/* MODAL CHI TIẾT */}
      {modalDetail && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-header')}>
              <h4>Thông tin chi tiết đơn hàng</h4>
              <button className={cx('close-btn')} onClick={() => setModalDetail(false)}>
                &times;
              </button>
            </div>
            <div className={cx('modal-body')}>
              {loadingDetail ? (
                <div className={cx('loading')}>Đang tải...</div>
              ) : selectedOrder ? (
                <div className={cx('detail-container')}>
                  {/* PHẦN NGƯỜI DÙNG */}
                  <div className={cx('section')}>
                    <label>
                      <i className={icons.iconUser}></i> Người thực hiện
                    </label>
                    <div className={cx('user-card')}>
                      <img src={selectedOrder.user?.avatar || images.avatarDefault} alt="avatar" />
                      <div className={cx('user-text')}>
                        <p>
                          <strong>{selectedOrder.user?.username}</strong>
                        </p>
                        <p>{selectedOrder.user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* PHẦN ĐƠN HÀNG */}
                  <div className={cx('section')}>
                    <label>
                      <i className="fas fa-info-circle"></i> Chi tiết giao dịch
                    </label>
                    <div className={cx('info-list')}>
                      <div className={cx('info-item')}>
                        <span>Mã giao dịch (VNPAY):</span>
                        <strong>{selectedOrder.vnpTxnRef}</strong>
                      </div>
                      <div className={cx('info-item')}>
                        <span>Trạng thái:</span>
                        <b className={cx('status-text', selectedOrder.status.toLowerCase())}>
                          {getStatusLabel(selectedOrder.status)}
                        </b>
                      </div>
                      <div className={cx('info-item')}>
                        <span>Gói đăng ký:</span>
                        <span>
                          {selectedOrder.pkg?.packageType} ({selectedOrder.pkg?.duration})
                        </span>
                      </div>
                      <div className={cx('info-item')}>
                        <span>Ngày thanh toán:</span>
                        <span>{formatDate(selectedOrder.orderDate)}</span>
                      </div>
                      <div className={cx('info-item')}>
                        <span>Hết hạn vào:</span>
                        <span>{formatDate(selectedOrder.expiryDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className={cx('total-box')}>
                    <span>Tổng thanh toán:</span>
                    <span className={cx('price-big')}>{formatPrice(selectedOrder.totalPrice)}</span>
                  </div>
                </div>
              ) : (
                <p>Không có dữ liệu hiển thị.</p>
              )}
            </div>
            <div className={cx('modal-footer')}>
              <button className="btn btn-secondary" onClick={() => setModalDetail(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
