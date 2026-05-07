import React, { useEffect, useState } from 'react';
import icons from '~/assets/icons';
import classNames from 'classnames/bind';
import styles from './History.module.scss';
import LimitedList from '~/components/Components/LimitedList';
import SongRow from '~/components/Components/Row/SongRow';
import { apiGetMyListenHistory } from '~/api/services/serviceListenHistories';

const cx = classNames.bind(styles);

function History() {
  const [historySongs, setHistorySongs] = useState([]);

  const fetchData = async () => {
    try {
      const history = await apiGetMyListenHistory();

      // sắp xếp theo thời gian mới nhất
      const sortedHistory = [...history].sort((a, b) => new Date(b.listenedAt) - new Date(a.listenedAt));

      // loại trùng
      const uniqueSongs = [];
      const seen = new Set();

      for (const item of sortedHistory) {
        const songId = item.song.id;

        if (!seen.has(songId)) {
          seen.add(songId);
          uniqueSongs.push(item);
        }
      }

      setHistorySongs(uniqueSongs);
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử nghe:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = item => {
    const song = item.song;
    return <SongRow key={song.id} song={song} />;
  };

  return (
    <>
      <h1 className="text-center">
        <i className={icons.iconHistory}></i>
        <span style={{ paddingLeft: '10px' }}>Nghe gần đây</span>
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

      {historySongs.length === 0 ? (
        <div className={cx('empty-state')}>
          <i className={icons.iconHistory} style={{ fontSize: '60px', opacity: 0.3 }}></i>
          <h4 style={{ marginTop: '15px' }}>Bạn chưa nghe bài hát nào</h4>
          <p style={{ opacity: 0.7 }}>Hãy bắt đầu nghe nhạc.</p>
        </div>
      ) : (
        <LimitedList
          items={historySongs}
          renderItem={renderItem}
          limit={8}
          showAllText="Hiện tất cả bài hát"
          showLessText="Ẩn bớt"
        />
      )}
    </>
  );
}

export default History;
