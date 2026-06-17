import React, { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './VoucherManage.module.scss';
import icons from '~/assets/icons';
import LimitedList from '~/components/Components/LimitedList';

import {
  apiGetAllVouchers,
  apiCreateVoucher,
  apiUpdateVoucher,
  apiDeleteVoucher,
} from '~/api/services/serviceVouchers';

const cx = classNames.bind(styles);

function VoucherManage() {
  const [vouchers, setVouchers] = useState([]);
  const [filterActive, setFilterActive] = useState('all');
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [form, setForm] = useState({
    quantity: '',
    discountPercentage: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: '',
  });

  const formatToBackendDate = dateStr => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const res = await apiGetAllVouchers();
      const data = res?.data || res || [];
      setVouchers(data);
    } catch (error) {
      console.error('Lỗi fetch voucher:', error);
    }
  };

  // ===== FILTER LOGIC =====
  const filteredVouchers = useMemo(() => {
    const now = new Date();

    return vouchers.filter(v => {
      const start = v.startDate ? new Date(v.startDate) : null;
      const end = v.endDate ? new Date(v.endDate) : null;
      const isActive = start && end && now >= start && now <= end;

      if (filterActive === 'true') return isActive;
      if (filterActive === 'false') return !isActive;
      return true;
    });
  }, [vouchers, filterActive]);

  const formatDate = date => (date ? new Date(date).toLocaleDateString('vi-VN') : '---');

  // ===== FORM HANDLERS =====
  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm({
      quantity: '',
      discountPercentage: '',
      maxDiscountAmount: '',
      startDate: '',
      endDate: '',
    });
  };

  // ===== ACTIONS =====
  const handleCreate = async () => {
    const requestData = {
      ...form,
      startDate: formatToBackendDate(form.startDate),
      endDate: formatToBackendDate(form.endDate),
      active: true,
    };

    try {
      await apiCreateVoucher(requestData);
      setModalCreate(false);
      resetForm();
      fetchVouchers();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleOpenUpdate = voucher => {
    setSelectedVoucher(voucher);
    setForm({
      quantity: voucher.quantity || '',
      discountPercentage: voucher.discountPercentage || '',
      maxDiscountAmount: voucher.maxDiscountAmount || '',
      startDate: voucher.startDate?.split('T')[0] || '',
      endDate: voucher.endDate?.split('T')[0] || '',
    });
    setModalUpdate(true);
  };

  const handleUpdate = async () => {
    const requestData = {
      ...form,
      startDate: formatToBackendDate(form.startDate),
      endDate: formatToBackendDate(form.endDate),
      active: selectedVoucher.active,
    };

    try {
      await apiUpdateVoucher(selectedVoucher.id, requestData);
      setModalUpdate(false);
      resetForm();
      fetchVouchers();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleOpenDelete = voucher => {
    setSelectedVoucher(voucher);
    setModalDelete(true);
  };

  const handleDelete = async () => {
    try {
      await apiDeleteVoucher(selectedVoucher.id);
      setModalDelete(false);
      fetchVouchers();
    } catch (e) {
      alert(e.message);
    }
  };

  // ===== RENDER ITEM =====
  const renderVoucher = voucher => {
    const now = new Date();
    const isActive = new Date(voucher.startDate) <= now && new Date(voucher.endDate) >= now;

    return (
      <div key={voucher.id} className={cx('song-item')}>
        <div className={cx('song-left')}>
          <div
            className={cx('cover')}
            style={{ background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className={icons.iconVoucher} style={{ fontSize: '20px' }}></i>
          </div>
          <div>
            <div className={cx('song-name')}>
              <span className={cx('status-badge', isActive ? 'active' : 'expired')}>
                {isActive ? 'Hoạt động' : 'Không hoạt động/Hết hạn'}
              </span>
            </div>
            <div className={cx('song-sub')}>
              Giảm: {voucher.discountPercentage}% • Tối đa: {voucher.maxDiscountAmount}đ • Còn lại: {voucher.quantity}
            </div>
          </div>
        </div>
        <div className={cx('song-right')}>
          <div className={cx('song-meta')}>
            <span className={cx('favorite')}>
              {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
            </span>
          </div>

          <div className={cx('artist-actions')}>
            <button className="btn btn-sm btn-warning" onClick={() => handleOpenUpdate(voucher)}>
              <i className="fas fa-edit"></i>
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => handleOpenDelete(voucher)}>
              <i className="fas fa-trash"></i>
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
          <i className={icons.iconVoucher}></i> Quản lý Voucher
        </h3>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setModalCreate(true);
          }}
        >
          Thêm Voucher
        </button>
      </div>

      <div className={cx('toolbar')}>
        <select value={filterActive} onChange={e => setFilterActive(e.target.value)} className={cx('filter-select')}>
          <option value="all">Tất cả trạng thái</option>
          <option value="true">Đang hoạt động (Active)</option>
          <option value="false">Không hoạt động (Inactive)</option>
        </select>
      </div>

      <div className={cx('list')}>
        <LimitedList items={filteredVouchers} renderItem={renderVoucher} />
      </div>

      {/* MODAL CREATE */}
      {modalCreate && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Thêm Voucher mới</h4>
            <input name="quantity" type="number" placeholder="Số lượng" onChange={handleChange} />
            <input name="discountPercentage" type="number" placeholder="% Giảm giá" onChange={handleChange} />
            <input name="maxDiscountAmount" type="number" placeholder="Giảm giá tối đa" onChange={handleChange} />
            <label>Ngày bắt đầu:</label>
            <input name="startDate" type="date" onChange={handleChange} />
            <label>Ngày kết thúc:</label>
            <input name="endDate" type="date" onChange={handleChange} />

            <div className={cx('modal-actions')}>
              <button className="btn btn-secondary" onClick={() => setModalCreate(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleCreate}>
                Tạo mã
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL UPDATE */}
      {modalUpdate && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Cập nhật Voucher</h4>
            <label>Số lượng:</label>
            <input name="quantity" type="number" value={form.quantity} onChange={handleChange} />
            <label>% Giảm giá:</label>
            <input name="discountPercentage" type="number" value={form.discountPercentage} onChange={handleChange} />
            <label>Giảm giá tối đa:</label>
            <input name="maxDiscountAmount" type="number" value={form.maxDiscountAmount} onChange={handleChange} />
            <label>Ngày bắt đầu:</label>
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
            <label>Ngày kết thúc:</label>
            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} />

            <div className={cx('modal-actions')}>
              <button className="btn btn-secondary" onClick={() => setModalUpdate(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {modalDelete && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Xác nhận xóa Voucher?</h4>
            <div className={cx('modal-actions')}>
              <button className="btn btn-danger" onClick={handleDelete}>
                Xóa ngay
              </button>
              <button className="btn btn-secondary" onClick={() => setModalDelete(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoucherManage;
