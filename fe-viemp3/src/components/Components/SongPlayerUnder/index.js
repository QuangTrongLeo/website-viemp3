import { Dropdown, initMDB } from 'mdb-ui-kit';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import icons from '~/assets/icons';
import * as bootstrap from 'bootstrap';
import './SongPlayerUnder.scss';
import PlayerControls from '../PlayerControls';
import { useAuth } from '~/components/Components/AuthProvider';
import {
  apiGetSong,
  apiGetMyFavoriteSongs,
  apiAddSongToFavorite,
  apiRemoveSongFromFavorite,
} from '~/api/services/serviceSongs';
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

  // --- TẢI VÀ PHÁT NHẠC ---
  const loadAndPlaySong = useCallback(
    async id => {
      if (!id) return;
      try {
        const song = await apiGetSong(id);
        setCurrentSong(song);
        setClosedSongPlayerUnder(false);

        // Reset progress về 0
        setCurrentTime(0);
        setProgressTime(0);

        // Đợi DOM cập nhật src cho thẻ audio rồi mới phát
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current
              .play()
              .then(() => setIsPaused(false))
              .catch(err => console.warn('Không thể tự động phát:', err));
          }
        }, 100);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu bài hát:', error);
      }
    },
    [setCurrentSong]
  );

  // --- XỬ LÝ KHI KẾT THÚC BÀI HÁT ---
  const handleAudioEnded = () => {
    if (mode === 'repeat') {
      loadAndPlaySong(currentSong.id);
    } else {
      if (typeof onEndedAudio === 'function') {
        onEndedAudio();
      }
    }
  };

  // --- THEO DÕI THAY ĐỔI URL (songId) ---
  useEffect(() => {
    if (songId) {
      // Nếu bài hát đang phát khác bài trong URL thì mới load mới
      if (!currentSong || String(currentSong.id) !== String(songId)) {
        loadAndPlaySong(songId);
      } else {
        setClosedSongPlayerUnder(false);
      }
    }
  }, [songId, currentSong, loadAndPlaySong]);

  // --- TẢI THÔNG TIN NGHỆ SĨ ---
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

  // --- TẢI DANH SÁCH YÊU THÍCH ---
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await apiGetMyFavoriteSongs();
        setFavoriteSongs(data || []);
      } catch (error) {
        console.error('Lỗi lấy danh sách yêu thích:', error);
      }
    };
    if (currentSong) fetchFavorites();
  }, [currentSong]);

  // --- KIỂM TRA TRẠNG THÁI LIKE ---
  useEffect(() => {
    if (!currentSong) return;
    const isLiked = favoriteSongs.some(fav => String(fav.song.id) === String(currentSong.id));
    setLikedVisible(isLiked);
  }, [currentSong, favoriteSongs]);

  // --- DOWNLOAD ---
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

  // --- TOGGLE FAVORITE ---
  const handleToggleFavorite = async () => {
    if (!currentSong?.id) return;
    try {
      if (likedVisible) {
        const success = await apiRemoveSongFromFavorite(currentSong.id);
        if (success) {
          setFavoriteSongs(prev => prev.filter(f => String(f.song.id) !== String(currentSong.id)));
        }
      } else {
        const success = await apiAddSongToFavorite(currentSong.id);
        if (success) {
          setFavoriteSongs(prev => [...prev, { song: currentSong }]);
        }
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật yêu thích:', error);
    }
  };

  // --- PHÁT / TẠM DỪNG ---
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPaused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsPaused(prev => !prev);
  };

  const toggleShuffle = () => setMode(prev => (prev === 'shuffle' ? null : 'shuffle'));
  const toggleRepeat = () => setMode(prev => (prev === 'repeat' ? null : 'repeat'));

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
    return () => tooltipList.forEach(t => t.dispose());
  }, [currentSong]);

  const flashButton = setter => {
    setter(true);
    setTimeout(() => setter(false), 300);
  };

  const handleClickTimeBar = e => {
    const bar = timeRef.current;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = durationAudio * percent;
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const handleClosePlayerUnder = () => {
    flashButton(setFlashClose);
    if (audioRef.current) audioRef.current.pause();
    setIsPaused(true);
    setClosedSongPlayerUnder(true);
    closePlayListSideBar();
  };

  const formatTimeBar = seconds => {
    seconds = Math.floor(seconds || 0);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-bottom navbar-song-player ${closedSongPlayerUnder ? 'slide-down-song-player' : ''}`}
    >
      <div className="container-fluid">
        <div className="row w-100">
          <div className="col-4 d-flex align-items-center">
            <div className="navbar-brand me-2 mb-1">
              <img
                src={currentSong.cover}
                height="60"
                alt="Cover"
                style={{ borderRadius: '6px', border: '2px solid #333' }}
              />
            </div>
            <div className="song-info-wrapper">
              <Link to={`/song/${currentSong.id}`} className="link-song-hover-color">
                <h5 className="text-ellipsis">{currentSong.title}</h5>
              </Link>
              <Link to={`/artist/${artist?.name}`} className="link-artist-hover-color">
                <p style={{ fontSize: '14px' }}>{artist?.name}</p>
              </Link>
            </div>
          </div>

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

          <div className="col-3 d-flex justify-content-end align-items-center gap-1">
            <button
              className={`icon-song-player-right-element-btn ${likedVisible ? 'active' : ''}`}
              onClick={handleToggleFavorite}
              title="Thích"
            >
              <i className={icons.iconHeart}></i>
            </button>
            {isPremium && (
              <button className="icon-song-player-right-element-btn" onClick={handleDownload} title="Tải nhạc">
                <i className={icons.iconDownload}></i>
              </button>
            )}
            <button
              className={`icon-song-player-right-element-btn ${isShowPlayListSideBar ? 'active' : ''}`}
              onClick={togglePlayListSidebar}
              title="Danh sách phát"
            >
              <i className={icons.iconBars}></i>
            </button>
            <button
              className={`icon-song-player-right-element-btn ${flashClose ? 'flash' : ''}`}
              onClick={handleClosePlayerUnder}
              title="Đóng"
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
