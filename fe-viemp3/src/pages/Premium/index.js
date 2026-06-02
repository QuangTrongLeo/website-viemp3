import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Premium.module.scss';
import classNames from 'classnames/bind';
import icons from '~/assets/icons';
import config from '~/config';
import PackageModal from '~/components/Components/PackageModal';
import { useAuth } from '~/components/Components/AuthProvider';
import { images } from '~/assets';
import { apiGetPackages } from '~/api/services/servicePackages';
import { apiCheckUserIsStudent } from '~/api/services/serviceUsers';

const cx = classNames.bind(styles);

const DURATION_MAP = {
  ONE_MONTH: '1 tháng',
  THREE_MONTHS: '3 tháng',
  SIX_MONTHS: '6 tháng',
};

const formatPrice = price => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price).replace('₫', 'đ');
};

function Premium() {
  const { roles } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const featuresMap = {
    INDIVIDUAL: ['Nghe nhạc không quảng cáo', 'Tải xuống ngoại tuyến', 'Âm thanh cực cao'],
    STUDENT: ['Tất cả quyền lợi gói Cá nhân', 'Giá ưu đãi dành cho sinh viên', 'Xác thực hàng năm'],
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await apiGetPackages();
        setPackages(data);
      } catch (error) {
        console.error('Lỗi khi lấy gói cước:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Phân loại gói dùng useMemo để tối ưu performance
  const individualOptions = useMemo(() => packages.filter(p => p.packageType === 'INDIVIDUAL'), [packages]);

  const studentOptions = useMemo(() => packages.filter(p => p.packageType === 'STUDENT'), [packages]);

  const handleSubscribeClick = async (planName, pkg) => {
    if (!roles || roles.length === 0) {
      navigate(config.routes.login);
      return;
    }

    if (pkg.packageType === 'STUDENT') {
      const isStudent = await apiCheckUserIsStudent();

      if (!isStudent) {
        alert(
          'Tài khoản của bạn không phải là email sinh viên. Vui lòng sử dụng email sinh viên để đăng ký gói ưu đãi này!'
        );
        return;
      }
    }

    setSelectedPlan({
      planName,
      id: pkg.id,
      duration: DURATION_MAP[pkg.duration],
      price: formatPrice(pkg.finalPrice),
      discount: pkg.discountPercent,
    });
    setShowModal(true);
  };

  const renderCard = (title, type, options, badge) => {
    const features = featuresMap[type];

    return (
      <div className={cx('card')}>
        <div className={cx('card-header')}>
          <div className={cx('header-left')}>
            <img src={images.logo} className={cx('avatar')} alt={title} />
            <h2 className={cx('plan-name')}>{title}</h2>
          </div>
          {badge && <span className={cx('badge')}>{badge}</span>}
        </div>

        <div className={cx('options-list')}>
          {options.length > 0 ? (
            options.map(opt => (
              <div key={opt.id} className={cx('option-item')}>
                <div>
                  <div className={cx('duration')}>{DURATION_MAP[opt.duration]}</div>
                  <div className={cx('desc')} style={{ color: '#adaaaa', fontSize: '0.8rem' }}>
                    {opt.discountPercent > 0 ? `Tiết kiệm ${opt.discountPercent}%` : 'Thanh toán định kỳ'}
                  </div>
                </div>
                <div className="text-right d-flex flex-column align-items-end">
                  <span className={cx('price')}>{formatPrice(opt.finalPrice)}</span>
                  <button className={cx('btn-subscribe')} onClick={() => handleSubscribeClick(title, opt)}>
                    {roles && roles.length > 0 ? 'Đăng ký' : 'Đăng nhập để đăng ký'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center">Đang tải gói cước...</div>
          )}
        </div>

        <ul className={cx('feature-list')}>
          {features.map((feature, index) => (
            <li key={index}>
              <i className={cx(icons.iconCheck)} style={{ color: 'var(--primary-color)' }}></i>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) return <div className="text-center p-5">Đang tải dữ liệu...</div>;

  return (
    <div className={cx('premium-container')}>
      <section className={cx('hero')}>
        <h1 className={cx('title')}>Nâng cấp lên Premium</h1>
        <p className={cx('subtitle')}>
          Trải nghiệm âm nhạc đỉnh cao không quảng cáo, tải xuống ngoại tuyến và tận hưởng chất lượng âm thanh Hi-Fi
          chân thực nhất.
        </p>
      </section>

      <section className={cx('pricing-grid')}>
        {renderCard('Gói Cá nhân', 'INDIVIDUAL', individualOptions, 'Phổ biến')}
        {renderCard('Gói Sinh viên', 'STUDENT', studentOptions, 'Tiết kiệm')}
      </section>

      <PackageModal show={showModal} onClose={() => setShowModal(false)} data={selectedPlan} />
    </div>
  );
}

export default Premium;
