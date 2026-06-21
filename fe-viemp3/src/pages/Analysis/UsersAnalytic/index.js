import React from 'react';
import classNames from 'classnames/bind';
import styles from './UsersAnalytic.module.scss';

const cx = classNames.bind(styles);

function UsersAnalytic() {
  const growthData = [
    { day: 'Thứ 2', val: 12, height: '40%' },
    { day: 'Thứ 3', val: 18, height: '55%' },
    { day: 'Thứ 4', val: 10, height: '35%' },
    { day: 'Thứ 5', val: 28, height: '85%', active: true },
    { day: 'Thứ 6', val: 22, height: '65%' },
    { day: 'Thứ 7', val: 16, height: '50%' },
    { day: 'Chủ nhật', val: 24, height: '75%' },
  ];

  return (
    <main className={cx('wrapper')}>
      {/* Header */}
      <section>
        <h1 className={cx('main-title')}>Thống kê Người dùng</h1>
        <p style={{ color: '#adaaaa' }}>Xem báo cáo tăng trưởng và phân bổ gói hội viên của đồ án Sonic Noir.</p>
      </section>

      {/* Metrics */}
      <div className={cx('metrics-row')}>
        <div className={cx('card', 'metric-card')}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#adaaaa', textTransform: 'uppercase' }}>
              Tổng số người dùng
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginTop: '8px' }}>
              <span style={{ fontSize: '3rem', fontWeight: '900' }}>1,248</span>
              <span
                style={{
                  color: '#1DB954',
                  fontSize: '14px',
                  background: 'rgba(29, 185, 84, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                +5%
              </span>
            </div>
          </div>
          <div className={cx('icon-box')}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
              groups
            </span>
          </div>
        </div>

        <div className={cx('card', 'metric-card')}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#adaaaa', textTransform: 'uppercase' }}>
              Đăng ký mới hôm nay
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginTop: '8px' }}>
              <span style={{ fontSize: '3rem', fontWeight: '900' }}>24</span>
              <span
                style={{
                  color: '#1DB954',
                  fontSize: '14px',
                  background: 'rgba(29, 185, 84, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                Mới
              </span>
            </div>
          </div>
          <div className={cx('icon-box')}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
              person_add
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {/* Bar Chart */}
        <div className={cx('card', 'col-8')}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '4px' }}>Tăng trưởng người dùng mới</h3>
          <p style={{ color: '#adaaaa', fontSize: '14px', marginBottom: '32px' }}>
            Số liệu thống kê trong 7 ngày gần nhất
          </p>

          <div className={cx('chart-container')}>
            {growthData.map((item, index) => (
              <div key={index} className={cx('bar-group')}>
                <div className={cx('bar-bg', { 'bar-active': item.active })} style={{ height: item.height }}>
                  <span
                    className={cx('tooltip', { active: item.active })}
                    style={{ color: item.active ? '#1DB954' : '#adaaaa' }}
                  >
                    {item.val}
                  </span>
                </div>
                <span className={cx('label', { active: item.active })}>{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart */}
        <div className={cx('card', 'col-4')} style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Phân bổ Gói hội viên</h3>
          <p style={{ color: '#adaaaa', fontSize: '14px', marginBottom: '32px' }}>
            Tỉ lệ giữa Gói Cá nhân và Gói Sinh viên
          </p>

          <div
            style={{
              flexGrow: 1,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <svg width="160" height="160" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="40" stroke="#262626" strokeWidth="12" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#1DB954"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="163.4 251.3"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#0fe3ff"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="87.9 251.3"
                strokeDashoffset="-163.4"
              />
            </svg>
            <span style={{ position: 'absolute', fontSize: '24px', fontWeight: '900' }}>100%</span>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#1DB954' }}></div>
                <span style={{ fontSize: '14px', color: '#adaaaa' }}>Gói Cá nhân</span>
              </div>
              <span style={{ fontWeight: 'bold' }}>65%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#0fe3ff' }}></div>
                <span style={{ fontSize: '14px', color: '#adaaaa' }}>Gói Sinh viên</span>
              </div>
              <span style={{ fontWeight: 'bold' }}>35%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className={cx('card', 'col-12')} style={{ padding: '0' }}>
        <div style={{ padding: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Người dùng mới đăng ký</h3>
        </div>
        <div className={cx('table-wrapper')}>
          <table>
            <thead>
              <tr>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Gói hội viên</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#262626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1DB954',
                        fontWeight: 'bold',
                      }}
                    >
                      LM
                    </div>
                    <span style={{ fontWeight: 'bold' }}>Lê Minh Quân</span>
                  </div>
                </td>
                <td style={{ color: '#adaaaa', fontSize: '14px' }}>quan.leminh@student.edu.vn</td>
                <td>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '99px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      backgroundColor: 'rgba(15, 227, 255, 0.1)',
                      color: '#0fe3ff',
                    }}
                  >
                    Gói Sinh viên
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#1DB954', fontSize: '18px' }}>
                      check_circle
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '500' }}>VNPAY Thành công</span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button style={{ color: '#adaaaa' }}>
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <footer style={{ marginTop: '48px', textAlign: 'center' }}>
        <p
          style={{
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(173, 170, 170, 0.4)',
            fontWeight: 'bold',
          }}
        >
        </p>
      </footer>
    </main>
  );
}

export default UsersAnalytic;
