import React, { useEffect, useState } from 'react';
import { CreateCard, SquareCard } from '~/components/Components/Card';
import { SongRow } from '~/components/Components/Row';
import HorizontalScroll from '~/components/Components/HorizontalScroll';
import styles from './Library.module.scss';
import icons from '~/assets/icons';
import classNames from 'classnames/bind';
import LimitedList from '~/components/Components/LimitedList';

import { apiGetMyFavoriteSongs } from '~/api/services/serviceSongs';
import { apiGetMyFavoriteAlbums } from '~/api/services/serviceAlbums';
import { apiGetMyPlaylists, apiCreatePlaylist } from '~/api/services/servicePlaylists';

const cx = classNames.bind(styles);

function Library() {
  const [activeTab, setActiveTab] = useState('songs');

  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [favoriteAlbums, setFavoriteAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const [loadingFavoriteSongs, setLoadingFavoriteSongs] = useState(true);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [coverFile, setCoverFile] = useState(null);

  // ================= PLAYLIST =================
  const handleGetMyPlaylists = async () => {
    try {
      const data = await apiGetMyPlaylists();
      setPlaylists(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy playlist:', error);
      setPlaylists([]);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  // ================= FAVORITE ALBUM =================
  const handleGetMyFavoriteAlbums = async () => {
    try {
      const data = await apiGetMyFavoriteAlbums();

      const sorted = [...data].sort((a, b) => new Date(b.favoritedAt) - new Date(a.favoritedAt));

      setFavoriteAlbums(sorted);
    } catch (error) {
      console.error('Lỗi khi lấy album yêu thích:', error);
    } finally {
      setLoadingAlbums(false);
    }
  };

  // ================= FAVORITE SONG =================
  const handleGetMyFavoriteSongs = async () => {
    try {
      const data = await apiGetMyFavoriteSongs();

      const sorted = [...data].sort((a, b) => new Date(b.favoritedAt) - new Date(a.favoritedAt));

      setFavoriteSongs(sorted);
    } catch (error) {
      console.error('Lỗi khi lấy bài hát yêu thích:', error);
    } finally {
      setLoadingFavoriteSongs(false);
    }
  };

  // ================= LOAD =================
  useEffect(() => {
    handleGetMyPlaylists();
    handleGetMyFavoriteAlbums();
    handleGetMyFavoriteSongs();
  }, []);

  // ================= CREATE PLAYLIST =================
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
      setPlaylists(prev => [newPlaylist, ...prev]);

      setIsOpen(false);
      setPlaylistName('');
      setCoverFile(null);
      setCoverPreview('');
    } catch (error) {
      console.error('Tạo playlist thất bại:', error);
      alert(error.message);
    }
  };

  const handleCloseModal = () => setIsOpen(false);

  // ================= RENDER SONG =================
  const renderSongItem = item => {
    return <SongRow key={item.song.id} song={item.song} />;
  };

  const sortedPlaylists = [...playlists].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <h1 className="text-center">
        <i className={icons.iconBook}></i>
        <span style={{ paddingLeft: '10px' }}>Thư viện</span>
      </h1>

      {/* ================= PLAYLIST ================= */}
      <section className={cx('section-block')}>
        <h3>Playlist của bạn</h3>

        <div className="mb-3">
          <CreateCard content="Tạo playlist mới" onClick={() => setIsOpen(true)} />
        </div>

        {loadingPlaylists ? (
          <p>Đang tải playlist...</p>
        ) : sortedPlaylists.length > 0 ? (
          <HorizontalScroll>
            {sortedPlaylists.map(playlist => (
              <SquareCard
                key={playlist.id}
                content={playlist.name}
                cover={playlist.cover}
                href={`/playlist/${playlist.id}`}
                icon={<i className="fas fa-list fa-3x"></i>}
              />
            ))}
          </HorizontalScroll>
        ) : (
          <p>Bạn chưa có playlist nào</p>
        )}

        {/* MODAL */}
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

                <input type="file" hidden onChange={handleImageChange} />
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
      </section>

      {/* ================= FAVORITES ================= */}
      <section className={cx('section-block')}>
        <div className={cx('tab-header')}>
          <div className={cx('tab-item', { active: activeTab === 'songs' })} onClick={() => setActiveTab('songs')}>
            BÀI HÁT
          </div>

          <div className={cx('tab-item', { active: activeTab === 'albums' })} onClick={() => setActiveTab('albums')}>
            ALBUM
          </div>
        </div>

        {/* SONGS */}
        {activeTab === 'songs' && (
          <div className={cx('section-block-songs')}>
            {loadingFavoriteSongs ? (
              <p>Đang tải bài hát...</p>
            ) : favoriteSongs.length > 0 ? (
              <LimitedList items={favoriteSongs} renderItem={renderSongItem} limit={8} />
            ) : (
              <p>Bạn chưa có bài hát yêu thích</p>
            )}
          </div>
        )}

        {/* ALBUM */}
        {activeTab === 'albums' && (
          <div className={cx('session-block-albums')}>
            {loadingAlbums ? (
              <p>Đang tải album...</p>
            ) : favoriteAlbums.length > 0 ? (
              <LimitedList
                items={favoriteAlbums}
                limit={8}
                renderItem={item => (
                  <SquareCard
                    key={item.album.id}
                    content={item.album.title}
                    cover={item.album.cover}
                    href={`/album/${item.album.id}`}
                  />
                )}
              />
            ) : (
              <p>Bạn chưa có album yêu thích</p>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default Library;
