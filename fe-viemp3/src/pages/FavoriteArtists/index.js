import { CircleCard } from '~/components/Components/Card';
import icons from '~/assets/icons';
import styles from './FavoriteArtists.module.scss';
import classNames from 'classnames/bind';
import LimitedList from '~/components/Components/LimitedList';

const cx = classNames.bind(styles);

function FavoriteArtists() {
  const favoriteArtists = [
    {
      id: '065bd5e7-9bff-42cf-beb4-328991d0f26d',
      favoritedAt: '2026-03-05T01:46:17.844937Z',
      artist: {
        id: 'fe9a1409-4f94-4246-902e-2e1ce22354a1',
        name: 'Sơn Tùng - MTP',
        avatar:
          'https://res.cloudinary.com/drlhghtqx/image/upload/v1772528088/artists/5e3aee0e-c031-4f51-82a7-c4e58ded036a.webp',
        favorites: 100001,
        createdAt: '2026-03-03T03:06:31.739971Z',
      },
    },
  ];

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
