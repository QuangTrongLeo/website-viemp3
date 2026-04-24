import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './PlayListSideBar.module.scss';
import icons from '~/assets/icons';
import SongItem from '~/components/Components/SongItem';

const cx = classNames.bind(styles);

function PlayListSideBar({ isShowPlayListSideBar, closePlayListSideBar, currentSong, nextSongs }) {
  const [flashClose, setFlashClose] = useState(false);

  const flashButton = setter => {
    setter(true);
    setTimeout(() => setter(false), 200);
  };

  return (
    <div
      className={cx('playlist-sidebar-container', {
        show: isShowPlayListSideBar,
        hide: !isShowPlayListSideBar,
      })}
    >
      {/* Header */}
      <div className={cx('playlist-sidebar-header')}>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="text-white mb-3" style={{ margin: '0.5%' }}>
            Bài đang phát
          </h6>

          <button
            className={cx('playlist-sidebar-btn', 'mb-3', 'me-2', { flash: flashClose })}
            onClick={() => {
              flashButton(setFlashClose);
              closePlayListSideBar();
            }}
          >
            <i className={icons.iconXMark}></i>
          </button>
        </div>

        {/* Bài đang phát */}
        {currentSong && <SongItem song={currentSong} />}

        <h6 className="text-white mt-3 mb-2" style={{ margin: '0 0.5%' }}>
          Bài tiếp theo
        </h6>
      </div>

      {/* Danh sách tiếp theo */}
      <div className={cx('playlist-sidebar-scrollable')}>
        {nextSongs.map(song => (
          <div key={song.songId} className="mb-2">
            <SongItem song={song} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayListSideBar;
