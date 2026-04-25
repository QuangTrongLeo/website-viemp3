import React, { useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './HorizontalScroll.module.scss';

const cx = classNames.bind(styles);

function HorizontalScroll({ children }) {
  const scrollRef = useRef(null);

  const scroll = direction => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={cx('scroll-wrapper')}>
      <button className={cx('scroll-btn', 'left')} onClick={() => scroll('left')}>
        &lt;
      </button>
      <div className={cx('scroll-container')} ref={scrollRef}>
        {children}
      </div>
      <button className={cx('scroll-btn', 'right')} onClick={() => scroll('right')}>
        &gt;
      </button>
    </div>
  );
}

export default HorizontalScroll;
