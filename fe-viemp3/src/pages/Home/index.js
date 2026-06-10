import React, { useEffect, useState } from 'react';
import HorizontalScroll from '~/components/Components/HorizontalScroll';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import { useAuth } from '~/components/Components/AuthProvider';
import { CircleCard, RectangleCard, SquareCard } from '~/components/Components/Card';
import { apiGetArtist, apiGetArtists } from '~/api/services/serviceArtists';
import { apiGetSongs, apiGetRecommendSongs } from '~/api/services/serviceSongs';
import { apiGetAlbums } from '~/api/services/serviceAlbums';

const cx = classNames.bind(styles);

function sortDesc(arr, field, isDate = false) {
  if (!arr) return [];
  return [...arr].sort((a, b) => {
    if (isDate) return new Date(b[field]) - new Date(a[field]);
    return b[field] - a[field];
  });
}

function Home() {
  const { currentToken } = useAuth();
  const [newSongs, setNewSongs] = useState([]);
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [hotAlbums, setHotAlbums] = useState([]);
  const [recommendSongs, setRecommendSongs] = useState([]);

  const handleHotAlbums = async () => {
    try {
      const data = await apiGetAlbums();
      const sorted = sortDesc(data, 'favorites');
      setHotAlbums(sorted);
    } catch (error) {
      console.error('Lỗi khi lấy album hot:', error);
    }
  };

  const handleNewSongs = async () => {
    try {
      const data = await apiGetSongs();
      const sortedSongs = sortDesc(data, 'createdAt');
      const songsWithArtist = await Promise.all(
        sortedSongs.map(async song => {
          try {
            const artist = await apiGetArtist(song.artistId);
            return { ...song, artistName: artist?.name };
          } catch {
            return { ...song, artistName: 'Không tìm thấy nghệ sĩ' };
          }
        })
      );
      setNewSongs(songsWithArtist);
    } catch (error) {
      console.error('Lỗi khi lấy bài hát mới:', error);
    }
  };

  const handleTrendingArtists = async () => {
    try {
      const data = await apiGetArtists();
      setTrendingArtists(sortDesc(data, 'favorites'));
    } catch (error) {
      console.error('Lỗi khi lấy nghệ sĩ phổ biến:', error);
    }
  };

  const handleRecommendSongs = async () => {
    try {
      if (!currentToken) return;
      const data = await apiGetRecommendSongs();
      const songsWithArtist = await Promise.all(
        data.map(async song => {
          try {
            const artist = await apiGetArtist(song.artistId);
            return {
              ...song,
              artistName: artist?.name || 'Không tìm thấy nghệ sĩ',
            };
          } catch {
            return {
              ...song,
              artistName: 'Không tìm thấy nghệ sĩ',
            };
          }
        })
      );
      setRecommendSongs(songsWithArtist);
    } catch (error) {
      console.error('Lỗi khi lấy bài hát gợi ý:', error);
    }
  };

  useEffect(() => {
    handleNewSongs();
    handleTrendingArtists();
    handleHotAlbums();
    handleRecommendSongs();
  }, [currentToken]);

  return (
    <div className={cx('home-wrapper')}>
      <h1 className="text-center">VieMp3 - Nhạc dành cho người Việt</h1>

      {/* NEW SONGS */}
      <section className={cx('section-block')}>
        <h3>Bài hát mới ra</h3>
        <HorizontalScroll>
          {newSongs?.slice(0, 18).map(song => (
            <RectangleCard
              key={song.id}
              content={song.title}
              desc={song.artistName}
              createdAt={song.createdAt}
              cover={song.cover}
              href={`/song/${song.id}`}
            />
          ))}
        </HorizontalScroll>
      </section>

      {/* TRENDING ARTISTS */}
      <section className={cx('section-block')}>
        <h3>Nghệ sĩ phổ biến</h3>
        <HorizontalScroll>
          {trendingArtists?.map(artist => (
            <CircleCard key={artist.id} content={artist.name} cover={artist.avatar} href={`/artist/${artist.name}`} />
          ))}
        </HorizontalScroll>
      </section>

      {/* HOT ALBUMS */}
      <section className={cx('section-block')}>
        <h3>Album hot</h3>
        <HorizontalScroll>
          {hotAlbums.map(album => (
            <SquareCard
              key={album.id}
              content={album.title}
              desc={album.artistName}
              cover={album.cover}
              href={`/album/${album.id}`}
            />
          ))}
        </HorizontalScroll>
      </section>

      {/* SUITABLE SONGS */}
      {currentToken && recommendSongs.length > 0 && (
        <section className={cx('section-block')}>
          <h3>Phù hợp với bạn</h3>
          <HorizontalScroll>
            {recommendSongs.map(song => (
              <RectangleCard
                key={song.id}
                content={song.title || song.songName}
                desc={song.artistName}
                createdAt={song.createdAt}
                cover={song.cover}
                href={`/song/${song.id}`}
              />
            ))}
          </HorizontalScroll>
        </section>
      )}
    </div>
  );
}

export default Home;
