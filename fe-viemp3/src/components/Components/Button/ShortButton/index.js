import React from 'react';
import classNames from 'classnames/bind';
import styles from './ShortButton.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function ShortButton({ color, backgroundColor, borderColor, children, minWidth, maxWidth, onClick, type, href }) {
  const style = {
    color,
    backgroundColor,
    borderColor,
    minWidth: minWidth || '100px',
    maxWidth: maxWidth || '200px',
  };

  if (href) {
    // Mode link
    return (
      <Link to={href} className={cx('short-button')} style={style}>
        {children}
      </Link>
    );
  }

  // Mode button
  return (
    <button type={type || 'button'} onClick={onClick} className={cx('short-button')} style={style}>
      {children}
    </button>
  );
}

export default ShortButton;
