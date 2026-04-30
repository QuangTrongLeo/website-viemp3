import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ArtistDetail.module.scss';
import { apiGetArtistByName } from '~/api/services/serviceArtists';

const cx = classNames.bind(styles);

function ArtistDetail() {
  const { artistName } = useParams();
  const decodedArtistName = decodeURIComponent(artistName);

  const [artist, setArtist] = useState(null);
  const [artistLoading, setArtistLoading] = useState(true);

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

  useEffect(() => {
    handleGetArtist();
  }, [handleGetArtist]);

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
        </div>
      </div>
    </div>
  );
}

export default ArtistDetail;
