import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ArtistsAnalytic.module.scss';
import icons from '~/assets/icons';
import LimitedList from '~/components/Components/LimitedList';
import { apiGetAlbums } from '~/api/services/serviceAlbums';
import { apiGetArtists } from '~/api/services/serviceArtists';

const cx = classNames.bind(styles);

function ArtistsAnalytic() {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsRes, albumsRes] = await Promise.all([apiGetArtists(), apiGetAlbums()]);

        // Sắp xếp dữ liệu: createdAt mới nhất lên đầu
        const sortedArtists = (artistsRes?.data || artistsRes || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const sortedAlbums = (albumsRes?.data || albumsRes || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setArtists(sortedArtists);
        setAlbums(sortedAlbums);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const kpiData = [
    {
      label: 'Tổng số Nghệ sĩ',
      value: artists.length.toLocaleString(),
      icon: icons.iconStar,
      type: 'primary',
      trend: 'Live',
    },
    {
      label: 'Tổng số Album',
      value: albums.length.toLocaleString(),
      icon: icons.iconCompactDisc,
      type: 'tertiary',
      trend: 'Live',
    },
    { label: 'Cập nhật mới', value: '324', icon: icons.iconMusic, type: 'secondary', trend: 'Hôm nay' },
  ];

  if (loading) return <div className={cx('loading')}>Đang tải dữ liệu...</div>;

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <header className={cx('header')}>
          <h2 className={cx('title')}>Thống kê Nghệ sĩ & Album</h2>
          <p className={cx('description')}>Quản trị hiệu suất nội dung âm nhạc trên hệ thống.</p>
        </header>

        <div className={cx('kpi-grid')}>
          {kpiData.map((kpi, index) => (
            <div key={index} className={cx('kpi-card')}>
              <div className={cx('kpi-top')}>
                <div className={cx('icon-box', kpi.type)}>
                  <span className="material-symbols-outlined">
                    <i className={cx(kpi.icon)}></i>
                  </span>
                </div>
                <span className={cx('trend-badge', kpi.type)}>{kpi.trend}</span>
              </div>
              <h3 className={cx('kpi-label')}>{kpi.label}</h3>
              <p className={cx('kpi-value')}>{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className={cx('charts-row')}>
          <div className={cx('chart-box')}>
            <div className={cx('chart-header')}>
              <div>
                <h4 className={cx('chart-title')}>Tăng trưởng phát hành</h4>
                <p className={cx('chart-subtitle')}>Số lượng album được tạo hàng tháng</p>
              </div>
              <div className={cx('chart-stat')}>
                <span className={cx('highlight')}>1.2k</span>
                <p className={cx('label')}>Tháng này</p>
              </div>
            </div>
            <div className={cx('bar-container')}>
              {[40, 60, 45, 80, 55, 90].map((height, i) => (
                <div key={i} className={cx('bar', { active: i === 5 })} style={{ height: `${height}%` }}></div>
              ))}
            </div>
            <div className={cx('chart-labels')}>
              {months.map((m, i) => (
                <span key={i} className={cx({ active: i === 5 })}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className={cx('chart-box')}>
            <div className={cx('chart-header')}>
              <div>
                <h4 className={cx('chart-title')}>Hiệu suất nghe</h4>
                <p className={cx('chart-subtitle')}>So sánh lượt nghe (Dữ liệu mô phỏng)</p>
              </div>
              <div className={cx('legend')}>
                <div className={cx('legend-item')}>
                  <span className={cx('dot', 'primary')}></span>Pop
                </div>
                <div className={cx('legend-item')}>
                  <span className={cx('dot', 'tertiary')}></span>R&B
                </div>
              </div>
            </div>
            <div className={cx('line-chart-svg')}>
              <svg viewBox="0 0 400 150" fill="none">
                <path
                  d="M0 120C50 110 80 40 150 60C220 80 300 10 400 30"
                  stroke="#72fe8f"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M0 140C70 135 120 100 200 110C280 120 330 60 400 80"
                  stroke="#88ebff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeOpacity="0.6"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className={cx('lists-row')}>
          {/* New Artists */}
          <section className={cx('list-section')}>
            <div className={cx('list-header')}>
              <h4 className={cx('list-title')}>Nghệ sĩ mới nhất</h4>
            </div>
            <div className={cx('items-stack')}>
              <LimitedList
                items={artists}
                limit={5}
                wrapInRow={false}
                renderItem={item => (
                  <div key={item.id} className={cx('item-card')}>
                    <img src={item.avatar} alt={item.name} className={cx('avatar')} />
                    <div className={cx('info')}>
                      <h5 className={cx('name')}>{item.name}</h5>
                      <p className={cx('sub')}>{item.favorites?.toLocaleString() || 0} yêu thích</p>
                    </div>
                    <span className={cx('date-label')}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}
              />
            </div>
          </section>

          {/* New Albums */}
          <section className={cx('list-section')}>
            <div className={cx('list-header')}>
              <h4 className={cx('list-title')}>Album mới nhất</h4>
            </div>
            <div className={cx('items-stack')}>
              <LimitedList
                items={albums}
                limit={5}
                wrapInRow={false}
                renderItem={item => (
                  <div key={item.id} className={cx('item-card')}>
                    <div className={cx('cover-box')}>
                      <img src={item.cover} alt={item.title} />
                    </div>
                    <div className={cx('info')}>
                      <h5 className={cx('name')}>{item.title}</h5>
                      <p className={cx('sub')}>{item.favorites?.toLocaleString() || 0} yêu thích</p>
                    </div>
                    <span className={cx('date-label')}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ArtistsAnalytic;
