import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ArtistDetail.module.scss';
import SongItem from '~/components/Components/SongItem';
import LimitedList from '~/components/Components/LimitedList';
import { apiGetArtistByName } from '~/api/services/serviceArtists';

const cx = classNames.bind(styles);

function ArtistDetail() {
  const { artistName } = useParams();
  const decodedArtistName = decodeURIComponent(artistName);

  const [artist, setArtist] = useState(null);
  const [latestSong, setLatestSong] = useState(null);
  const songsByArtist = [
    {
      id: '2071a9c3-5b23-4743-bbcf-fc7cab53285d',
      title: 'Nơi Này Có Anh',
      cover:
        'https://res.cloudinary.com/drlhghtqx/image/upload/v1773893498/songs/covers/e3c93de9-de1b-4e4b-b556-8882259f5621.jpg',
      audio:
        'https://res.cloudinary.com/drlhghtqx/video/upload/v1773893504/songs/audios/d1586f70-9911-40b1-9812-b4328446ba7c.mp3',
      description: ' NƠI NÀY CÓ ANH | OFFICIAL MUSIC VIDEO | SƠN TÙNG M-TP',
      artistId: 'fe9a1409-4f94-4246-902e-2e1ce22354a1',
      albumId: '49e937a5-217c-45c3-bccc-9c955cb8bbcb',
      genreId: 'a12eaec3-56cb-4c78-a131-600012fad5b4',
      favorites: 0,
      listenCount: 0,
      createdAt: '2026-03-19T04:11:46.668369Z',
    },
    {
      id: '34da4954-0044-4f38-a55f-35746b97007f',
      title: 'Chúng Ta Không Thuộc Về Nhau',
      cover:
        'https://res.cloudinary.com/drlhghtqx/image/upload/v1773821473/songs/covers/574322af-8d74-45cf-82fa-6f49abd3ea26.jpg',
      audio:
        'https://res.cloudinary.com/drlhghtqx/video/upload/v1773821478/songs/audios/810046a4-c1ca-4739-a60d-753662ae7af3.mp3',
      description: 'Chúng Ta Không Thuộc Về Nhau | Official Music Video | Sơn Tùng M-TP',
      artistId: 'fe9a1409-4f94-4246-902e-2e1ce22354a1',
      albumId: '49e937a5-217c-45c3-bccc-9c955cb8bbcb',
      genreId: '7623ebc4-1cf5-4303-98fa-18567be09a9a',
      favorites: 0,
      listenCount: 0,
      createdAt: '2026-03-18T08:11:21.493848Z',
    },
    {
      id: '60c9e805-acef-4fc1-a7c8-4fad8e223093',
      title: 'Muộn Rồi Mà Sao Còn',
      cover:
        'https://res.cloudinary.com/drlhghtqx/image/upload/v1773893325/songs/covers/dcace8ab-2697-4279-824d-443d1827434b.jpg',
      audio:
        'https://res.cloudinary.com/drlhghtqx/video/upload/v1773893333/songs/audios/6431f718-a148-4823-a209-c624c932a608.mp3',
      description: 'SƠN TÙNG M-TP | MUỘN RỒI MÀ SAO CÒN ',
      artistId: 'fe9a1409-4f94-4246-902e-2e1ce22354a1',
      albumId: '49e937a5-217c-45c3-bccc-9c955cb8bbcb',
      genreId: 'd6dfed87-c187-40c5-bf15-7e4684da0b62',
      favorites: 0,
      listenCount: 0,
      createdAt: '2026-03-19T04:08:56.346732Z',
    },
    {
      id: 'e6c3caa2-f66c-4a6b-b9ff-25a5e5cca556',
      title: 'Chúng Ta Của Hiện Tại',
      cover:
        'https://res.cloudinary.com/drlhghtqx/image/upload/v1772529859/songs/covers/4ea582f9-1fce-4028-8cb6-26cc85094fa7.jpg',
      audio:
        'https://res.cloudinary.com/drlhghtqx/video/upload/v1772529867/songs/audios/677dba7e-bd38-48f7-a6fe-33488b9485e6.mp3',
      description: 'SƠN TÙNG M-TP | CHÚNG TA CỦA HIỆN TẠI | OFFICIAL MUSIC VIDEO',
      artistId: 'fe9a1409-4f94-4246-902e-2e1ce22354a1',
      albumId: '49e937a5-217c-45c3-bccc-9c955cb8bbcb',
      genreId: 'a12eaec3-56cb-4c78-a131-600012fad5b4',
      favorites: 0,
      listenCount: 0,
      createdAt: '2026-03-03T09:24:29.261164Z',
    },
    {
      id: 'ea6db031-3492-444e-8ec3-4b9ffe441538',
      title: 'Lạc Trôi',
      cover:
        'https://res.cloudinary.com/drlhghtqx/image/upload/v1773893404/songs/covers/8022125a-65c5-4484-9e9d-c0f6481cb4f0.jpg',
      audio:
        'https://res.cloudinary.com/drlhghtqx/video/upload/v1773893415/songs/audios/e69cd23f-2425-4eb0-9238-331455a516c4.mp3',
      description: 'LẠC TRÔI | OFFICIAL MUSIC VIDEO | SƠN TÙNG M-TP',
      artistId: 'fe9a1409-4f94-4246-902e-2e1ce22354a1',
      albumId: '49e937a5-217c-45c3-bccc-9c955cb8bbcb',
      genreId: 'a12eaec3-56cb-4c78-a131-600012fad5b4',
      favorites: 0,
      listenCount: 0,
      createdAt: '2026-03-19T04:10:17.204223Z',
    },
  ];

  const [artistLoading, setArtistLoading] = useState(true);
  const [songsLoading, setSongsLoading] = useState(false);

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
      setSongsLoading(true);

      const data = songsByArtist;
      // lấy bài mới nhất
      const latest = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      setLatestSong(latest);
    } catch (error) {
      console.error(error.message);
      setLatestSong(null);
    } finally {
      setSongsLoading(false);
    }
  }, [artist]);

  useEffect(() => {
    handleGetArtist();
  }, [handleGetArtist]);

  useEffect(() => {
    handleGetSongsByArtist();
  }, [handleGetSongsByArtist]);

  if (artistLoading) return <div>Đang tải...</div>;
  if (!artist) return <div>Không tìm thấy nghệ sĩ...</div>;

  const popularSongs = [...songsByArtist].sort((a, b) => b.favorites - a.favorites);

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
            renderItem={(song, idx) => (
              <div className="col-md-6 mb-3" key={idx}>
                <SongItem song={song} />
              </div>
            )}
          />
        </div>
      </>
    </div>
  );
}

export default ArtistDetail;
