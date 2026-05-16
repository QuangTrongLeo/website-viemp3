import { useState, useEffect } from 'react';
import Tippy from '@tippyjs/react/headless';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './SongMenu.module.scss';
import LimitedList from '../LimitedList';
import icons from '~/assets/icons';

import { apiGetArtist } from '~/api/services/serviceArtists';
// import { apiGetMyPlaylists, apiAddSongToPlaylist, apiRemoveSongFromPlaylist } from '~/api/services/servicePlaylists';

const cx = classNames.bind(styles);

function SongMenu({ song, isLiked, onToggleLike, handleActionClick }) {
  const [artist, setArtist] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylistId, setLoadingPlaylistId] = useState(null);

  // ===== FETCH PLAYLIST =====
  useEffect(() => {
    const fetchPlaylists = async () => {
      // try {
      //   const data = await apiGetMyPlaylists();
      //   const mapped = (data || []).map(pl => ({
      //     ...pl,
      //     isContainsSong: pl.songs?.some(s => s.id === song?.id),
      //   }));
      //   setPlaylists(mapped);
      // } catch (error) {
      //   console.error('Lỗi lấy playlist:', error);
      // }
    };
    if (song?.id) fetchPlaylists();
  }, [song?.id]);

  // ===== FETCH ARTIST =====
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        if (song?.artistId) {
          const data = await apiGetArtist(song.artistId);
          setArtist(data);
        }
      } catch (error) {
        console.error('Lỗi fetch artist:', error);
      }
    };

    fetchArtist();
  }, [song?.artistId]);

  // ===== TOGGLE ADD / REMOVE =====
  const handleToggleSong = async pl => {
    setLoadingPlaylistId(pl.id);
    try {
      let success;
      // if (pl.isContainsSong) {
      //   success = await apiRemoveSongFromPlaylist(pl.id, song.id);
      // } else {
      //   success = await apiAddSongToPlaylist(pl.id, song.id);
      // }
      if (success) {
        setPlaylists(prev =>
          prev.map(item => (item.id === pl.id ? { ...item, isContainsSong: !item.isContainsSong } : item))
        );
      }
    } catch (error) {
      console.error('Toggle playlist error:', error);
    } finally {
      setLoadingPlaylistId(null);
    }
  };

  // ===== ITEM =====
  const renderPlaylistItem = pl => (
    <div
      key={pl.id}
      className={cx('menu-item')}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        handleToggleSong(pl);
      }}
    >
      <i
        className={
          loadingPlaylistId === pl.id ? 'fas fa-spinner fa-spin' : pl.isContainsSong ? 'fas fa-check' : 'fas fa-plus'
        }
      ></i>
      <span className="ms-2">{pl.name}</span>
    </div>
  );

  // ===== PLAYLIST MENU =====
  const renderPlaylistMenu = attrs => (
    <div className={cx('menu-popper')} tabIndex="-1" {...attrs} onClick={handleActionClick}>
      <div className={cx('search-wrapper')}>
        <input type="text" placeholder="Tìm một danh sách phát" onClick={e => e.stopPropagation()} />
      </div>

      <div className={cx('menu-item')}>
        <i className="fas fa-plus"></i>
        <span>Danh sách phát mới</span>
      </div>

      <div className={cx('divider')}></div>

      <div className={cx('playlist-list')}>
        {playlists.length > 0 ? (
          <LimitedList items={playlists} limit={6} wrapInRow={false} renderItem={item => renderPlaylistItem(item)} />
        ) : (
          <div className={cx('menu-item-disabled')}>Trống</div>
        )}
      </div>
    </div>
  );

  // ===== MAIN MENU =====
  const renderMainMenu = attrs => (
    <div className={cx('menu-popper')} tabIndex="-1" {...attrs} onClick={handleActionClick}>
      <Tippy placement="left-start" offset={[-5, 0]} interactive render={renderPlaylistMenu}>
        <div className={cx('menu-item', 'has-submenu')}>
          <i className="fas fa-plus"></i>
          <span>Thêm vào danh sách phát</span>
          <i className="fas fa-caret-right ms-auto"></i>
        </div>
      </Tippy>

      <div className={cx('menu-item')} onClick={onToggleLike}>
        <i className="fas fa-heart"></i>
        <span>{isLiked ? 'Loại bỏ khỏi bài hát đã thích' : 'Lưu vào bài hát đã thích'}</span>
      </div>

      <Link to={`/artist/${artist?.name}`} className={cx('menu-item')}>
        <i className={icons.iconStar}></i>
        <span>Truy cập nghệ sĩ</span>
      </Link>

      <Link to={`/album/${song.albumId}`} className={cx('menu-item')}>
        <i className={icons.iconCompactDisc}></i>
        <span>Truy cập album</span>
      </Link>
    </div>
  );

  return (
    <Tippy interactive trigger="click" placement="bottom-end" offset={[0, 10]} render={renderMainMenu}>
      <div className={cx('more-icon')} onClick={handleActionClick}>
        <i className="fas fa-ellipsis-h"></i>
      </div>
    </Tippy>
  );
}

export default SongMenu;
