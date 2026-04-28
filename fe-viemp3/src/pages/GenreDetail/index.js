import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import icons from '~/assets/icons';
import styles from './GenreDetail.module.scss';
import { apiGetGenre } from '~/api/services/serviceGenres';

const cx = classNames.bind(styles);

function GenreDetail() {
  const { genreId } = useParams();

  const [genre, setGenre] = useState(null);
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

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchData = async () => {
      if (!genreId) return;
      setLoading(true);
      await Promise.all([handleGetGenre()]);
      setLoading(false);
    };
    fetchData();
  }, [genreId]);

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
          <p className={cx('genre-description')}>Tuyển tập các bài hát trong thể loại {genre.description}</p>
        </div>
      </div>
    </div>
  );
}

export default GenreDetail;
