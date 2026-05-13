import React, { useEffect, useState } from 'react';
import icons from '~/assets/icons';
import classNames from 'classnames/bind';
import styles from './FavoriteSongs.module.scss';
import SongRow from '~/components/Components/Row/SongRow';
import LimitedList from '~/components/Components/LimitedList';
import { apiGetMyFavoriteSongs } from '~/api/services/serviceSongs';

const cx = classNames.bind(styles);

function FavoriteSongs() {
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  const handleGetFavoriteSongs = async () => {
    try {
      const data = await apiGetMyFavoriteSongs();
      const sorted = [...data].sort((a, b) => new Date(b.favoritedAt) - new Date(a.favoritedAt));
      setFavoriteSongs(sorted);
    } catch (error) {
      console.error('Lỗi khi lấy bài hát yêu thích:', error);
    }
  };

  useEffect(() => {
    handleGetFavoriteSongs();
  }, []);

  const renderItem = item => <SongRow key={item.song.id} song={item.song} />;

  return (
    <>
      <h1 className="text-center">
        <i className={icons.iconHeart}></i>
        <span style={{ paddingLeft: '10px' }}>Bài hát yêu thích của bạn</span>
      </h1>

      {/* Header */}
      <div className={cx('song-row', 'd-flex', 'align-items-center', 'px-3', 'py-3')}>
        <div className="col-6 d-flex align-items-center gap-2">
          <i className={cx('song-row-icon-header', icons.iconMusic)}></i>
          <span>Bài hát</span>
        </div>

        <div className="col-4 d-flex align-items-center">
          <i className={cx('song-row-icon-header', icons.iconCompactDisc, 'me-2')}></i>
          <span>Album</span>
        </div>

        <div className="col-2 d-flex justify-content-end align-items-center">
          <i className={cx('song-row-icon-header', icons.iconClock, 'me-2')}></i>
          <span>Thời gian</span>
        </div>
      </div>

      {favoriteSongs.length === 0 ? (
        <div className={cx('empty-state')}>
          <i className={icons.iconMusic} style={{ fontSize: '60px', opacity: 0.3 }}></i>
          <h4 style={{ marginTop: '15px' }}>Bạn chưa có bài hát yêu thích</h4>
          <p style={{ opacity: 0.7 }}>Hãy thêm bài hát vào danh sách yêu thích.</p>
        </div>
      ) : (
        <LimitedList
          items={favoriteSongs}
          renderItem={renderItem}
          limit={8}
          showAllText="Hiện tất cả bài hát"
          showLessText="Ẩn bớt"
        />
      )}
    </>
  );
}

export default FavoriteSongs;
