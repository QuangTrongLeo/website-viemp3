import React from 'react';
import classNames from 'classnames/bind';
import styles from './PlayerControls.module.scss';
import icons from '~/assets/icons';

const cx = classNames.bind(styles);

function PlayerControls({
  audioRef,
  song,
  mode,
  isPaused,
  flashPrev,
  flashNext,
  progressTime,
  currentTime,
  durationAudio,
  timeRef,
  toggleShuffle,
  toggleRepeat,
  togglePlayPause,
  flashButton,
  setFlashPrev,
  setFlashNext,
  formatTimeBar,
  handleClickTimeBar,
  setDurationAudio,
  setCurrentTime,
  setProgressTime,
  onEndedAudio,
  onNextSong,
  onPrevSong,
}) {
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      if (!isNaN(duration)) {
        setDurationAudio(duration);
      }
    }
  };

  return (
    <>
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={song.audio}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEndedAudio}
        onTimeUpdate={e => {
          const audio = e.target;
          setCurrentTime(audio.currentTime);
          setProgressTime((audio.currentTime / audio.duration) * 100);
        }}
      />

      {/* Control buttons */}
      <div className="d-flex" style={{ height: '100%' }}>
        <ul className="navbar-nav flex-row">
          {/* Shuffle */}
          <li className="nav-item mx-1 mx-sm-2 mx-md-3">
            <button
              className={cx('player-btn', { active: mode === 'shuffle' })}
              data-bs-toggle="tooltip"
              title="Phát ngẫu nhiên"
              onClick={toggleShuffle}
            >
              <i className={icons.iconShuffle}></i>
            </button>
          </li>

          {/* Previous */}
          <li className="nav-item mx-1 mx-sm-2 mx-md-3">
            <button
              className={cx('player-btn', { flash: flashPrev })}
              data-bs-toggle="tooltip"
              title="Bài trước"
              onClick={() => {
                flashButton(setFlashPrev);
                onPrevSong?.();
              }}
            >
              <i className={icons.iconBackwardStep}></i>
            </button>
          </li>

          {/* Play/Pause */}
          <li className="nav-item mx-1 mx-sm-2 mx-md-3">
            <button
              className={cx('play-pause-btn')}
              data-bs-toggle="tooltip"
              title={isPaused ? 'Phát' : 'Tạm dừng'}
              onClick={togglePlayPause}
            >
              <i className={`${isPaused ? icons.iconPlay : icons.iconPause}`}></i>
            </button>
          </li>

          {/* Next */}
          <li className="nav-item mx-1 mx-sm-2 mx-md-3">
            <button
              className={cx('player-btn', { flash: flashNext })}
              data-bs-toggle="tooltip"
              title="Bài tiếp theo"
              onClick={() => {
                flashButton(setFlashNext);
                onNextSong?.();
              }}
            >
              <i className={icons.iconForwardStep}></i>
            </button>
          </li>

          {/* Repeat */}
          <li className="nav-item mx-1 mx-sm-2 mx-md-3">
            <button
              className={cx('player-btn', { active: mode === 'repeat' })}
              title="Phát lại"
              onClick={toggleRepeat}
              style={{ position: 'relative' }}
            >
              <i className={icons.iconRepeat}></i>
              {mode === 'repeat' && <span className={cx('repeat-badge')}>1</span>}
            </button>
          </li>
        </ul>
      </div>

      {/* Time Bar */}
      <div className={cx('progress-time-bar-center', 'position-absolute', 'mt-2')}>
        <span className={cx('time-text')}>{formatTimeBar(currentTime)}</span>

        <div className={cx('progress-bar-wrapper')} ref={timeRef} onClick={handleClickTimeBar}>
          <div className={cx('progress-bar-fill')} style={{ width: `${progressTime}%` }}></div>
        </div>

        <span className={cx('time-text')}>{formatTimeBar(durationAudio)}</span>
      </div>
    </>
  );
}

export default PlayerControls;
