import React, { useRef, useState, useEffect } from 'react';
import styles from './Profile.module.scss';
import icons from '~/assets/icons';
import classNames from 'classnames/bind';
import { images } from '~/assets';
import { ShortButton } from '~/components/Components/Button';
import { apiGetProfile, apiUpdateProfile } from '~/api/services/serviceUsers';

const cx = classNames.bind(styles);

function Profile() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    avatar: '',
  });

  const [openPopup, setOpenPopup] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempAvatar, setTempAvatar] = useState('');
  const fileInputRef = useRef(null);

  // ===== GET PROFILE =====
  const handleGetProfile = async () => {
    try {
      console.log('=== FETCH PROFILE ===');

      const res = await apiGetProfile();
      console.log('Profile response:', res);

      if (res.success) {
        setUser(res.data);
      } else {
        console.error('API trả về success = false');
      }
    } catch (error) {
      console.error('Lỗi lấy profile:', error.message);
    }
  };

  // ===== UPDATE PROFILE =====
  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('username', tempName);
      if (fileInputRef.current.files[0]) {
        formData.append('avatar', fileInputRef.current.files[0]);
      }
      const res = await apiUpdateProfile(formData);
      if (res.success) {
        setUser(res.data);
        setOpenPopup(false);
        console.log('Cập nhật thành công');
      }
    } catch (error) {
      console.error('Lỗi update:', error.message);
    }
  };

  // gọi khi component mount
  useEffect(() => {
    handleGetProfile();
  }, []);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setTempAvatar(previewUrl);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={cx('profile-header')}>
      <div className="container">
        <div className={cx('profile-content', 'row align-items-center')}>
          <div className={cx('avatar-placeholder', 'col-12 col-md-4', 'text-center')}>
            <img
              src={user.avatar || images.avatarDefault}
              alt={user.username}
              className={cx('avatar-img', 'img-fluid rounded-circle')}
            />
          </div>

          <div className={cx('profile-info', 'col-12 col-md-8', 'text-center', 'text-md-start')}>
            <div className={cx('profile-label')}>Hồ sơ</div>
            <h1 className={cx('profile-name')}>{user.username}</h1>
            <div>Gmail: {user.email}</div>

            <div style={{ marginTop: '2%' }}>
              <ShortButton
                color="var(--white-color)"
                backgroundColor="var(--primary-color)"
                borderColor="var(--black-color-light-2)"
                onClick={() => {
                  setTempName(user.username);
                  setTempAvatar(user.avatar);
                  setOpenPopup(true);
                }}
              >
                Cập nhật thông tin
              </ShortButton>
            </div>
          </div>
        </div>
      </div>

      {/* ===== POPUP ===== */}
      {openPopup && (
        <div className={cx('popup-overlay')} onClick={() => setOpenPopup(false)}>
          <div className={cx('popup-box')} onClick={e => e.stopPropagation()}>
            <div className={cx('popup-header')}>
              <h3>Chi tiết hồ sơ</h3>
              <span className={cx('close-icon')} onClick={() => setOpenPopup(false)}>
                <i className={icons.iconXMark}></i>
              </span>
            </div>

            <div className={cx('popup-body')}>
              <div className={cx('popup-avatar')} onClick={openFileDialog}>
                <img src={tempAvatar || images.avatarDefault} alt="avatar" />
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />

              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                className={cx('popup-input')}
              />

              <div className={cx('popup-footer')}>
                <ShortButton
                  color="var(--white-color)"
                  backgroundColor="var(--primary-color)"
                  onClick={handleUpdateProfile}
                >
                  Lưu
                </ShortButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
