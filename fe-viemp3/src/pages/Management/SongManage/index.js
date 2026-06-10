import React, { useState, useMemo, useEffect } from 'react';
import icons from '~/assets/icons';
import classNames from 'classnames/bind';
import styles from './SongManage.module.scss';
import LimitedList from '~/components/Components/LimitedList';

import {
  apiGetSongs,
  apiGetSongsByAlbum,
  apiGetSongsByArtist,
  apiGetSongsByGenre,
  apiCreateSong,
  apiUpdateSong,
  apiDeleteSong,
} from '~/api/services/serviceSongs';
import { apiGetGenres } from '~/api/services/serviceGenres';
import { apiGetAlbums, apiGetAlbumsByArtist } from '~/api/services/serviceAlbums';
import { apiGetArtists } from '~/api/services/serviceArtists';

const cx = classNames.bind(styles);

function SongManage() {
  const [songs, setSongs] = useState([]);
  const [genres, setGenres] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albumsByArtist, setAlbumsByArtist] = useState([]);

  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState('');

  const [filterArtist, setFilterArtist] = useState('');
  const [filterAlbum, setFilterAlbum] = useState('');
  const [filterGenre, setFilterGenre] = useState('');

  const [selectedSong, setSelectedSong] = useState(null);

  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    artistId: '',
    genreId: '',
    albumId: '',
    cover: null,
    audio: null,
  });

  // ===== FETCH MASTER =====
  useEffect(() => {
    fetchMaster();
  }, []);

  const fetchMaster = async () => {
    try {
      const [genreRes, albumRes, artistRes] = await Promise.all([apiGetGenres(), apiGetAlbums(), apiGetArtists()]);

      setGenres(genreRes);
      setAlbums(albumRes);
      setArtists(artistRes);
    } catch (error) {
      console.error(error);
    }
  };

  // ===== FETCH SONGS =====
  useEffect(() => {
    if (genres.length && albums.length && artists.length) {
      fetchSongs();
    }
  }, [filterArtist, filterAlbum, filterGenre, genres, albums, artists]);

  const fetchSongs = async () => {
    try {
      let songRes = [];

      if (filterArtist) {
        songRes = await apiGetSongsByArtist(filterArtist);
      } else if (filterAlbum) {
        songRes = await apiGetSongsByAlbum(filterAlbum);
      } else if (filterGenre) {
        songRes = await apiGetSongsByGenre(filterGenre);
      } else {
        songRes = await apiGetSongs();
      }

      mapSongs(songRes, genres, albums, artists);
    } catch (error) {
      console.error(error);
    }
  };

  // ===== MAP =====
  const mapSongs = (songRes, genreRes, albumRes, artistRes) => {
    const genreMap = Object.fromEntries(genreRes.map(g => [g.id, g]));
    const albumMap = Object.fromEntries(albumRes.map(a => [a.id, a]));
    const artistMap = Object.fromEntries(artistRes.map(a => [a.id, a]));

    const mapped = songRes.map(song => ({
      id: song.id,
      name: song.title,
      description: song.description,
      artistId: song.artistId,
      artistName: artistMap[song.artistId]?.name || 'Unknown',
      albumName: albumMap[song.albumId]?.title || 'Single',
      genreName: genreMap[song.genreId]?.name || '',
      favorites: song.favorites,
      createdAt: song.createdAt,
      cover: song.cover,
    }));

    setSongs(mapped);
  };

  // ===== FILTER LOCAL =====
  const filteredSongs = useMemo(() => {
    return songs
      .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortType === 'favorites') return b.favorites - a.favorites;
        if (sortType === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        return 0;
      });
  }, [songs, search, sortType]);

  const formatDate = date => new Date(date).toLocaleDateString('vi-VN');

  // ===== FORM =====
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = e => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      artistId: '',
      genreId: '',
      albumId: '',
      cover: null,
      audio: null,
    });
  };

  // ===== CREATE =====
  const handleCreate = async () => {
    try {
      await apiCreateSong(form.title, form.description, form.artistId, form.genreId, form.cover, form.audio);
      setModalCreate(false);
      resetForm();
      fetchSongs();
    } catch (e) {
      alert(e.message);
    }
  };

  // ===== UPDATE =====
  const handleOpenUpdate = async song => {
    setSelectedSong(song);

    try {
      const res = await apiGetAlbumsByArtist(song.artistId);
      setAlbumsByArtist(res);
    } catch (e) {
      console.error(e);
    }

    setForm({
      title: song.name || '',
      description: song.description || '',
      artistId: song.artistId || '',
      genreId: genres.find(g => g.name === song.genreName)?.id || '',
      albumId: '',
      cover: null,
      audio: null,
    });

    setModalUpdate(true);
  };

  const handleUpdate = async () => {
    try {
      await apiUpdateSong(
        selectedSong.id,
        form.title,
        form.description,
        form.genreId,
        form.albumId,
        form.cover,
        form.audio
      );

      setModalUpdate(false);
      resetForm();
      fetchSongs();
    } catch (e) {
      alert(e.message);
    }
  };

  // ===== DELETE =====
  const handleOpenDelete = song => {
    setSelectedSong(song);
    setModalDelete(true);
  };

  const handleDelete = async () => {
    try {
      await apiDeleteSong(selectedSong.id);
      setModalDelete(false);
      fetchSongs();
    } catch (e) {
      alert(e.message);
    }
  };

  // ===== RENDER =====
  const renderSong = song => (
    <div key={song.id} className={cx('song-item')}>
      <div className={cx('song-left')}>
        <div className={cx('cover')}>
          <img src={song.cover} alt="" />
        </div>

        <div>
          <div className={cx('song-name')}>{song.name}</div>
          <div className={cx('song-sub')}>
            {song.artistName} • {song.albumName} • {song.genreName}
          </div>
        </div>
      </div>

      <div className={cx('song-right')}>
        <div className={cx('song-meta')}>
          <span className={cx('favorite')}>
            <i className="fas fa-heart"></i> {song.favorites}
          </span>
          <span>{formatDate(song.createdAt)}</span>
        </div>

        <div className={cx('artist-actions')}>
          <button className="btn btn-sm btn-warning" onClick={() => handleOpenUpdate(song)}>
            <i className="fas fa-edit"></i>
          </button>

          <button className="btn btn-sm btn-danger" onClick={() => handleOpenDelete(song)}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <h3>
          <i className={icons.iconMusic}></i> Quản lý bài hát
        </h3>

        <button className="btn btn-primary" onClick={() => setModalCreate(true)}>
          Thêm bài hát
        </button>
      </div>

      {/* ===== TOOLBAR ===== */}
      <div className={cx('toolbar')}>
        <input placeholder="Tìm bài hát..." value={search} onChange={e => setSearch(e.target.value)} />

        <select onChange={e => setSortType(e.target.value)}>
          <option value="">Sắp xếp</option>
          <option value="favorites">Favorites</option>
          <option value="newest">Mới nhất</option>
        </select>

        {/* FILTER */}
        <select value={filterArtist} onChange={e => setFilterArtist(e.target.value)}>
          <option value="">-- Nghệ sĩ --</option>
          {artists.map(a => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <select value={filterAlbum} onChange={e => setFilterAlbum(e.target.value)}>
          <option value="">-- Album --</option>
          {albums.map(a => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>

        <select value={filterGenre} onChange={e => setFilterGenre(e.target.value)}>
          <option value="">-- Thể loại --</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <button
          className="btn btn-secondary"
          onClick={() => {
            setFilterArtist('');
            setFilterAlbum('');
            setFilterGenre('');
          }}
        >
          Reset
        </button>
      </div>

      <div className={cx('list')}>
        <LimitedList items={filteredSongs} renderItem={renderSong} />
      </div>

      {/* ===== MODALS (GIỮ NGUYÊN) ===== */}
      {modalCreate && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Thêm bài hát</h4>

            <input name="title" placeholder="Tên bài hát" onChange={handleChange} />
            <input name="description" placeholder="Mô tả" onChange={handleChange} />

            <select name="artistId" onChange={handleChange}>
              <option value="">Chọn nghệ sĩ</option>
              {artists.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <select name="genreId" onChange={handleChange}>
              <option value="">Chọn thể loại</option>
              {genres.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            {/* LABEL FILE */}
            <div className={cx('form-group')}>
              <label>Ảnh bìa (cover)</label>
              <input type="file" name="cover" accept="image/*" onChange={handleFile} />
            </div>

            <div className={cx('form-group')}>
              <label>File nhạc (audio)</label>
              <input type="file" name="audio" accept="audio/*" onChange={handleFile} />
            </div>

            <div className={cx('modal-actions')}>
              <button className="btn btn-secondary" onClick={() => setModalCreate(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleCreate}>
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}

      {modalUpdate && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Cập nhật bài hát</h4>

            <input name="title" value={form.title} onChange={handleChange} />
            <input name="description" value={form.description} onChange={handleChange} />

            <select name="genreId" value={form.genreId} onChange={handleChange}>
              <option value="">Chọn thể loại</option>
              {genres.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            <select name="albumId" value={form.albumId} onChange={handleChange}>
              <option value="">Chọn album</option>
              {albumsByArtist.map(a => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>

            {/* LABEL FILE */}
            <div className={cx('form-group')}>
              <label>Ảnh bìa (cover)</label>
              <input type="file" name="cover" accept="image/*" onChange={handleFile} />
            </div>

            <div className={cx('form-group')}>
              <label>File nhạc (audio)</label>
              <input type="file" name="audio" accept="audio/*" onChange={handleFile} />
            </div>

            <div className={cx('modal-actions')}>
              <button className="btn btn-secondary" onClick={() => setModalUpdate(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {modalDelete && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Bạn có chắc muốn xóa?</h4>
            <div className={cx('modal-actions')}>
              <button className="btn btn-danger" onClick={handleDelete}>
                Xóa
              </button>
              <button className="btn btn-secondary" onClick={() => setModalDelete(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SongManage;
