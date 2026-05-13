import icons from '~/assets/icons';
import classNames from 'classnames/bind';
import styles from './FavoriteSongs.module.scss';
import SongRow from '~/components/Components/Row/SongRow';
import LimitedList from '~/components/Components/LimitedList';

const cx = classNames.bind(styles);

function FavoriteSongs() {
  const favoriteSongs = [
    {
      id: '2078beef-7bbd-49bf-a6ef-098bc3b952b5',
      favoritedAt: '2026-04-02T04:15:56.192009Z',
      song: {
        id: 'b669a47c-3992-4148-b94d-63df0267e1ff',
        title: 'Trả Cho Anh',
        cover:
          'https://res.cloudinary.com/drlhghtqx/image/upload/v1775103209/songs/covers/972a4947-d770-4a9f-b11c-3a268c64d833.jpg',
        audio:
          'https://res.cloudinary.com/drlhghtqx/video/upload/v1775103229/songs/audios/4eb4a3b7-a3db-4592-b17a-82b103db9562.mp3',
        description: 'Trả Cho Anh Remix (Bản Hot TikTok) - Nguyễn Thạc Bảo Ngọc ♫ Em Trả Cho Anh Tự Do',
        artistId: '404db06e-319f-4acc-bdda-53f623d1f821',
        albumId: null,
        genreId: '7623ebc4-1cf5-4303-98fa-18567be09a9a',
        favorites: 2,
        listenCount: 19,
        createdAt: '2026-04-02T04:13:51.046462Z',
      },
    },
    {
      id: 'a91b0525-4069-445f-b0bc-d2cb7ab333ba',
      favoritedAt: '2026-03-26T15:28:49.582669Z',
      song: {
        id: '34c5410a-601d-40ba-a048-317c8b6879be',
        title: 'Băng Qua Cầu Giấy',
        cover:
          'https://res.cloudinary.com/drlhghtqx/image/upload/v1773891730/songs/covers/79d8a6bc-cbcc-41c8-8f20-0425b68d0f62.png',
        audio:
          'https://res.cloudinary.com/drlhghtqx/video/upload/v1773891753/songs/audios/7e8b312c-f561-4c0d-9a45-1fb1ddf92d2f.mp3',
        description: 'Wxrdie - BĂNG QUA CẦU GIẤY (ft. ‪JasonDilla) [prod. by ‪Phongkhin]',
        artistId: 'a6dd2e8c-1aa0-4545-87e1-b0f7a71cb1ef',
        albumId: '357ed8df-f2fe-4ee0-b465-975eb749a934',
        genreId: '0335a443-93b2-4683-a1f4-ec3a555ec63f',
        favorites: 1,
        listenCount: 13,
        createdAt: '2026-03-19T03:42:35.16865Z',
      },
    },
  ];

  const renderItem = item => <SongRow key={item.song.id} song={item.song} />;

  return (
    <>
      <h1 className="text-center">
        <i className={icons.iconHeart}></i>
        <span style={{ paddingLeft: '10px' }}>Bài hát yêu thích của bạn</span>
      </h1>

      {/* Header */}
      <div className={cx('song-row', 'd-flex', 'align-items-center', 'px-3', 'py-3')}>
        <div className="col-6 d-flex align-items-center gap-2">
          <i className={cx('song-row-icon-header', icons.iconMusic)}></i>
          <span>Bài hát</span>
        </div>

        <div className="col-4 d-flex align-items-center">
          <i className={cx('song-row-icon-header', icons.iconCompactDisc, 'me-2')}></i>
          <span>Album</span>
        </div>

        <div className="col-2 d-flex justify-content-end align-items-center">
          <i className={cx('song-row-icon-header', icons.iconClock, 'me-2')}></i>
          <span>Thời gian</span>
        </div>
      </div>

      {favoriteSongs.length === 0 ? (
        <div className={cx('empty-state')}>
          <i className={icons.iconMusic} style={{ fontSize: '60px', opacity: 0.3 }}></i>
          <h4 style={{ marginTop: '15px' }}>Bạn chưa có bài hát yêu thích</h4>
          <p style={{ opacity: 0.7 }}>Hãy thêm bài hát vào danh sách yêu thích.</p>
        </div>
      ) : (
        <LimitedList
          items={favoriteSongs}
          renderItem={renderItem}
          limit={8}
          showAllText="Hiện tất cả bài hát"
          showLessText="Ẩn bớt"
        />
      )}
    </>
  );
}

export default FavoriteSongs;
