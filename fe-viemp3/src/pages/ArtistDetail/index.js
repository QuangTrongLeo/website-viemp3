import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ArtistDetail.module.scss';
import { icons } from '~/assets';
import SongItem from '~/components/Components/SongItem';
import LimitedList from '~/components/Components/LimitedList';
import { SquareCard } from '~/components/Components/Card';
import { apiGetSongsByArtist } from '~/api/services/serviceSongs';
import {
  apiGetArtistByName,
  apiGetMyFavoriteArtists,
  apiAddArtistToFavorite,
  apiRemoveArtistFromFavorite,
} from '~/api/services/serviceArtists';
import { apiGetAlbumsByArtist } from '~/api/services/serviceAlbums';

const cx = classNames.bind(styles);

function ArtistDetail() {
  const { artistName } = useParams();
  const decodedArtistName = decodeURIComponent(artistName);

  const [artist, setArtist] = useState(null);
  const [albumsByArtist, setAlbumsByArtist] = useState([]);
  const [songsByArtist, setSongsByArtist] = useState([]);
  const [latestSong, setLatestSong] = useState(null);

  const [artistLoading, setArtistLoading] = useState(true);
  const [albumsLoading, setAlbumsLoading] = useState(false);

  const [isFollowed, setIsFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('songs');

  // fetch artist
  const handleGetArtist = useCallback(async () => {
    try {
      setArtistLoading(true);
      const data = await apiGetArtistByName(decodedArtistName);
      setArtist(data);
    } catch (error) {
      console.error(error.message);
      setArtist(null);
    } finally {
      setArtistLoading(false);
    }
  }, [decodedArtistName]);

  // fetch songs
  const handleGetSongsByArtist = useCallback(async () => {
    if (!artist?.id) return;

    try {
      const data = await apiGetSongsByArtist(artist.id);

      setSongsByArtist(data);

      // lấy bài mới nhất
      const latest = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      setLatestSong(latest);
    } catch (error) {
      console.error(error.message);
      setSongsByArtist([]);
      setLatestSong(null);
    }
  }, [artist]);

  const handleAlbumsByArtist = useCallback(async () => {
    if (!artist?.id) return;

    try {
      setAlbumsLoading(true);
      const data = await apiGetAlbumsByArtist(artist.id);
      setAlbumsByArtist(data);
    } catch (error) {
      console.error(error.message);
      setAlbumsByArtist([]);
    } finally {
      setAlbumsLoading(false);
    }
  }, [artist]);

  const checkIsFollowed = useCallback(async () => {
    if (!artist?.id) return;

    try {
      const favoriteList = await apiGetMyFavoriteArtists();
      const isExist = favoriteList.some(fav => String(fav.artist.id) === String(artist.id));
      setIsFollowed(isExist);
    } catch (error) {
      console.error(error.message);
      setIsFollowed(false);
    }
  }, [artist]);

  useEffect(() => {
    handleGetArtist();
  }, [handleGetArtist]);

  useEffect(() => {
    handleGetSongsByArtist();
  }, [handleGetSongsByArtist]);

  useEffect(() => {
    handleAlbumsByArtist();
  }, [handleAlbumsByArtist]);

  useEffect(() => {
    if (artist?.id) checkIsFollowed();
  }, [artist, checkIsFollowed]);

  const popularSongs = [...songsByArtist].sort((a, b) => b.favorites - a.favorites);

  const toggleFollow = async () => {
    if (!artist?.id || followLoading) return;

    try {
      setFollowLoading(true);

      let success = false;

      if (!isFollowed) {
        success = await apiAddArtistToFavorite(artist.id);
      } else {
        success = await apiRemoveArtistFromFavorite(artist.id);
      }

      if (success) {
        setIsFollowed(prev => !prev);

        setArtist(prev => ({
          ...prev,
          favorites: isFollowed ? Math.max((prev.favorites ?? 1) - 1, 0) : (prev.favorites ?? 0) + 1,
        }));
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setFollowLoading(false);
    }
  };

  if (artistLoading) return <div>Đang tải...</div>;
  if (!artist) return <div>Không tìm thấy nghệ sĩ...</div>;

  return (
    <div className={cx('artist-detail', 'py-4')}>
      {/* header */}
      <div className={cx('artist-detail-header', 'd-flex', 'align-items-center', 'gap-4', 'mb-4')}>
        <img src={artist.avatar || ''} alt={artist.name} className={cx('avatar')} />

        <div>
          <h1 className={cx('artist-name')}>{artist.name}</h1>

          <p className={cx('followers')}>{(artist.favorites ?? 0).toLocaleString('vi-VN')} người đang theo dõi</p>

          <button className={cx('follow-btn')} onClick={toggleFollow} disabled={followLoading}>
            <i className={cx(isFollowed ? icons.iconCheck : icons.iconUserPlus, 'me-1')}></i>
            {followLoading ? 'Đang xử lý...' : isFollowed ? 'Đang theo dõi' : 'Theo dõi'}
          </button>
        </div>
      </div>

      {/* tab */}
      <div className={cx('tab-header')}>
        <div className={cx('tab-item', { active: activeTab === 'songs' })} onClick={() => setActiveTab('songs')}>
          BÀI HÁT
        </div>

        <div className={cx('tab-item', { active: activeTab === 'albums' })} onClick={() => setActiveTab('albums')}>
          ALBUM
        </div>
      </div>

      <div className="row">
        {activeTab === 'songs' && (
          <>
            {/* bài mới */}
            <div className="col-md-4 mb-4">
              <h5 className={cx('section-title', 'mb-4')}>Mới Phát Hành</h5>
              {latestSong && (
                <Link to={`/song/${latestSong.id}`} className={cx('release-card-link')}>
                  <div className={cx('release-card')}>
                    <img src={latestSong.cover} alt={latestSong.title} className={cx('release-cover')} />
                    <div className="mt-3">
                      <strong>{latestSong.title}</strong>
                      <p className="mb-0">{artist.name}</p>
                      <small>{new Date(latestSong.createdAt).toLocaleDateString('vi-VN')}</small>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* bài nổi bật */}
            <div className="col-md-8">
              <h5 className={cx('section-title')}>Bài Hát Nổi Bật</h5>
              <LimitedList
                items={popularSongs}
                limit={10}
                wrapInRow
                renderItem={song => (
                  <div className="col-md-6 mb-3" key={song.id}>
                    <SongItem song={song} />
                  </div>
                )}
              />
            </div>
          </>
        )}

        {activeTab === 'albums' && (
          <>
            <h5 className={cx('section-title', 'mb-4')}>Albums của {artist.name}</h5>

            {albumsLoading ? (
              <div>Đang tải album...</div>
            ) : (
              <LimitedList
                items={albumsByArtist}
                limit={8}
                renderItem={album => (
                  <div key={album.id} className="col-6 col-sm-4 col-lg-3 mb-3 d-flex justify-content-center">
                    <SquareCard
                      content={album.title}
                      cover={album.cover}
                      href={`/album/${album.id}`}
                      icon={<i className="fas fa-list fa-3x"></i>}
                    />
                  </div>
                )}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ArtistDetail;
