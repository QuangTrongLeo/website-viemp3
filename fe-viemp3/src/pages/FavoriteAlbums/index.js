import React, { useEffect, useState } from 'react';
import { SquareCard } from '~/components/Components/Card';
import icons from '~/assets/icons';
import styles from './FavoriteAlbums.module.scss';
import classNames from 'classnames/bind';
import LimitedList from '~/components/Components/LimitedList';
import { apiGetMyFavoriteAlbums } from '~/api/services/serviceAlbums';

const cx = classNames.bind(styles);

function FavoriteAlbums() {
  const [favoriteAlbums, setFavoriteAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleGetMyFavoriteAlbums = async () => {
    try {
      setLoading(true);
      const data = await apiGetMyFavoriteAlbums();
      setFavoriteAlbums(data);
    } catch (error) {
      console.error('Lỗi khi lấy album yêu thích:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetMyFavoriteAlbums();
  }, []);

  // SORT theo favoritedAt (ở level ngoài)
  const sortedFavoriteAlbums = [...favoriteAlbums].sort((a, b) => new Date(b.favoritedAt) - new Date(a.favoritedAt));

  if (loading) {
    return <div>Đang tải album yêu thích...</div>;
  }

  return (
    <>
      <h1 className="text-center">
        <i className={icons.iconCompactDisc}></i>
        <span style={{ paddingLeft: '10px' }}>Album yêu thích của bạn</span>
      </h1>

      <section className={cx('section-block')}>
        <h3>Album yêu thích của bạn</h3>

        {sortedFavoriteAlbums.length > 0 ? (
          <LimitedList
            items={sortedFavoriteAlbums}
            limit={8}
            renderItem={item => {
              const album = item.album;

              return (
                <div
                  key={item.id} // id của favorite
                  className="col-6 col-sm-4 col-lg-3 mb-3 d-flex justify-content-center"
                >
                  <SquareCard
                    content={album.title}
                    cover={album.cover}
                    href={`/album/${album.id}`}
                    icon={<i className={`${icons.iconList} fa-3x`}></i>}
                  />
                </div>
              );
            }}
          />
        ) : (
          <div className="text-center py-5">
            <i className={`${icons.iconCompactDisc} mb-3`} style={{ fontSize: '40px', opacity: 0.5 }}></i>
            <h5>Bạn chưa yêu thích Album nào nào</h5>
            <p className="text-muted">Hãy khám phá và yêu thích những album của nghệ sĩ mà bạn yêu thích 🎵</p>
          </div>
        )}
      </section>
    </>
  );
}

export default FavoriteAlbums;
