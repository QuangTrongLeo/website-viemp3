import React from 'react';
import icons from '~/assets/icons';
import classNames from 'classnames/bind';
import styles from './SquareCard.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function SquareCard({ content, desc, cover, href, icon }) {
  return (
    <Link to={href} className={cx('square-card')}>
      <div className={cx('square-cover-container')}>
        {cover ? (
          <img src={cover} alt={content} />
        ) : (
          <div className={cx('icon-placeholder')}>{icon || <i className={`${icons.iconImage} fa-3x`}></i>}</div>
        )}
      </div>
      <div className={cx('square-content')}>{content}</div>
      <div className={cx('square-desc')}>{desc}</div>
    </Link>
  );
}

export default SquareCard;
