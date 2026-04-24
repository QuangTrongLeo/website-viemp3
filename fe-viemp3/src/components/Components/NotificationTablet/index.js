import React from 'react';
import classNames from 'classnames/bind';
import styles from './NotificationTablet.module.scss';

const cx = classNames.bind(styles);

function NotificationTablet({ visible, notifications }) {
  if (!visible) return null;

  return (
    <div className={cx('notification-tablet')}>
      <h4 className={cx('title')}>Thông báo</h4>
      <ul className={cx('notification-list')}>
        {notifications.map((notif, idx) => (
          <li key={idx} className={cx('notification-item')}>
            <img src={notif.avatar} alt="" className={cx('notif-avatar')} />
            <div className={cx('notif-content')}>
              <p className={cx('notif-title')}>{notif.title}</p>
              <span className={cx('notif-time')}>{notif.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationTablet;
