import { Dropdown, initMDB } from 'mdb-ui-kit';
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import icons from '~/assets/icons';
import * as bootstrap from 'bootstrap';
import './SongPlayerUnder.scss';
import PlayerControls from '../PlayerControls';
import { useAuth } from '~/components/Components/AuthProvider';
import { apiGetSong } from '~/api/services/serviceSongs';
import { apiGetArtist } from '~/api/services/serviceArtists';

initMDB({ Dropdown });

function SongPlayerUnder({
  isShowPlayListSideBar,
  togglePlayListSidebar,
  closePlayListSideBar,
  currentSong,
  setCurrentSong,
  mode,
  setMode,
  onEndedAudio,
  onNextSong,
  onPrevSong,
}) {
  const { songId } = useParams();
  const { roles } = useAuth();
  const isPremium = roles?.includes('PREMIUM');

  const timeRef = useRef(null);
  const audioRef = useRef(null);

  const [durationAudio, setDurationAudio] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [progressTime, setProgressTime] = useState(0);
  const [flashPrev, setFlashPrev] = useState(false);
  const [flashNext, setFlashNext] = useState(false);
  const [flashClose, setFlashClose] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [likedVisible, setLikedVisible] = useState(false);
  const [closedSongPlayerUnder, setClosedSongPlayerUnder] = useState(true);
  const [artist, setArtist] = useState(null);
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  const handleDownload = () => {
    if (!isPremium) {
      alert('Chỉ tài khoản PREMIUM mới được tải nhạc!');
      return;
    }

    if (!currentSong?.audio) return;

    const link = document.createElement('a');
    link.href = currentSong.audio;
    link.download = `${currentSong.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleFavorite = async () => {
    // if (!currentSong?.id) return;
    // try {
    //   if (likedVisible) {
    //     const success = await apiRemoveSongFromFavorite(currentSong.id);
    //     if (success) {
    //       setFavoriteSongs(prev => prev.filter(f => String(f.song.id) !== String(currentSong.id)));
    //     }
    //   } else {
    //     const success = await apiAddSongToFavorite(currentSong.id);
    //     if (success) {
    //       setFavoriteSongs(prev => [...prev, { song: currentSong }]);
    //     }
    //   }
    // } catch (error) {
    //   console.error('Lỗi khi cập nhật yêu thích:', error);
    // }
  };

  //////// TOGGLE ////////
  const toggleShuffle = () => {
    setMode(prev => (prev === 'shuffle' ? null : 'shuffle'));
  };
  const toggleRepeat = () => {
    setMode(prev => (prev === 'repeat' ? null : 'repeat'));
  };
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPaused) {
      if (audioRef.current.currentTime === audioRef.current.duration) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        setProgressTime(0);
      }
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsPaused(prev => !prev);
  };

  //////// TOOLTIP ////////
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(el => {
      const tooltip = new bootstrap.Tooltip(el, {
        placement: 'top',
        fallbackPlacements: [],
        delay: { show: 0, hide: 0 },
      });
      el.addEventListener('mouseleave', () => tooltip.hide());
      return tooltip;
    });
    return () => tooltipList.forEach(t => t.dispose());
  }, []);

  useEffect(() => {
    const el = document.querySelector('.play-pause-btn');
    if (!el) return;
    const tooltip = bootstrap.Tooltip.getInstance(el);
    if (tooltip) {
      el.setAttribute('data-bs-title', isPaused ? 'Phát' : 'Tạm dừng');
      tooltip.setContent({
        '.tooltip-inner': isPaused ? 'Phát' : 'Tạm dừng',
      });
    }
  }, [isPaused]);

  //////// PROGRESS ////////
  useEffect(() => {
    setProgressTime((currentTime / durationAudio) * 100 || 0);
  }, [currentTime, durationAudio]);

  //////// LOAD SONG ////////
  useEffect(() => {
    const fetchSong = async () => {
      if (!songId) return;
      try {
        const song = await apiGetSong(songId);
        if (currentSong && String(currentSong.id) === String(songId)) {
          setClosedSongPlayerUnder(false);
          return;
        }
        setCurrentSong(song);
        if (song) {
          setClosedSongPlayerUnder(false);
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(err => console.warn('Không thể tự phát:', err));
            }
          }, 0);
          setIsPaused(false);
        }
      } catch (error) {
        console.error('Không tìm thấy bài hát:', error);
      }
    };
    fetchSong();
  }, [songId]);

  //////// LOAD ARTIST ////////
  useEffect(() => {
    const fetchArtist = async () => {
      if (!currentSong?.artistId) return;
      try {
        const artistData = await apiGetArtist(currentSong.artistId);
        setArtist(artistData);
      } catch (error) {
        console.error('Không lấy được artist:', error);
      }
    };
    fetchArtist();
  }, [currentSong]);

  // useEffect(() => {
  //   const fetchFavorites = async () => {
  //     try {
  //       const data = await apiGetMyFavoriteSongs();
  //       setFavoriteSongs(data || []);
  //     } catch (error) {
  //       console.error('Không lấy được favorite songs:', error);
  //     }
  //   };

  //   if (currentSong) {
  //     fetchFavorites();
  //   }
  // }, [currentSong]);

  // useEffect(() => {
  //   if (!currentSong) return;
  //   const isLiked = favoriteSongs.some(fav => String(fav.song.id) === String(currentSong.id));
  //   setLikedVisible(isLiked);
  // }, [currentSong, favoriteSongs]);

  //////// AUTO PLAY ////////
  useEffect(() => {
    if (!audioRef.current) return;
    if (!currentSong) {
      setClosedSongPlayerUnder(true);
      return;
    }
    setClosedSongPlayerUnder(false);
    const playAfterLoad = () => {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.warn('Audio auto-play failed:', err));
      audioRef.current.removeEventListener('loadedmetadata', playAfterLoad);
    };
    audioRef.current.addEventListener('loadedmetadata', playAfterLoad);
  }, [currentSong]);

  if (!currentSong) return null;

  //////// UTILS ////////
  const flashButton = setter => {
    setter(true);
    setTimeout(() => setter(false), 300);
  };

  const handleAudioEnded = () => {
    if (mode === 'repeat') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setCurrentTime(0);
      setProgressTime(0);
    } else {
      if (typeof onEndedAudio === 'function') {
        onEndedAudio();
      }
    }
  };

  const handleClickTimeBar = e => {
    const bar = timeRef.current;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = durationAudio * percent;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleClosePlayerUnder = () => {
    flashButton(setFlashClose);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPaused(true);
    setClosedSongPlayerUnder(true);
    closePlayListSideBar();
  };

  const formatTimeBar = seconds => {
    seconds = Math.floor(seconds);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-bottom navbar-song-player ${
        closedSongPlayerUnder ? 'slide-down-song-player' : ''
      }`}
    >
      <div className="container-fluid">
        <div className="row w-100">
          {/* LEFT */}
          <div className="col-4 d-flex align-items-center">
            <div className="navbar-brand me-2 mb-1 d-flex align-items-center">
              <img
                src={currentSong.cover}
                height="60"
                alt="VieMp3"
                loading="lazy"
                style={{
                  marginTop: '2px',
                  border: '2px solid var(--black-color-light-1)',
                  borderRadius: '6px',
                }}
              />
            </div>

            <div className="song-info-wrapper">
              <Link to={`/song/${currentSong.id}`} className="link-song-hover-color">
                <h5 className="text-ellipsis">{currentSong.title}</h5>
              </Link>

              <Link to={`/artist/${artist?.name}`} className="link-artist-hover-color">
                <p style={{ fontSize: '14px', marginTop: '2%' }}>{artist?.name}</p>
              </Link>
            </div>
          </div>

          {/* CENTER */}
          <div className="col-5 d-flex justify-content-center position-relative">
            <PlayerControls
              audioRef={audioRef}
              song={currentSong}
              mode={mode}
              isPaused={isPaused}
              flashPrev={flashPrev}
              flashNext={flashNext}
              progressTime={progressTime}
              currentTime={currentTime}
              durationAudio={durationAudio}
              timeRef={timeRef}
              toggleShuffle={toggleShuffle}
              toggleRepeat={toggleRepeat}
              togglePlayPause={togglePlayPause}
              flashButton={flashButton}
              setFlashPrev={setFlashPrev}
              setFlashNext={setFlashNext}
              formatTimeBar={formatTimeBar}
              handleClickTimeBar={handleClickTimeBar}
              setDurationAudio={setDurationAudio}
              setCurrentTime={setCurrentTime}
              setProgressTime={setProgressTime}
              onEndedAudio={handleAudioEnded}
              onNextSong={onNextSong}
              onPrevSong={onPrevSong}
            />
          </div>

          {/* RIGHT */}
          <div className="col-3 d-flex justify-content-end align-items-center gap-1">
            <button
              className={`icon-song-player-right-element-btn ${likedVisible ? 'active' : ''}`}
              data-bs-toggle="tooltip"
              title="Thích"
              onClick={handleToggleFavorite}
            >
              <i className={icons.iconHeart}></i>
            </button>

            {isPremium && (
              <button
                className="icon-song-player-right-element-btn"
                data-bs-toggle="tooltip"
                title="Tải nhạc"
                onClick={handleDownload}
              >
                <i className={icons.iconDownload}></i>
              </button>
            )}

            <button
              className={`icon-song-player-right-element-btn ${isShowPlayListSideBar ? 'active' : ''}`}
              data-bs-toggle="tooltip"
              title="Danh sách phát"
              onClick={togglePlayListSidebar}
            >
              <i className={icons.iconBars}></i>
            </button>

            <button
              className={`icon-song-player-right-element-btn ${flashClose ? 'flash' : ''}`}
              data-bs-toggle="tooltip"
              title="Đóng"
              onClick={handleClosePlayerUnder}
            >
              <i className={icons.iconXMark}></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default SongPlayerUnder;
