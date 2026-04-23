import React from 'react';
import classNames from 'classnames/bind';
import styles from './CircleCard.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function CircleCard({ content, cover, href }) {
  return (
    <Link to={href} className={cx('circle-card')}>
      <div className={cx('circle-cover-container')}>
        <img src={cover} alt={content} />
      </div>
      <div className={cx('circle-content')}>{content}</div>
    </Link>
  );
}

export default CircleCard;