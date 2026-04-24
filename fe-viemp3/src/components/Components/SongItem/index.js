import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './SongItem.module.scss';
import icons from '~/assets/icons';
import { Link } from 'react-router-dom';

import SongMenu from '../SongMenu';

import { apiGetArtist } from '~/api/services/serviceArtists';
import { apiGetMyFavoriteSongs, apiAddSongToFavorite, apiRemoveSongFromFavorite } from '~/api/services/serviceSongs';

const cx = classNames.bind(styles);

function SongItem({ song }) {
  const [duration, setDuration] = useState('00:00');
  const [artist, setArtist] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const audioRef = useRef(null);

  const handleActionClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  // ===== FAVORITE =====
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await apiGetMyFavoriteSongs();
        const ids = data.map(item => item.song.id);
        setIsLiked(ids.includes(song.id));
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavorites();
  }, [song.id]);

  const toggleLike = async e => {
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
      console.error(error);
    }
  };

  // ===== ARTIST =====
  useEffect(() => {
    const fetchArtist = async () => {
      if (!song.artistId) return;
      const data = await apiGetArtist(song.artistId);
      setArtist(data);
    };

    fetchArtist();
  }, [song.artistId]);

  // ===== DURATION =====
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => {
      const mins = Math.floor(audio.duration / 60);
      const secs = Math.floor(audio.duration % 60);
      setDuration(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    };

    audio.addEventListener('loadedmetadata', handleLoaded);
    return () => audio.removeEventListener('loadedmetadata', handleLoaded);
  }, [song.audio]);

  return (
    <Link to={`/song/${song.id}`} className={cx('song-item')}>
      {/* LEFT */}
      <div className={cx('left')}>
        <img src={song.cover} className={cx('cover')} />
        <div className={cx('info')}>
          <div className={cx('title')}>{song.title}</div>
          <div className={cx('artist')}>{artist?.name || 'Đang tải...'}</div>
        </div>
      </div>

      {/* RIGHT */}
      <div className={cx('right')}>
        <i className={cx('heart-icon', icons.iconHeart, isLiked && 'active')} onClick={toggleLike} />

        {/* TIME + MENU */}
        <div className={cx('right-group')}>
          <span className={cx('duration')}>{duration}</span>

          <SongMenu song={song} isLiked={isLiked} onToggleLike={toggleLike} handleActionClick={handleActionClick} />
        </div>
      </div>

      {song.audio && <audio ref={audioRef} src={song.audio} style={{ display: 'none' }} />}
    </Link>
  );
}

export default SongItem;
