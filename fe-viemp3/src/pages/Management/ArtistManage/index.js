import React, { useState, useEffect, useMemo } from 'react';
import icons from '~/assets/icons';
import classNames from 'classnames/bind';
import styles from './ArtistManage.module.scss';
import LimitedList from '~/components/Components/LimitedList';

import { apiGetArtists, apiCreateArtist, apiUpdateArtist, apiDeleteArtist } from '~/api/services/serviceArtists';

import { apiGetSongsByArtist } from '~/api/services/serviceSongs';
import { apiGetAlbumsByArtist } from '~/api/services/serviceAlbums';

const cx = classNames.bind(styles);

function ArtistManage() {
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedArtist, setSelectedArtist] = useState(null);

  const [modalCreateArtist, setModalCreateArtist] = useState(false);
  const [modalUpdateArtist, setModalUpdateArtist] = useState(false);
  const [modalDeleteArtist, setModalDeleteArtist] = useState(false);

  const [artistName, setArtistName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchArtists();
  }, []);

  const formatDate = date => new Date(date).toLocaleDateString('vi-VN');

  const fetchArtists = async () => {
    try {
      setLoading(true);

      const artistRes = await apiGetArtists();

      const artistsWithStats = await Promise.all(
        artistRes.map(async artist => {
          const [songs, albums] = await Promise.all([apiGetSongsByArtist(artist.id), apiGetAlbumsByArtist(artist.id)]);

          return {
            ...artist,
            songs: songs.length,
            albums: albums.length,
          };
        })
      );

      setArtists(artistsWithStats);
    } catch (error) {
      console.error('Lỗi lấy nghệ sĩ:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtists = useMemo(() => {
    return artists
      .filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortType === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortType === 'songs') return b.songs - a.songs;
        if (sortType === 'albums') return b.albums - a.albums;
        return 0;
      });
  }, [artists, search, sortType]);

  // CREATE
  const handleCreateArtist = async () => {
    try {
      setCreating(true);

      await apiCreateArtist(artistName, avatarFile);

      setModalCreateArtist(false);
      setArtistName('');
      setAvatarFile(null);

      fetchArtists();
    } catch (error) {
      alert(error.message);
    } finally {
      setCreating(false);
    }
  };

  // UPDATE
  const handleOpenUpdate = artist => {
    setSelectedArtist(artist);
    setArtistName(artist.name);
    setAvatarFile(null);
    setModalUpdateArtist(true);
  };

  const handleUpdateArtist = async () => {
    try {
      setUpdating(true);

      await apiUpdateArtist(selectedArtist.id, artistName, avatarFile);

      setModalUpdateArtist(false);
      fetchArtists();
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // DELETE
  const handleOpenDelete = artist => {
    setSelectedArtist(artist);
    setModalDeleteArtist(true);
  };

  const handleDeleteArtist = async () => {
    try {
      await apiDeleteArtist(selectedArtist.id);

      setModalDeleteArtist(false);
      fetchArtists();
    } catch (error) {
      alert(error.message);
    }
  };

  const renderArtist = artist => (
    <div key={artist.id} className={cx('artist-row')}>
      <div className={cx('artist-info')}>
        <img src={artist.avatar} alt={artist.name} className={cx('artist-avatar')} />

        <div>
          <div className={cx('artist-name')}>{artist.name}</div>

          <small className="text-muted">
            {artist.songs} bài hát • {artist.albums} album
          </small>
        </div>
      </div>

      <div className={cx('artist-date')}>{formatDate(artist.createdAt)}</div>

      <div className={cx('artist-actions')}>
        <button className="btn btn-sm btn-warning" onClick={() => handleOpenUpdate(artist)}>
          <i className="fas fa-edit"></i>
        </button>

        <button className="btn btn-sm btn-danger" onClick={() => handleOpenDelete(artist)}>
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );

  return (
    <div className="container-fluid p-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className={icons.iconStar}></i> Quản lý nghệ sĩ
        </h3>

        <button className="btn btn-primary" onClick={() => setModalCreateArtist(true)}>
          Thêm nghệ sĩ
        </button>
      </div>

      {/* SEARCH */}
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Tìm kiếm nghệ sĩ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select className="form-select" value={sortType} onChange={e => setSortType(e.target.value)}>
            <option value="">Sắp xếp theo</option>
            <option value="newest">Mới nhất</option>
            <option value="songs">Nhiều bài hát nhất</option>
            <option value="albums">Nhiều album nhất</option>
          </select>
        </div>
      </div>

      {/* HEADER TABLE */}
      <div className={cx('artist-header')}>
        <div>Nghệ sĩ</div>
        <div>Ngày tạo</div>
        <div className="text-end">Hành động</div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-center py-4">
          <span className="text-muted">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <LimitedList
          items={filteredArtists}
          renderItem={renderArtist}
          limit={8}
          showAllText="Hiện tất cả nghệ sĩ"
          showLessText="Ẩn bớt"
          wrapInRow={false}
        />
      )}

      {/* CREATE MODAL */}
      {modalCreateArtist && (
        <div className={cx('modal-backdrop')}>
          <div className={cx('modal-container')}>
            <div className={cx('modal-header')}>
              <h5>Thêm nghệ sĩ</h5>

              <button className="btn-close" onClick={() => setModalCreateArtist(false)} />
            </div>

            <div className={cx('modal-body')}>
              <label className="form-label">Tên nghệ sĩ</label>

              <input className="form-control mb-3" value={artistName} onChange={e => setArtistName(e.target.value)} />

              <label className="form-label">Ảnh đại diện</label>

              <input type="file" className="form-control" onChange={e => setAvatarFile(e.target.files[0])} />
            </div>

            <div className={cx('modal-footer')}>
              <button className="btn btn-secondary" onClick={() => setModalCreateArtist(false)}>
                Đóng
              </button>

              <button
                className="btn btn-primary"
                disabled={!artistName.trim() || creating}
                onClick={handleCreateArtist}
              >
                {creating ? 'Đang tạo...' : 'Tạo nghệ sĩ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE MODAL */}
      {modalUpdateArtist && (
        <div className={cx('modal-backdrop')}>
          <div className={cx('modal-container')}>
            <div className={cx('modal-header')}>
              <h5>Cập nhật nghệ sĩ</h5>

              <button className="btn-close" onClick={() => setModalUpdateArtist(false)} />
            </div>

            <div className={cx('modal-body')}>
              <label className="form-label">Tên nghệ sĩ</label>

              <input className="form-control mb-3" value={artistName} onChange={e => setArtistName(e.target.value)} />

              <label className="form-label">Ảnh đại diện</label>

              <input type="file" className="form-control" onChange={e => setAvatarFile(e.target.files[0])} />
            </div>

            <div className={cx('modal-footer')}>
              <button className="btn btn-secondary" onClick={() => setModalUpdateArtist(false)}>
                Hủy
              </button>

              <button className="btn btn-warning" disabled={updating} onClick={handleUpdateArtist}>
                {updating ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {modalDeleteArtist && selectedArtist && (
        <div className={cx('modal-backdrop')}>
          <div className={cx('modal-container')}>
            <div className={cx('modal-header')}>
              <h5>Xác nhận xóa</h5>

              <button className="btn-close" onClick={() => setModalDeleteArtist(false)} />
            </div>

            <div className={cx('modal-body')}>
              Bạn có chắc muốn xóa nghệ sĩ <b>{selectedArtist.name}</b> ?
            </div>

            <div className={cx('modal-footer')}>
              <button className="btn btn-secondary" onClick={() => setModalDeleteArtist(false)}>
                Hủy
              </button>

              <button className="btn btn-danger" onClick={handleDeleteArtist}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtistManage;
