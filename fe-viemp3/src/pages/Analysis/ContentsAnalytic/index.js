import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ContentsAnalytic.module.scss';
import LimitedList from '~/components/Components/LimitedList';
import { apiGetSongs } from '~/api/services/serviceSongs';
import { apiGetGenres } from '~/api/services/serviceGenres';
import { apiGetGenreStatistics } from '~/api/services/serviceAnalytics';

const cx = classNames.bind(styles);

function ContentsAnalytic() {
  const [songs, setSongs] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genreStats, setGenreStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const chartColors = ['#72fe8f', '#1cb853', '#88ebff', '#00d4ee', '#f472b6', '#a78bfa'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresRes, songsRes, statsRes] = await Promise.all([
          apiGetGenres(),
          apiGetSongs(),
          apiGetGenreStatistics(),
        ]);
        setGenres(genresRes?.data || genresRes || []);
        setSongs(songsRes?.data || songsRes || []);
        setGenreStats(statsRes?.data || statsRes || []);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sortedListenSongs = [...songs].sort((a, b) => (b.listenCount || 0) - (a.listenCount || 0));
  const sortedFavoriteSongs = [...songs].sort((a, b) => (b.favorites || 0) - (a.favorites || 0));

  let cumulativeOffset = 0;

  if (loading) return <div className={cx('loading')}>Đang tải dữ liệu...</div>;

  return (
    <main className={cx('wrapper')}>
      <header className={cx('header')}>
        <h2 className={cx('editorial-header')}>Thống kê Nội dung</h2>
        <p className={cx('subtitle')}>Phân tích nhịp điệu và sự lan tỏa của âm nhạc trên hệ thống.</p>
      </header>

      <div className={cx('bento-grid')}>
        {/* Row 1: Stats & Chart */}
        <div className={cx('card', 'total-songs')}>
          <div className={cx('card-main-info')}>
            <h3 className={cx('label')}>Tổng số bài hát</h3>
            <div className={cx('number-group')}>
              <p className={cx('number')}>{songs.length.toLocaleString()}</p>
              <span className={cx('sub-label')}>Dữ liệu thời gian thực</span>
            </div>
          </div>
        </div>

        <div className={cx('card', 'genre-chart')}>
          <h3 className={cx('chart-title')}>Phân bổ Thể loại Nhạc</h3>
          <div className={cx('chart-content')}>
            <div className={cx('circular-chart')}>
              <svg viewBox="0 0 36 36">
                <circle className={cx('base-circle')} cx="18" cy="18" r="15.9"></circle>
                {genreStats.map((item, index) => {
                  const strokeDashArray = `${item.percentage} 100`;
                  const strokeDashOffset = -cumulativeOffset;
                  cumulativeOffset += item.percentage;
                  return (
                    <circle
                      key={index}
                      className={cx('segment')}
                      cx="18"
                      cy="18"
                      r="15.9"
                      stroke={chartColors[index % chartColors.length]}
                      strokeDasharray={strokeDashArray}
                      strokeDashoffset={strokeDashOffset}
                      fill="transparent"
                      strokeWidth="3.8"
                    ></circle>
                  );
                })}
              </svg>
              <div className={cx('chart-label')}>
                <span className={cx('count')}>{genres.length}</span>
                <span className={cx('unit')}>Thể loại</span>
              </div>
            </div>
            <div className={cx('legend')}>
              {genreStats.slice(0, 6).map((item, index) => (
                <div key={index} className={cx('legend-item')}>
                  <div className={cx('dot')} style={{ backgroundColor: chartColors[index % chartColors.length] }}></div>
                  <div>
                    <p className={cx('name')}>{item.genreName}</p>
                    <p className={cx('info')}>
                      {item.percentage}% • {item.songCount} bài
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Top Lists (Independent Height) */}
        <div className={cx('top-lists-wrapper')}>
          {/* Top Lượt Nghe */}
          <div className={cx('card', 'top-list-item')}>
            <h3 className={cx('chart-title')}>Top Bài Hát Nghe Nhiều Nhất</h3>
            <div className={cx('songs-container')}>
              <LimitedList
                items={sortedListenSongs}
                limit={5}
                renderItem={(song, index) => (
                  <div key={`listen-${song.id || index}`} className={cx('song-item')}>
                    <span className={cx('rank')}>{(index + 1).toString().padStart(2, '0')}</span>
                    <div className={cx('thumb')}>
                      <img src={song.cover || 'https://via.placeholder.com/150'} alt={song.title} />
                    </div>
                    <div className={cx('song-info')}>
                      <p className={cx('name')}>{song.title}</p>
                      <p className={cx('description')}>{song.description?.substring(0, 40) || 'Âm nhạc Vie-MP3'}</p>
                    </div>
                    <div className={cx('stats')}>
                      <p className={cx('views')}>{song.listenCount?.toLocaleString() || 0}</p>
                      <p className={cx('sub')}>Lượt nghe</p>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Top Yêu Thích */}
          <div className={cx('card', 'top-list-item')}>
            <h3 className={cx('chart-title')}>Top Bài Hát Yêu Thích Nhất</h3>
            <div className={cx('songs-container')}>
              <LimitedList
                items={sortedFavoriteSongs}
                limit={5}
                renderItem={(song, index) => (
                  <div key={`fav-${song.id || index}`} className={cx('song-item')}>
                    <span className={cx('rank')}>{(index + 1).toString().padStart(2, '0')}</span>
                    <div className={cx('thumb')}>
                      <img src={song.cover || 'https://via.placeholder.com/150'} alt={song.title} />
                    </div>
                    <div className={cx('song-info')}>
                      <p className={cx('name')}>{song.title}</p>
                      <p className={cx('description')}>{song.description?.substring(0, 40) || 'Âm nhạc Vie-MP3'}</p>
                    </div>
                    <div className={cx('stats')}>
                      <p className={cx('views', 'heart')}>{song.favorites?.toLocaleString() || 0}</p>
                      <p className={cx('sub')}>Yêu thích</p>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ContentsAnalytic;
