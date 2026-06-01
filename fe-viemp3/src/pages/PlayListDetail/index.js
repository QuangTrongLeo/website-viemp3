import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './PlayListDetail.module.scss';

import { SongRow } from '~/components/Components/Row';
import LimitedList from '~/components/Components/LimitedList';

import { apiGetPlaylist } from '~/api/services/servicePlaylists';
import { apiGetSongsByPlaylist } from '~/api/services/serviceSongs';

const cx = classNames.bind(styles);

function PlayListDetail() {
  const { playlistId } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);

  // ===== FETCH PLAYLIST =====
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const data = await apiGetPlaylist(playlistId);
        setPlaylist(data);
      } catch (error) {
        console.error('Lỗi lấy playlist:', error);
      }
    };

    if (playlistId) fetchPlaylist();
  }, [playlistId]);

  // ===== FETCH SONGS BY PLAYLIST =====
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await apiGetSongsByPlaylist(playlistId);
        setSongs(data || []);
      } catch (error) {
        console.error('Lỗi lấy bài hát theo playlist:', error);
        setSongs([]);
      }
    };

    if (playlistId) fetchSongs();
  }, [playlistId]);

  if (!playlist) {
    return <div className="p-4">Đang tải playlist...</div>;
  }

  return (
    <div className={cx('playlist-wrapper', 'py-4')}>
      {/* ===== HEADER PLAYLIST ===== */}
      <div className={cx('playlist-header', 'd-flex', 'align-items-center', 'mb-4')}>
        {playlist.cover ? (
          <img src={playlist.cover} alt="playlist-cover" className={cx('playlist-cover')} />
        ) : (
          <div className={cx('playlist-cover', 'playlist-cover-placeholder')}>
            <i className="fas fa-list"></i>
          </div>
        )}

        <div className="ms-4">
          <h2 className={cx('playlist-title')}>{playlist.name}</h2>
          <p className={cx('playlist-description')}>Tuyển tập các bài hát trong playlist {playlist.name}</p>
          <p className={cx('playlist-meta')}>{songs.length} bài hát</p>
        </div>
      </div>

      {/* ===== SONG LIST ===== */}
      <h5 className={cx('section-title')}>Danh sách bài hát</h5>

      {songs.length === 0 ? (
        <p>Playlist chưa có bài hát.</p>
      ) : (
        <>
          <div className={cx('song-row', 'd-flex', 'align-items-center', 'px-3', 'py-3')}>
            <div className="col-6 d-flex align-items-center">
              <span>Bài hát</span>
            </div>

            <div className="col-4 d-flex align-items-center">
              <span>Album</span>
            </div>

            <div className="col-2 d-flex justify-content-end align-items-center">
              <span>Thời gian</span>
            </div>
          </div>

          <LimitedList items={songs} limit={8} renderItem={item => <SongRow key={item.id} song={item} />} />
        </>
      )}
    </div>
  );
}

export default PlayListDetail;
