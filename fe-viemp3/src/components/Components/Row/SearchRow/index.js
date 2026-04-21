import React from 'react';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function SearchRow({ type, id, cover, content, desc, onClick }) {
  let path = '';

  if (type === 'artist') {
    path = `/artist/${encodeURIComponent(content)}`;
  } else if (type === 'song') {
    path = `/song/${id}`;
  } else if (type === 'album') {
    path = `/album/${id}`;
  }

  return (
    <Link to={path} className={cx('search-row-link')} onClick={onClick}>
      <div className={cx('search-row', 'd-flex', 'align-items-center', 'px-3', 'py-1')}>
        <img
          src={cover}
          alt={content}
          className={cx('search-row-cover', 'me-3', { 'artist-avatar': type === 'artist' })}
        />

        <div>
          <div className={cx('search-row-content')}>{content}</div>
          <div className={cx('search-row-desc', 'small')}>{desc}</div>
        </div>
      </div>
    </Link>
  );
}

export default SearchRow;
