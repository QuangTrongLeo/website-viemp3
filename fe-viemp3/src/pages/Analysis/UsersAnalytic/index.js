import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './UsersAnalytic.module.scss';
import {
  apiGetUserStatusStatistics,
  apiGetUserRoleStatistics,
  apiGetUserMembershipStatistics,
} from '~/api/services/serviceAnalytics';

const cx = classNames.bind(styles);

function UsersAnalytic() {
  const [statusData, setStatusData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [status, roles, memberships] = await Promise.all([
          apiGetUserStatusStatistics(),
          apiGetUserRoleStatistics(),
          apiGetUserMembershipStatistics(),
        ]);

        setStatusData(status);
        setRoleData(roles);
        setMembershipData(memberships);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const totalUsers = statusData.reduce((acc, curr) => acc + curr.count, 0);

  const renderDonut = (data, colors) => {
    let cumulativePercent = 0;
    const total = data.reduce((acc, curr) => acc + curr.count, 0) || 1;

    return (
      <svg width="140" height="140" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r="40" stroke="#262626" strokeWidth="10" fill="transparent" />
        {data.map((item, index) => {
          if (item.count === 0) return null;
          const percent = (item.count / total) * 100;
          const dashArray = `${(percent * 251.3) / 100} 251.3`;
          const dashOffset = -(cumulativePercent * 251.3) / 100;
          cumulativePercent += percent;

          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="40"
              stroke={colors[index % colors.length]}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              style={{ transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          );
        })}
      </svg>
    );
  };

  if (loading) return <div className={cx('loading')}>Đang bóc tách dữ liệu...</div>;

  return (
    <main className={cx('wrapper')}>
      <section className={cx('header')}>
        <h1 className={cx('main-title')}>Thống kê Người dùng</h1>
        <p className={cx('subtitle')}>Dữ liệu thời gian thực từ hệ thống Sonic Noir.</p>
      </section>

      <div className={cx('metrics-row')}>
        <div className={cx('card', 'metric-card')}>
          <div className={cx('metric-info')}>
            <span className={cx('label')}>Tổng số người dùng</span>
            <div className={cx('value-group')}>
              <span className={cx('value')}>{totalUsers}</span>
              <span className={cx('badge', 'up')}>Live</span>
            </div>
          </div>
        </div>

        <div className={cx('card', 'metric-card')}>
          <div className={cx('metric-info')}>
            <span className={cx('label')}>Premium Member</span>
            <div className={cx('value-group')}>
              <span className={cx('value')}>{membershipData.find(i => i.label.includes('Premium'))?.count || 0}</span>
              <span className={cx('badge', 'premium')}>VIP</span>
            </div>
          </div>
        </div>
      </div>

      <div className={cx('charts-grid')}>
        {/* 1. Trạng thái */}
        <div className={cx('card', 'chart-card')}>
          <h3>Trạng thái tài khoản</h3>
          <div className={cx('donut-box')}>
            {renderDonut(statusData, ['#1DB954', '#E91E63'])}
            <div className={cx('center-text')}>
              <span className={cx('active-count')}>
                {statusData.find(i => i.label.includes('hoạt động'))?.count || 0}
              </span>
              <small>Online</small>
            </div>
          </div>
          <div className={cx('legend')}>
            {statusData.map((item, index) => (
              <div key={index} className={cx('legend-item')}>
                <span className={cx('dot')} style={{ backgroundColor: index === 0 ? '#1DB954' : '#E91E63' }}></span>
                <span className={cx('name')}>{item.label}</span>
                <span className={cx('percentage')}>{item.percentage}%</span>
                <span className={cx('count')}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Vai trò */}
        <div className={cx('card', 'chart-card')}>
          <h3>Phân bổ vai trò</h3>
          <div className={cx('donut-box')}>
            {renderDonut(roleData, ['#f1c40f', '#0fe3ff', '#1DB954'])}
            <div className={cx('center-text')}>
              <span>{totalUsers}</span>
              <small>Roles</small>
            </div>
          </div>
          <div className={cx('legend')}>
            {roleData.map((item, index) => (
              <div key={index} className={cx('legend-item')}>
                <span
                  className={cx('dot')}
                  style={{ backgroundColor: ['#f1c40f', '#0fe3ff', '#1DB954'][index] }}
                ></span>
                <span className={cx('name')}>{item.label}</span>
                <span className={cx('percentage')}>{item.percentage}%</span>
                <span className={cx('count')}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Hội viên */}
        <div className={cx('card', 'chart-card')}>
          <h3>Gói thành viên</h3>
          <div className={cx('donut-box')}>
            {renderDonut(membershipData, ['#1DB954', '#333333'])}
            <div className={cx('center-text')}>
              <span>{membershipData.find(i => i.label.includes('Premium'))?.percentage || 0}%</span>
              <small>Premium</small>
            </div>
          </div>
          <div className={cx('legend')}>
            {membershipData.map((item, index) => (
              <div key={index} className={cx('legend-item')}>
                <span className={cx('dot')} style={{ backgroundColor: index === 0 ? '#1DB954' : '#333333' }}></span>
                <span className={cx('name')}>{item.label}</span>
                <span className={cx('percentage')}>{item.percentage}%</span>
                <span className={cx('count')}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default UsersAnalytic;
