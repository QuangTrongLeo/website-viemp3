import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './RevenuesAnalytic.module.scss';
import LimitedList from '~/components/Components/LimitedList';
import {
  apiGetRevenueStatistics,
  apiGetPackageDistribution,
  apiGetMonthlyRevenue,
} from '~/api/services/serviceAnalytics';
import { apiGetOrders } from '~/api/services/serviceOrders';

const cx = classNames.bind(styles);

function RevenuesAnalytic() {
  const [revenue, setRevenue] = useState({ totalRevenue: 0, totalCompletedOrders: 0 });
  const [packageDist, setPackageDist] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const months = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [revenueRes, packageRes, ordersRes, monthlyRes] = await Promise.all([
          apiGetRevenueStatistics(),
          apiGetPackageDistribution(),
          apiGetOrders(),
          apiGetMonthlyRevenue(),
        ]);

        setRevenue(revenueRes || { totalRevenue: 0, totalCompletedOrders: 0 });
        setPackageDist(packageRes || []);
        setOrders(ordersRes || []);
        setMonthlyRevenue(monthlyRes || []);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const formatCurrency = value => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  // Logic vẽ đường cong núi tròn
  const generateCurvePathData = () => {
    if (!monthlyRevenue || monthlyRevenue.length === 0) return { line: '', area: '', points: [] };

    const width = 1000;
    const height = 200;
    const padding = 30;
    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1);

    const points = monthlyRevenue.map((item, index) => ({
      x: index * (width / (monthlyRevenue.length - 1)),
      y: height - (item.revenue / maxRevenue) * (height - padding),
    }));

    let lineD = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      lineD += ` C ${cp1x},${p0.y} ${cp1x},${p1.y} ${p1.x},${p1.y}`;
    }

    const areaD = `${lineD} L ${width},${height} L 0,${height} Z`;
    return { line: lineD, area: areaD, points };
  };

  const { line, area, points } = generateCurvePathData();

  const renderOrderRow = (order, index) => (
    <div key={order.id || index} className={cx('list-row')}>
      <div className={cx('col-user')}>
        <div className={cx('user-cell')}>
          <div className={cx('avatar')}>
            {order.user?.avatar ? (
              <img src={order.user.avatar} alt="avatar" />
            ) : (
              order.user?.username?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className={cx('info')}>
            <div className={cx('user-name')}>{order.user?.username || 'Ẩn danh'}</div>
            <div className={cx('user-email')}>{order.user?.email || 'N/A'}</div>
          </div>
        </div>
      </div>
      <div className={cx('col-pkg')}>
        <span className={cx('badge', order.pkg?.packageType?.toLowerCase())}>{order.pkg?.packageType}</span>
      </div>
      <div className={cx('col-amount')}>
        <span className={cx('price-text')}>{formatCurrency(order.totalPrice)}</span>
      </div>
      <div className={cx('col-status')}>
        <div className={cx('status-label', order.status?.toLowerCase())}>{order.status}</div>
      </div>
    </div>
  );

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <header className={cx('header')}>
          <div className={cx('header-info')}>
            <h1 className={cx('title')}>Thống kê doanh thu</h1>
            <p className={cx('subtitle')}>Báo cáo chi tiết doanh thu và phân bổ dịch vụ.</p>
          </div>
        </header>

        <div className={cx('analytics-grid')}>
          <div className={cx('metric-card', 'revenue-card')}>
            <p className={cx('card-label')}>DOANH THU THỰC NHẬN</p>
            <h2 className={cx('revenue-value')}>{loading ? '---' : formatCurrency(revenue.totalRevenue)}</h2>
            <div className={cx('order-count')}>
              <span>{revenue.totalCompletedOrders} giao dịch thành công</span>
            </div>
          </div>

          <div className={cx('metric-card', 'distribution-card')}>
            <h3 className={cx('card-title')}>Phân bổ theo Gói cước</h3>
            <div className={cx('vertical-chart-container')}>
              {packageDist.map((item, index) => (
                <div key={index} className={cx('chart-column')}>
                  <div className={cx('bar-wrapper')}>
                    <div
                      className={cx('bar-active')}
                      style={{
                        height: `${item.percentage}%`,
                        backgroundColor: index % 2 === 0 ? '#1DB954' : '#0fe3ff',
                      }}
                    >
                      <span className={cx('tooltip')}>{item.percentage}%</span>
                    </div>
                  </div>
                  <span className={cx('column-label')}>{item.packageName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={cx('chart-section')}>
          <div className={cx('chart-header-flex')}>
            <h3 className={cx('card-title')}>Xu hướng doanh thu trong năm</h3>
            {hoveredMonth !== null && (
              <div className={cx('hover-info')}>
                <span className={cx('hover-month')}>{months[hoveredMonth]}: </span>
                <span className={cx('hover-value')}>{formatCurrency(monthlyRevenue[hoveredMonth]?.revenue)}</span>
              </div>
            )}
          </div>

          <div className={cx('line-chart-container')}>
            {!loading && monthlyRevenue.length > 0 && (
              <svg className={cx('line-chart')} preserveAspectRatio="none" viewBox="0 -30 1000 230">
                <defs>
                  <linearGradient id="mountainGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#1DB954" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1DB954" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={area} fill="url(#mountainGradient)" />
                <path d={line} stroke="#1DB954" fill="none" strokeWidth="4" strokeLinecap="round" />

                {points.map((p, i) => (
                  <rect
                    key={i}
                    x={p.x - 40}
                    y={0}
                    width={80}
                    height={200}
                    fill="transparent"
                    onMouseEnter={() => setHoveredMonth(i)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}

                {hoveredMonth !== null && (
                  <g>
                    <line
                      x1={points[hoveredMonth].x}
                      y1={-30}
                      x2={points[hoveredMonth].x}
                      y2={200}
                      stroke="rgba(255,255,255,0.1)"
                      strokeDasharray="4"
                    />
                    <circle
                      cx={points[hoveredMonth].x}
                      cy={points[hoveredMonth].y}
                      r="8"
                      fill="#1DB954"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </svg>
            )}
            <div className={cx('x-axis')}>
              {months.map((m, i) => (
                <span key={m} className={cx({ active: hoveredMonth === i })}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={cx('table-section')}>
          <h3 className={cx('card-title')}>Lịch sử Giao dịch Gần đây</h3>
          <div className={cx('custom-list')}>
            <div className={cx('list-header')}>
              <div className={cx('col-user')}>NGƯỜI DÙNG</div>
              <div className={cx('col-pkg')}>LOẠI GÓI</div>
              <div className={cx('col-amount')}>TỔNG TIỀN</div>
              <div className={cx('col-status')}>TRẠNG THÁI</div>
            </div>
            <LimitedList
              items={orders}
              renderItem={renderOrderRow}
              limit={5}
              wrapInRow={false}
              showAllText="Xem tất cả đơn hàng"
              showLessText="Thu gọn"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevenuesAnalytic;
