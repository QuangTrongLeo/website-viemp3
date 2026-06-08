import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Manage.module.scss';
import icons from '~/assets/icons';
import LimitedList from '~/components/Components/LimitedList';
import { SongRow } from '~/components/Components/Row';
import { apiGetArtists } from '~/api/services/serviceArtists';
import { apiGetAlbums } from '~/api/services/serviceAlbums';
import { apiGetSongs } from '~/api/services/serviceSongs';
import { apiGetUsers } from '~/api/services/serviceUsers';
import { apiGetGenres } from '~/api/services/serviceGenres';

const cx = classNames.bind(styles);

function Manage() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [genres, setGenres] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsRes, artistsRes, albumsRes, genresRes, usersRes] = await Promise.all([
          apiGetSongs(),
          apiGetArtists(),
          apiGetAlbums(),
          apiGetGenres(),
          apiGetUsers(),
        ]);

        // sắp xếp favorites giảm dần
        const sortedSongs = (songsRes || []).sort((a, b) => b.favorites - a.favorites);

        setSongs(sortedSongs);
        setArtists(artistsRes || []);
        setAlbums(albumsRes || []);
        setGenres(genresRes || []);
        setUsers(usersRes || []);
      } catch (error) {
        console.error('Fetch dashboard data error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className={cx('header')}>
        <h2 className="fw-bold">🎵 Music Platform Management</h2>
        <p className="text-muted">Quản lý bài hát, nghệ sĩ, album và theo dõi hoạt động của nền tảng âm nhạc.</p>
      </div>

      {/* System Overview */}
      <div className={cx('systemOverview')}>
        {[
          { label: 'Total Songs', count: songs.length, icon: icons.iconMusic, style: 'songs' },
          { label: 'Total Artists', count: artists.length, icon: icons.iconStar, style: 'artists' },
          { label: 'Total Albums', count: albums.length, icon: icons.iconCompactDisc, style: 'albums' },
          { label: 'Total Genres', count: genres.length, icon: icons.iconTags || 'fas fa-tags', style: 'genres' },
          { label: 'Total Users', count: users.length, icon: icons.iconUser, style: 'users' },
        ].map((item, index) => (
          <div key={index} className={cx('statCard', item.style)}>
            <div>
              <p className="text-muted mb-1">{item.label}</p>
              <h3>{item.count}</h3>
            </div>
            <i className={`${item.icon} ${cx('icon')}`}></i>
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div className="row g-4">
        {/* Recent Activity */}
        <div className="col-lg-6">
          <div className={cx('cardBox')}>
            <h5 className="mb-3">Recent Activity</h5>

            <div className={cx('activityItem')}>
              <i className={`${icons.iconMusic}`}></i>
              <span>Bài hát mới vừa được thêm vào hệ thống</span>
            </div>

            <div className={cx('activityItem')}>
              <i className={`${icons.iconStar}`}></i>
              <span>Nghệ sĩ vừa cập nhật album mới</span>
            </div>

            <div className={cx('activityItem')}>
              <i className={`${icons.iconUser}`}></i>
              <span>Người dùng mới vừa đăng ký tài khoản</span>
            </div>

            <div className={cx('activityItem')}>
              <i className={`${icons.iconCompactDisc}`}></i>
              <span>Album mới vừa được tạo</span>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="col-lg-6">
          <div className={cx('cardBox')}>
            <h5 className="mb-3">AI Music Insight</h5>

            <p className="text-muted mb-3">Phân tích hành vi nghe nhạc của người dùng để đề xuất nội dung phù hợp.</p>

            <ul className={cx('insightList')}>
              <li>🎧 Người dùng đang nghe nhiều nhạc Pop và Ballad</li>
              <li>📈 Xu hướng tuần này: Indie tăng 15%</li>
              <li>🔥 Bài hát được nghe nhiều nhất hôm nay</li>
              <li>🤖 AI đang phân tích lịch sử nghe để gợi ý bài hát</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={cx('cardBox', 'mt-4')}>
        <h5 className="mb-3">Quick Actions</h5>

        <div className="row g-3">
          <div className="col-md-3">
            <button className="btn btn-primary w-100">
              <i className={`${icons.iconCirclePlus} me-2`}></i>
              Thêm bài hát
            </button>
          </div>

          <div className="col-md-3">
            <button className="btn btn-warning w-100">
              <i className={`${icons.iconCirclePlus} me-2`}></i>
              Thêm nghệ sĩ
            </button>
          </div>

          <div className="col-md-3">
            <button className="btn btn-success w-100">
              <i className={`${icons.iconCirclePlus} me-2`}></i>
              Tạo album
            </button>
          </div>

          <div className="col-md-3">
            <button className="btn btn-dark w-100">
              <i className={`${icons.iconCirclePlus} me-2`}></i>
              Quản lý thể loại
            </button>
          </div>
        </div>
      </div>

      {/* Top Songs */}
      <div className={cx('cardBox', 'mt-4')}>
        <h5 className="mb-3">🔥 Top Songs</h5>

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
            <i className={cx('song-row-icon-header', 'fas', 'fa-heart', 'me-2')}></i>
            <span>Favorites</span>
          </div>
        </div>

        <LimitedList
          items={songs}
          limit={8}
          showAllText="Hiện tất cả bài hát"
          showLessText="Ẩn bớt"
          renderItem={song => (
            <SongRow
              key={song.id}
              song={song}
              liked={false}
              favoriteCount={song.favorites}
              onToggleFavorite={() => {}}
            />
          )}
        />
      </div>
    </div>
  );
}

export default Manage;
