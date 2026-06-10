import React, { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './PackageManage.module.scss';
import icons from '~/assets/icons';
import LimitedList from '~/components/Components/LimitedList';

import {
  apiGetPackages,
  apiCreatePackage,
  apiUpdatePackage,
  apiDeletePackage,
  apiGetPackageTypes,
  apiGetDurationTypes,
} from '~/api/services/servicePackages';

const cx = classNames.bind(styles);

function PackageManage() {
  const [packages, setPackages] = useState([]);
  const [types, setTypes] = useState([]);
  const [durations, setDurations] = useState([]);

  const [filterType, setFilterType] = useState('all');
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [form, setForm] = useState({
    type: '',
    duration: '',
    basePrice: '',
    discountPercent: '',
  });

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [resPkgs, resTypes, resDurations] = await Promise.all([
        apiGetPackages(),
        apiGetPackageTypes(),
        apiGetDurationTypes(),
      ]);
      setPackages(resPkgs || []);
      setTypes(resTypes || []);
      setDurations(resDurations || []);
    } catch (error) {
      console.error('Lỗi fetch dữ liệu:', error);
    }
  };

  const refreshPackages = async () => {
    try {
      const res = await apiGetPackages();
      setPackages(res || []);
    } catch (error) {
      console.error('Lỗi làm mới danh sách:', error);
    }
  };

  // ===== FILTER LOGIC =====
  const filteredPackages = useMemo(() => {
    return packages.filter(p => {
      if (filterType === 'all') return true;
      return p.packageType === filterType;
    });
  }, [packages, filterType]);

  // ===== FORM HANDLERS =====
  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm({
      type: types[0]?.value || '',
      duration: durations[0]?.value || '',
      basePrice: '',
      discountPercent: '',
    });
  };

  // ===== ACTIONS =====
  const handleCreate = async () => {
    try {
      await apiCreatePackage(form);
      setModalCreate(false);
      resetForm();
      refreshPackages();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleOpenUpdate = pkg => {
    setSelectedPackage(pkg);
    setForm({
      type: pkg.packageType,
      duration: pkg.duration,
      basePrice: pkg.basePrice,
      discountPercent: pkg.discountPercent,
    });
    setModalUpdate(true);
  };

  const handleUpdate = async () => {
    try {
      await apiUpdatePackage(selectedPackage.id, form);
      setModalUpdate(false);
      resetForm();
      refreshPackages();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleOpenDelete = pkg => {
    setSelectedPackage(pkg);
    setModalDelete(true);
  };

  const handleDelete = async () => {
    try {
      await apiDeletePackage(selectedPackage.id);
      setModalDelete(false);
      refreshPackages();
    } catch (e) {
      alert(e.message);
    }
  };

  // ===== RENDER ITEM =====
  const renderPackage = pkg => (
    <div key={pkg.id} className={cx('song-item')}>
      <div className={cx('song-left')}>
        <div className={cx('cover')}>
          <i className={icons.iconPackage}></i>
        </div>
        <div>
          <div className={cx('song-name')}>
            {pkg.packageType} - {pkg.duration}
          </div>
          <div className={cx('song-sub')}>
            Giá gốc: {pkg.basePrice?.toLocaleString()}đ • Giảm: {pkg.discountPercent}%
          </div>
        </div>
      </div>
      <div className={cx('song-right')}>
        <div className={cx('song-meta')}>
          <span className={cx('favorite')}>Giá cuối: {pkg.finalPrice?.toLocaleString()}đ</span>
          <span>Ngày tạo: {new Date(pkg.createdAt).toLocaleDateString('vi-VN')}</span>
        </div>

        <div className={cx('artist-actions')}>
          <button className="btn btn-sm btn-warning" onClick={() => handleOpenUpdate(pkg)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => handleOpenDelete(pkg)}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <h3>
          <i className={icons.iconPackage}></i> Quản lý Gói Premium
        </h3>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setModalCreate(true);
          }}
        >
          Thêm Gói mới
        </button>
      </div>

      <div className={cx('toolbar')}>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className={cx('filter-select')}>
          <option value="all">Tất cả loại gói</option>
          {types.map(t => (
            <option key={t.value} value={t.value}>
              {t.value}
            </option>
          ))}
        </select>
      </div>

      <div className={cx('list')}>
        <LimitedList items={filteredPackages} renderItem={renderPackage} />
      </div>

      {/* MODAL CREATE */}
      {modalCreate && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Tạo gói cước mới</h4>

            <label>Loại gói (Type):</label>
            <select name="type" value={form.type} onChange={handleChange}>
              {types.map(t => (
                <option key={t.value} value={t.value}>
                  {t.value}
                </option>
              ))}
            </select>

            <label>Thời hạn (Duration):</label>
            <select name="duration" value={form.duration} onChange={handleChange}>
              {durations.map(d => (
                <option key={d.value} value={d.value}>
                  {d.value}
                </option>
              ))}
            </select>

            <label>Giá gốc (Base Price):</label>
            <input name="basePrice" type="number" placeholder="Ví dụ: 20000" onChange={handleChange} />

            <label>% Giảm giá:</label>
            <input name="discountPercent" type="number" placeholder="Ví dụ: 10" onChange={handleChange} />

            <div className={cx('modal-actions')}>
              <button className="btn btn-secondary" onClick={() => setModalCreate(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleCreate}>
                Tạo gói
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL UPDATE */}
      {modalUpdate && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Cập nhật gói cước</h4>

            <label>Loại gói (Type):</label>
            <select name="type" value={form.type} onChange={handleChange}>
              {types.map(t => (
                <option key={t.value} value={t.value}>
                  {t.value}
                </option>
              ))}
            </select>

            <label>Thời hạn (Duration):</label>
            <select name="duration" value={form.duration} onChange={handleChange}>
              {durations.map(d => (
                <option key={d.value} value={d.value}>
                  {d.value}
                </option>
              ))}
            </select>

            <label>Giá gốc:</label>
            <input name="basePrice" type="number" value={form.basePrice} onChange={handleChange} />

            <label>% Giảm giá:</label>
            <input name="discountPercent" type="number" value={form.discountPercent} onChange={handleChange} />

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
            <h4>Xác nhận xóa gói cước này?</h4>
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

export default PackageManage;
