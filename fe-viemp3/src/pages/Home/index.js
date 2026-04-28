import React, { useEffect, useState, useCallback } from 'react';
import HorizontalScroll from '~/components/Components/HorizontalScroll';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import { useAuth } from '~/components/Components/AuthProvider';
import { CircleCard } from '~/components/Components/Card';
import { apiGetArtists } from '~/api/services/serviceArtists';

const cx = classNames.bind(styles);

function sortDesc(arr, field, isDate = false) {
  return [...arr].sort((a, b) => {
    if (isDate) {
      return new Date(b[field]) - new Date(a[field]);
    }
    return b[field] - a[field];
  });
}

function Home() {
  const { currentToken } = useAuth();
  const [trendingArtists, setTrendingArtists] = useState([]);

  const handleTrendingArtists = async () => {
    try {
      const data = await apiGetArtists();
      const sorted = sortDesc(data, 'favorites');
      setTrendingArtists(sorted);
    } catch (error) {
      console.error('Lỗi khi lấy nghệ sĩ phổ biến:', error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await handleTrendingArtists();
    };
    fetchAll();
  }, [currentToken]);

  return (
    <div className={cx('home-wrapper')}>
      <h1 className="text-center">VieMp3 - Nhạc dành cho người Việt</h1>

      {/* TRENDING ARTISTS */}
      <section className={cx('section-block')}>
        <h3>Nghệ sĩ phổ biến</h3>
        <HorizontalScroll>
          {trendingArtists.map(artist => (
            <CircleCard key={artist.id} content={artist.name} cover={artist.avatar} href={`/artist/${artist.name}`} />
          ))}
        </HorizontalScroll>
      </section>
    </div>
  );
}

export default Home;
