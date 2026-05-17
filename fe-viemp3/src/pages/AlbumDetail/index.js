import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AlbumDetail.module.scss';
import SongItem from '~/components/Components/SongItem';
import LimitedList from '~/components/Components/LimitedList';
import icons from '~/assets/icons';
import { useParams } from 'react-router-dom';

import {
  apiGetAlbum,
  apiGetMyFavoriteAlbums,
  apiAddAlbumToFavorite,
  apiRemoveAlbumFromFavorite,
} from '~/api/services/serviceAlbums';

import { apiGetSongsByAlbum, apiGetMyFavoriteSongs } from '~/api/services/serviceSongs';

const cx = classNames.bind(styles);

function AlbumDetail() {
  const { albumId } = useParams();

  const [album, setAlbum] = useState(null);
  const [songsInAlbum, setSongsInAlbum] = useState([]);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);
  const [loading, setLoading] = useState(true);

  // ===== FETCH DATA =====
  const fetchData = async () => {
    try {
      setLoading(true);

      const [albumData, songsData] = await Promise.all([apiGetAlbum(albumId), apiGetSongsByAlbum(albumId)]);

      setAlbum(albumData);
      setSongsInAlbum(songsData || []);
    } catch (error) {
      console.error('Lỗi khi fetch album:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (albumId) {
      fetchData();
    }
  }, [albumId]);

  // ===== CHECK FAVORITE =====
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const myFavorites = await apiGetMyFavoriteAlbums();
        const isFav = myFavorites.some(item => item.album.id === albumId);
        setIsFavorite(isFav);
      } catch (error) {
        console.error('Lỗi khi kiểm tra favorite:', error);
      }
    };

    if (albumId) {
      checkFavorite();
    }
  }, [albumId]);

  // ===== TÍNH TỔNG THỜI LƯỢNG =====
  useEffect(() => {
    let total = 0;
    let loadedCount = 0;

    if (songsInAlbum.length > 0) {
      songsInAlbum.forEach(song => {
        const audio = new Audio(song.audio);

        audio.addEventListener('loadedmetadata', () => {
          total += Math.floor(audio.duration);
          loadedCount++;

          if (loadedCount === songsInAlbum.length) {
            setTotalDurationSeconds(total);
          }
        });
      });
    } else {
      setTotalDurationSeconds(0);
    }
  }, [songsInAlbum]);

  // ===== FORMAT TIME =====
  const hours = Math.floor(totalDurationSeconds / 3600);
  const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
  const seconds = totalDurationSeconds % 60;

  const formattedDuration =
    hours > 0 ? `${hours} giờ ${minutes} phút ${seconds} giây` : `${minutes} phút ${seconds} giây`;

  // ===== FAVORITE =====
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await apiRemoveAlbumFromFavorite(albumId);
        setIsFavorite(false);
      } else {
        await apiAddAlbumToFavorite(albumId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Lỗi khi toggle favorite:', error);
      alert(error.message);
    }
  };

  const loadFavoriteSongs = async () => {
    try {
      const data = await apiGetMyFavoriteSongs();
      setFavoriteSongs(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    loadFavoriteSongs();
  }, []);

  // ===== UI =====
  if (loading) return <div>Đang tải album...</div>;

  if (!album) return <div>Album không tồn tại</div>;

  return (
    <div className={cx('album-wrapper', 'py-4')}>
      {/* HEADER */}
      <div className={cx('album-header', 'd-flex', 'align-items-center', 'mb-4')}>
        <img src={album.cover} alt="album-cover" className={cx('album-cover')} />

        <div className="ms-4">
          <h1 className={cx('album-title')}>{album.title}</h1>

          <p className={cx('album-description')}>Tuyển tập các bài hát trong Album</p>

          <p className={cx('album-meta')}>
            {songsInAlbum.length} bài hát - {formattedDuration}
          </p>

          <button className={cx('favorite-btn')} onClick={toggleFavorite}>
            <i className={cx(isFavorite ? icons.iconCheck : icons.iconHeart, 'me-1')}></i>
            {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
          </button>
        </div>
      </div>

      {/* SONG LIST */}
      <h5 className={cx('section-title')}>Bài Hát Nổi Bật</h5>

      {songsInAlbum.length > 0 ? (
        <LimitedList
          items={songsInAlbum}
          limit={8}
          wrapInRow={true}
          renderItem={(song, idx) => (
            <div className="col-md-6 mb-3" key={song.id || idx}>
              <SongItem song={song} favoriteSongs={favoriteSongs} setFavoriteSongs={setFavoriteSongs} />
            </div>
          )}
        />
      ) : (
        <p>Không có bài hát nào</p>
      )}
    </div>
  );
}

export default AlbumDetail;
