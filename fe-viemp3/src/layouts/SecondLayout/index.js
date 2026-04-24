import React from 'react';
import BaseLayout from '../BaseLayout';
import styles from './SecondLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function SecondLayout({ children }) {
  return (
    <BaseLayout
      renderMainContent={() => (
        <div className={cx('container-fluid')} style={{ paddingTop: '80px' }}>
          <div className={cx('row')} style={{ minHeight: 'calc(100vh - 80px)' }}>
            <div className={cx('col-8', 'col-md-8', 'col-lg-8', 'mx-auto')}>
              <div className={cx('content')}>{children}</div>
            </div>
          </div>
        </div>
      )}
    />
  );
}

export default SecondLayout;
