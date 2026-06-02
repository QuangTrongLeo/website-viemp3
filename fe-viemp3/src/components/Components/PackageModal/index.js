import React, { useEffect, useState } from 'react';
import styles from './PackageModal.module.scss';
import classNames from 'classnames/bind';
import { apiGetAvailableVouchers } from '~/api/services/serviceVouchers';
import { apiCreateOrder } from '~/api/services/serviceOrders';
import { apiCreatePaymentUrl } from '~/api/services/servicePayments';

const cx = classNames.bind(styles);

function PackageModal({ show, onClose, data }) {
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      const fetchVouchers = async () => {
        setLoading(true);
        try {
          const res = await apiGetAvailableVouchers();
          console.log(res);
          if (res) {
            const validVouchers = res.filter(v => v.quantity > 0 && v.active);
            setVouchers(validVouchers);
          }
        } catch (error) {
          console.error('Lỗi lấy voucher:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchVouchers();
    } else {
      setSelectedVoucher(null);
    }
  }, [show]);

  if (!show || !data) return null;

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const parsePrice = priceStr => {
    if (typeof priceStr === 'number') return priceStr;
    return Number(priceStr.replace(/[^0-9]/g, ''));
  };

  const handleSelectVoucher = e => {
    const voucherId = e.target.value;
    const voucher = vouchers.find(v => v.id === voucherId);
    setSelectedVoucher(voucher || null);
  };

  const originalPrice = parsePrice(data.price);
  let discountAmount = 0;

  if (selectedVoucher) {
    discountAmount = (originalPrice * selectedVoucher.discountPercentage) / 100;
    if (discountAmount > selectedVoucher.maxDiscountAmount) {
      discountAmount = selectedVoucher.maxDiscountAmount;
    }
  }

  const finalAmount = originalPrice - discountAmount;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const orderPayload = {
        packageId: data.id,
        voucherId: selectedVoucher ? selectedVoucher.id : null,
        totalPrice: finalAmount,
      };

      const orderRes = await apiCreateOrder(orderPayload);
      if (orderRes && orderRes.id) {
        const resData = await apiCreatePaymentUrl(orderRes.id);
        if (resData && resData.paymentUrl) {
          window.location.href = resData.paymentUrl;
        } else {
          console.error('Không lấy được URL thanh toán từ phản hồi');
        }
      }
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={cx('backdrop')} onClick={onClose}></div>

      <div className={cx('modal', 'fade', 'show', 'modalWrapper')} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className={cx('modal-content', 'modalContent')}>
            <div className={cx('modal-header', 'header')}>
              <h5 className={cx('modal-title', 'title')}>Xác nhận đăng ký</h5>
              <button type="button" className="btn-close btn-close-white shadow-none" onClick={onClose}></button>
            </div>

            <div className={cx('modal-body', 'body')}>
              <p className={cx('label')}>Gói dịch vụ:</p>
              <h4 className={cx('planHighlight')}>{data.planName}</h4>

              <div className={cx('infoBox')}>
                <div className={cx('infoRow')}>
                  <span>Thời hạn</span>
                  <strong>{data.duration}</strong>
                </div>
                <div className={cx('infoRow')}>
                  <span>Giá gốc</span>
                  <strong className={selectedVoucher ? cx('priceStrikethrough') : ''}>
                    {originalPrice.toLocaleString('vi-VN')}đ
                  </strong>
                </div>

                {selectedVoucher && (
                  <>
                    <div className={cx('infoRow', 'discountText')}>
                      <span>Giảm giá ({selectedVoucher.discountPercentage}%)</span>
                      <strong>-{discountAmount.toLocaleString('vi-VN')}đ</strong>
                    </div>
                    {/* Hiển thị lưu ý nếu chạm mức giảm tối đa */}
                    {(originalPrice * selectedVoucher.discountPercentage) / 100 > selectedVoucher.maxDiscountAmount && (
                      <small className={cx('maxDiscountNote')}>
                        (Đã áp dụng mức giảm tối đa {selectedVoucher.maxDiscountAmount.toLocaleString('vi-VN')}đ)
                      </small>
                    )}
                  </>
                )}

                <div className={cx('divider')}></div>
                <div className={cx('infoRow', 'totalRow')}>
                  <span>Tổng thanh toán</span>
                  <span className={cx('finalPrice')}>{finalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className={cx('voucherSection')}>
                <label className={cx('label')}>Mã giảm giá khả dụng</label>
                <select className={cx('voucherSelect')} onChange={handleSelectVoucher} defaultValue="">
                  <option value="">Không sử dụng voucher</option>
                  {vouchers.map(v => (
                    <option key={v.id} value={v.id}>
                      Giảm {v.discountPercentage}% (Tối đa {v.maxDiscountAmount.toLocaleString('vi-VN')}đ)
                    </option>
                  ))}
                </select>

                {selectedVoucher && (
                  <div className={cx('voucherCard')}>
                    <div className={cx('cardLeft')}>
                      <div className={cx('percent')}>{selectedVoucher.discountPercentage}%</div>
                      <div className={cx('off')}>OFF</div>
                    </div>
                    <div className={cx('cardRight')}>
                      <p className={cx('vTitle')}>ƯU ĐÃI ĐĂNG KÝ</p>
                      <p className={cx('vLimit')}>
                        Tối đa: {selectedVoucher.maxDiscountAmount.toLocaleString('vi-VN')}đ
                      </p>
                      <p className={cx('vDate')}>
                        Hạn: {formatDate(selectedVoucher.startDate)} - {formatDate(selectedVoucher.endDate)}
                      </p>
                      <div className={cx('vStock')}>Còn lại: {selectedVoucher.quantity} lượt</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={cx('modal-footer', 'footer')}>
              <button type="button" className={cx('btnCancel')} onClick={onClose}>
                Hủy
              </button>
              <button type="button" className={cx('btnConfirm')} onClick={handlePayment} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Thanh toán ngay'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PackageModal;
