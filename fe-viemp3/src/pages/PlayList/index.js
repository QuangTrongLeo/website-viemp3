import React, { useEffect, useState } from 'react';
import { CreateCard, SquareCard } from '~/components/Components/Card';
import icons from '~/assets/icons';
import styles from './PlayList.module.scss';
import classNames from 'classnames/bind';
import LimitedList from '~/components/Components/LimitedList';
import { apiGetMyPlaylists, apiCreatePlaylist } from '~/api/services/servicePlaylists';

const cx = classNames.bind(styles);

function PlayList() {
  const [isOpen, setIsOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [coverFile, setCoverFile] = useState(null);

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== GET MY PLAYLISTS =====
  const handleGetMyPlaylists = async () => {
    try {
      const data = await apiGetMyPlaylists();
      setPlaylists(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy playlist:', error);
      setPlaylists([]);
    }
  };

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await handleGetMyPlaylists();
      setLoading(false);
    };

    fetchData();
  }, []);

  // ===== SORT PLAYLISTS (NEWEST FIRST) =====
  const sortedPlaylists = [...playlists].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // ===== HANDLE IMAGE CHANGE =====
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!playlistName.trim()) {
        alert('Vui lòng nhập tên playlist');
        return;
      }

      const newPlaylist = await apiCreatePlaylist(playlistName, coverFile);

      // thêm playlist mới vào danh sách
      setPlaylists(prev => [newPlaylist, ...prev]);

      // reset form
      setIsOpen(false);
      setPlaylistName('');
      setCoverFile(null);
      setCoverPreview('');
    } catch (error) {
      console.error('Tạo playlist thất bại:', error);
      alert(error.message);
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className={cx('playlist-wrapper')}>
        <h1 className="text-center">
          <i className={icons.iconList}></i>
          <span style={{ paddingLeft: '10px' }}>PlayList</span>
        </h1>

        <CreateCard content="Tạo playlist mới" onClick={() => setIsOpen(true)} />

        <section className={cx('section-block')}>
          <h3>Playlist của bạn</h3>

          {loading ? (
            <p>Đang tải playlist...</p>
          ) : sortedPlaylists.length > 0 ? (
            <LimitedList
              items={sortedPlaylists}
              limit={8}
              renderItem={playlist => (
                <div key={playlist.id} className="col-6 col-sm-4 col-lg-3 mb-3 d-flex justify-content-center">
                  <SquareCard
                    content={playlist.name}
                    cover={playlist.cover}
                    href={`/playlist/${playlist.id}`}
                    icon={<i className="fas fa-list fa-3x"></i>}
                  />
                </div>
              )}
            />
          ) : (
            <p>Bạn chưa có playlist nào</p>
          )}
        </section>
      </div>

      {isOpen && (
        <div className={cx('modal-overlay')}>
          <div className={cx('modal')}>
            <h4 className="text-center mb-3">Tạo Playlist mới</h4>

            <div className="text-center mb-3">
              <label htmlFor="coverInput" style={{ cursor: 'pointer' }}>
                {coverPreview ? (
                  <img src={coverPreview} alt="Preview" className={cx('preview-img')} />
                ) : (
                  <div className={cx('preview-placeholder')}>
                    <i className="fas fa-image fa-2x"></i>
                    <p>Chọn ảnh bìa</p>
                  </div>
                )}
              </label>

              <input type="file" id="coverInput" accept="image/*" hidden onChange={handleImageChange} />
            </div>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Nhập tên playlist"
              value={playlistName}
              onChange={e => setPlaylistName(e.target.value)}
            />

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Hủy
              </button>
              <button className={cx('custom-btn')} onClick={handleSubmit}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PlayList;
