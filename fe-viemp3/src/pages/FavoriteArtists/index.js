import React, { useEffect, useState, useCallback } from 'react';
import icons from '~/assets/icons';
import styles from './FavoriteArtists.module.scss';
import classNames from 'classnames/bind';
import LimitedList from '~/components/Components/LimitedList';
import { CircleCard } from '~/components/Components/Card';
import { apiGetMyFavoriteArtists } from '~/api/services/serviceArtists';

const cx = classNames.bind(styles);

function FavoriteArtists() {
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleGetMyFavoriteArtists = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGetMyFavoriteArtists();
      console.log(data);
      if (!data) {
        setFavoriteArtists([]);
        return;
      }
      const sorted = [...data].sort((a, b) => new Date(b.favoritedAt) - new Date(a.favoritedAt));
      setFavoriteArtists(sorted);
    } catch (error) {
      console.error(error.message);
      setFavoriteArtists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetMyFavoriteArtists();
  }, [handleGetMyFavoriteArtists]);

  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  return (
    <>
      <h1 className="text-center mb-4">
        <i className={icons.iconStar}></i>
        <span style={{ paddingLeft: '10px' }}>Nghệ sĩ yêu thích của bạn</span>
      </h1>

      <section className={cx('section-block')}>
        {favoriteArtists.length === 0 ? (
          <div className="text-center py-5">
            <i className={`${icons.iconStar} mb-3`} style={{ fontSize: '40px', opacity: 0.5 }}></i>
            <h5>Bạn chưa theo dõi nghệ sĩ nào</h5>
            <p className="text-muted">
              Hãy khám phá và theo dõi những nghệ sĩ bạn yêu thích để cập nhật nhạc mới nhất 🎵
            </p>
          </div>
        ) : (
          <LimitedList
            items={favoriteArtists}
            limit={8}
            renderItem={item => {
              const artist = item.artist;
              return (
                <div key={item.id} className="col-6 col-sm-4 col-md-3 mb-3 d-flex justify-content-center">
                  <CircleCard
                    content={artist.name}
                    cover={artist.avatar}
                    href={`/artist/${encodeURIComponent(artist.name)}`}
                  />
                </div>
              );
            }}
          />
        )}
      </section>
    </>
  );
}

export default FavoriteArtists;
