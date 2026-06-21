import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import styles from './Analytic.module.scss';
import icons from '~/assets/icons';
import LimitedList from '~/components/Components/LimitedList';

import { apiGetArtists } from '~/api/services/serviceArtists';
import { apiGetSongs } from '~/api/services/serviceSongs';
import { apiGetUsers } from '~/api/services/serviceUsers';
import {
  apiGetListenByMonth,
  apiGetListenByWeek,
  apiGetListenByDay,
  apiGetRevenueStatistics,
} from '~/api/services/serviceAnalytics';

const cx = classNames.bind(styles);

function Analytic() {
  const [artists, setArtists] = useState([]);
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [revenue, setRevenue] = useState({ totalRevenue: 0, totalOrders: 0 });
  const [chartData, setChartData] = useState([]);
  const [filterType, setFilterType] = useState('week');
  const [loadingChart, setLoadingChart] = useState(false);

  // 1. Fetch dữ liệu tổng quan (chạy 1 lần duy nhất)
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [artistRes, userRes, songRes, revenueRes] = await Promise.all([
          apiGetArtists(),
          apiGetUsers(),
          apiGetSongs(),
          apiGetRevenueStatistics(),
        ]);

        const sortedArtists = [...artistRes].sort((a, b) => (b.favorites || 0) - (a.favorites || 0));
        setArtists(sortedArtists);
        setUsers(userRes);
        setSongs(songRes);
        setRevenue(revenueRes);
      } catch (err) {
        console.error('Lỗi fetch dữ liệu tổng quan:', err);
      }
    };

    fetchStaticData();
  }, []);

  // 2. Fetch dữ liệu biểu đồ (chạy lại mỗi khi filterType thay đổi)
  useEffect(() => {
    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        let res;
        if (filterType === 'day') res = await apiGetListenByDay();
        else if (filterType === 'month') res = await apiGetListenByMonth();
        else res = await apiGetListenByWeek();

        setChartData(res);
      } catch (err) {
        console.error('Lỗi fetch biểu đồ:', err);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchChartData();
  }, [filterType]);

  const totalUsers = users.length;
  const totalSongs = songs.length;
  const totalListenCounts = songs.reduce((sum, song) => sum + (song.listenCount || 0), 0);

  const kpis = [
    {
      title: 'Tổng lượt nghe',
      value: Intl.NumberFormat('vi-VN').format(totalListenCounts),
      icon: icons.iconHeadphones,
    },
    {
      title: 'Tổng người dùng',
      value: Intl.NumberFormat('vi-VN').format(totalUsers),
      icon: icons.iconUser,
    },
    {
      title: 'Doanh thu',
      value: Intl.NumberFormat('vi-VN').format(revenue.totalRevenue),
      unit: 'VND',
      icon: icons.iconDollar,
    },
    {
      title: 'Tổng số bài hát',
      value: Intl.NumberFormat('vi-VN').format(totalSongs),
      icon: icons.iconMusic,
    },
  ];

  return (
    <div className={cx('wrapper')}>
      {/* HEADER */}
      <div className={cx('header')}>
        <div className={cx('titleGroup')}>
          <h2 className={cx('title')}>
            Thống kê <span>Hệ thống</span>
          </h2>
          <p className={cx('subtitle')}>Báo cáo hiệu suất nội dung của hệ thống.</p>
        </div>
      </div>

      {/* KPI GRID */}
      <div className={cx('kpiGrid')}>
        {kpis.map((kpi, index) => (
          <div key={index} className={cx('card')}>
            <div className={cx('cardHeader')}>
              <span className={cx('cardIcon')}>
                <i className={cx(kpi.icon)}></i>
              </span>
            </div>
            <div className={cx('cardContent')}>
              <p className={cx('cardTitle')}>{kpi.title}</p>
              <h3 className={cx('cardValue')}>
                {kpi.value} {kpi.unit && <span className={cx('unit')}>{kpi.unit}</span>}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className={cx('mainGrid')}>
        <div className={cx('chartBox')}>
          <div className={cx('boxHeader')}>
            <h4 className={cx('boxTitle')}>Tăng trưởng lượt nghe</h4>
            <select className={cx('selectFilter')} value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="day">Theo ngày</option>
              <option value="week">Theo tuần</option>
              <option value="month">Theo tháng</option>
            </select>
          </div>

          <div
            className={cx('chartPlaceholder')}
            style={{ width: '100%', height: 350, opacity: loadingChart ? 0.5 : 1, transition: '0.3s' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorListen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1db954" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1db954" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                <XAxis
                  dataKey="period"
                  stroke="#777"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={tick => (filterType === 'day' ? tick.split('-').slice(1).join('/') : tick)}
                />
                <YAxis stroke="#777" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181818', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#1db954', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="totalListen"
                  stroke="#1db954"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorListen)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RANKING ARTISTS */}
        <div className={cx('artistBox')}>
          <h4 className={cx('boxTitle')}>Nghệ sĩ nổi bật</h4>
          <div className={cx('artistList')}>
            <LimitedList
              items={artists}
              limit={5}
              wrapInRow={false}
              renderItem={(a, i) => (
                <div key={a.id} className={cx('artistItem')}>
                  <div className={cx('rank')}>{i + 1}</div>
                  <img src={a.avatar} alt={a.name} />
                  <div className={cx('artistInfo')}>
                    <div className={cx('artistName')}>{a.name}</div>
                  </div>
                  <div className={cx('artistStats')}>
                    {Intl.NumberFormat('vi-VN').format(a.favorites || 0)}
                    <span style={{ fontSize: '10px', marginLeft: '4px' }}>❤</span>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytic;
