import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './GenreManage.module.scss';
import icons from '~/assets/icons';
import LimitedList from '~/components/Components/LimitedList';

import { apiGetGenres, apiCreateGenre, apiUpdateGenre, apiDeleteGenre } from '~/api/services/serviceGenres';

const cx = classNames.bind(styles);

function GenreManage() {
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');

  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [selectedGenre, setSelectedGenre] = useState(null);

  const [form, setForm] = useState({
    name: '',
  });

  // ===== FETCH =====
  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const res = await apiGetGenres();
      setGenres(res);
    } catch (e) {
      console.error(e);
    }
  };

  // ===== FILTER =====
  const filteredGenres = useMemo(() => {
    return genres.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));
  }, [genres, search]);

  // ===== FORM =====
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: '' });
  };

  // ===== CREATE =====
  const handleCreate = async () => {
    try {
      await apiCreateGenre({
        name: form.name,
      });

      setModalCreate(false);
      resetForm();
      fetchGenres();
    } catch (e) {
      alert(e.message);
    }
  };

  // ===== UPDATE =====
  const handleOpenUpdate = genre => {
    setSelectedGenre(genre);
    setForm({ name: genre.name });
    setModalUpdate(true);
  };

  const handleUpdate = async () => {
    try {
      await apiUpdateGenre(selectedGenre.id, {
        name: form.name,
      });

      setModalUpdate(false);
      resetForm();
      fetchGenres();
    } catch (e) {
      alert(e.message);
    }
  };

  // ===== DELETE =====
  const handleOpenDelete = genre => {
    setSelectedGenre(genre);
    setModalDelete(true);
  };

  const handleDelete = async () => {
    try {
      await apiDeleteGenre(selectedGenre.id);
      setModalDelete(false);
      fetchGenres();
    } catch (e) {
      alert(e.message);
    }
  };

  // ===== RENDER ITEM =====
  const renderGenre = genre => (
    <div key={genre.id} className={cx('item')}>
      <div className={cx('left')}>
        <div className={cx('name')}>{genre.name}</div>
      </div>

      <div className={cx('right')}>
        <button className="btn btn-sm btn-warning" onClick={() => handleOpenUpdate(genre)}>
          <i className="fas fa-edit"></i>
        </button>

        <button className="btn btn-sm btn-danger" onClick={() => handleOpenDelete(genre)}>
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );

  return (
    <div className={cx('wrapper')}>
      {/* HEADER */}
      <div className={cx('header')}>
        <h3>
          <i className={icons.iconMusic}></i> Quản lý thể loại
        </h3>

        <button className="btn btn-primary" onClick={() => setModalCreate(true)}>
          Thêm thể loại
        </button>
      </div>

      {/* SEARCH */}
      <div className={cx('toolbar')}>
        <input placeholder="Tìm thể loại..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* LIST */}
      <div className={cx('list')}>
        <LimitedList items={filteredGenres} renderItem={renderGenre} />
      </div>

      {/* ===== CREATE ===== */}
      {modalCreate && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Thêm thể loại</h4>

            <input name="name" placeholder="Tên thể loại" onChange={handleChange} />

            <div className={cx('modal-actions')}>
              <button className="btn btn-secondary" onClick={() => setModalCreate(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleCreate}>
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== UPDATE ===== */}
      {modalUpdate && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Cập nhật thể loại</h4>

            <input name="name" value={form.name} onChange={handleChange} />

            <div className={cx('modal-actions')}>
              <button className="btn btn-secondary" onClick={() => setModalUpdate(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE ===== */}
      {modalDelete && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Bạn có chắc muốn xóa?</h4>

            <div className={cx('modal-actions')}>
              <button className="btn btn-danger" onClick={handleDelete}>
                Xóa
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

export default GenreManage;
