// import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './NotificationBar.module.scss';
import icons from '~/assets/icons';

const cx = classNames.bind(styles);

function NotificationBar({ notification, visible, icon }) {
  if (!notification) return null;

  // Nếu không truyền icon, dùng mặc định
  const IconClass = icon || icons.iconCheck;

  return (
    <div className={cx('notification-wrapper', { visible, hidden: !visible })} aria-live="polite">
      <div className={cx('notification-content')}>
        <span className={cx('notification-icon')}>
          <i className={cx(IconClass)}></i>
        </span>
        <span className={cx('notification-text')}>{notification}</span>
      </div>
    </div>
  );
}

export default NotificationBar;
