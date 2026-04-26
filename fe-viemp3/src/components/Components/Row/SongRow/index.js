import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './SongRow.module.scss';
import SongMenu from '../../SongMenu/index';

// import { apiGetArtist } from '~/api/services/serviceArtists';
// import { apiGetAlbum } from '~/api/services/serviceAlbums';
// import { apiGetMyFavoriteSongs, apiAddSongToFavorite, apiRemoveSongFromFavorite } from '~/api/services/serviceSongs';

const cx = classNames.bind(styles);

function SongRow({ song }) {
  const [artist, setArtist] = useState(null);
  const [album, setAlbum] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [duration, setDuration] = useState('');

  const audioRef = useRef(null);

  // ===== FETCH ARTIST + ALBUM =====
  useEffect(() => {
    const fetchData = async () => {
      // try {
      //   if (song.artistId) {
      //     const data = await apiGetArtist(song.artistId);
      //     setArtist(data);
      //   }
      //   if (song.albumId) {
      //     const data = await apiGetAlbum(song.albumId);
      //     setAlbum(data);
      //   }
      // } catch (error) {
      //   console.error('Lỗi fetch data:', error);
      // }
    };
    fetchData();
  }, [song.artistId, song.albumId]);

  // ===== FETCH FAVORITE =====
  useEffect(() => {
    const fetchFavorites = async () => {
      // try {
      //   const favorites = await apiGetMyFavoriteSongs();
      //   const ids = favorites.map(item => item.song.id);
      //   setIsLiked(ids.includes(song.id));
      // } catch (error) {
      //   console.error('Lỗi lấy favorite:', error);
      // }
    };
    fetchFavorites();
  }, [song.id]);

  const handleActionClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  // ===== TOGGLE LIKE =====
  const handleToggleLike = async e => {
    handleActionClick(e);
    try {
      if (isLiked) {
        await apiRemoveSongFromFavorite(song.id);
        setIsLiked(false);
      } else {
        await apiAddSongToFavorite(song.id);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Lỗi toggle favorite:', error);
    }
  };

  // ===== LOAD DURATION =====
  const handleLoadedMetadata = () => {
    const seconds = audioRef.current.duration;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    setDuration(`${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
  };

  return (
    <Link to={`/song/${song.id}`} className={cx('song-row')}>
      <div className={cx('d-flex', 'align-items-center', 'px-3', 'py-2')}>
        {/* INFO */}
        <div className="col-6 d-flex align-items-center">
          <img src={song.cover} alt={song.title} className={cx('song-row-cover')} />
          <div className={cx('song-row-info', 'ms-3')}>
            <div className={cx('song-row-title')}>{song.title}</div>
            <div className={cx('song-row-artists')}>{artist?.name || 'Unknown Artist'}</div>
          </div>
        </div>

        {/* ALBUM */}
        <div className={cx('song-row-album', 'col-4')}>{album?.title || ''}</div>

        {/* ACTION */}
        <div className="col-2 d-flex justify-content-end align-items-center">
          <div className={cx('action-items')}>
            <i className={cx('favorite-icon', isLiked && 'active', 'fas', 'fa-heart')} onClick={handleToggleLike}></i>

            <span className={cx('duration-text')}>{duration}</span>

            <SongMenu
              song={song}
              isLiked={isLiked}
              onToggleLike={handleToggleLike}
              handleActionClick={handleActionClick}
            />
          </div>
        </div>

        {song.audio && (
          <audio ref={audioRef} src={song.audio} onLoadedMetadata={handleLoadedMetadata} style={{ display: 'none' }} />
        )}
      </div>
    </Link>
  );
}

export default SongRow;
