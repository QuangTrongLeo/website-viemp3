import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import icons from '~/assets/icons';
import styles from './GenreDetail.module.scss';
import SongItem from '~/components/Components/SongItem';
import LimitedList from '~/components/Components/LimitedList';
import { apiGetGenre } from '~/api/services/serviceGenres';
import { apiGetSongsByGenre } from '~/api/services/serviceSongs';

const cx = classNames.bind(styles);

function GenreDetail() {
  const { genreId } = useParams();

  const [genre, setGenre] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== GET GENRE =====
  const handleGetGenre = async () => {
    try {
      const data = await apiGetGenre(genreId);
      setGenre(data);
      console.log(data);
    } catch (error) {
      console.error('Lỗi khi lấy genre:', error);
    }
  };

  // ===== GET SONGS BY GENRE =====
  const handleGetSongsByGenre = async () => {
    try {
      const data = await apiGetSongsByGenre(genreId);
      setSongs(data || []);
    } catch (error) {
      setSongs([]);
    }
  };

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchData = async () => {
      if (!genreId) return;
      setLoading(true);
      try {
        await handleGetGenre();
        await handleGetSongsByGenre();
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genreId]);

  const sortedSongs = [...songs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return <div>Đang tải thể loại...</div>;
  }

  if (!genre) {
    return <div>Không tìm thấy thể loại</div>;
  }

  return (
    <div className={cx('genre-wrapper', 'py-4')}>
      {/* Header */}
      <div className={cx('genre-header', 'd-flex', 'align-items-center', 'mb-4')}>
        <div className={cx('genre-cover')}>
          <i className={icons.iconMusic}></i>
        </div>
        <div className="ms-4">
          <h2 className={cx('genre-title')}>{genre.name}</h2>
          <p className={cx('genre-description')}>Tuyển tập các bài hát trong thể loại {genre.name}</p>
        </div>
      </div>

      {/* Danh sách bài hát */}
      <h5 className={cx('section-title')}>Danh sách bài hát</h5>
      {sortedSongs.length > 0 ? (
        <LimitedList
          items={sortedSongs}
          limit={8}
          wrapInRow={true}
          renderItem={song => (
            <div className="col-md-6 mb-3" key={song.id}>
              <SongItem song={song} />
            </div>
          )}
        />
      ) : (
        <p>Chưa có bài hát trong thể loại này</p>
      )}
    </div>
  );
}

export default GenreDetail;
