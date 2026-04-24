import React, { useState, useEffect } from 'react';
import Tippy from '@tippyjs/react/headless';
import icons from '~/assets/icons';
import { SearchRow } from '../Row';
import { useNavigate } from 'react-router-dom';
import LimitedList from '../LimitedList';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';

const cx = classNames.bind(styles);

function Search() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // const [artists, setArtists] = useState([]);
  // const [songs, setSongs] = useState([]);
  // const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  const artists = [
    {
      id: '404db06e-319f-4acc-bdda-53f623d1f821',
      name: 'Nguyễn Thạc Bảo Ngọc',
      avatar:
        'https://res.cloudinary.com/drlhghtqx/image/upload/v1775103027/artists/63ad9ba9-dca6-4259-ba30-d4461010f9f6.jpg',
      favorites: 100000,
      createdAt: '2026-04-02T04:10:28.347795Z',
    },
    {
      id: '9bcd1c5a-b0be-4f10-b250-8e153e4cf864',
      name: 'QNT',
      avatar:
        'https://res.cloudinary.com/drlhghtqx/image/upload/v1773890110/artists/7886dd80-b375-4570-8cf9-d70424dc8fe1.jpg',
      favorites: 100000,
      createdAt: '2026-03-19T03:15:11.712723Z',
    },
    {
      id: 'a6dd2e8c-1aa0-4545-87e1-b0f7a71cb1ef',
      name: 'Wxrdie',
      avatar:
        'https://res.cloudinary.com/drlhghtqx/image/upload/v1773890069/artists/201e505e-3b01-439e-97c8-6f0b062d0244.jpg',
      favorites: 100000,
      createdAt: '2026-03-19T03:14:31.237954Z',
    },
  ];
  const songs = [
    {
      id: '0b663f77-f322-44ce-8df2-b203c262f5e5',
      title: 'Tại Vì Sao',
      cover:
        'https://res.cloudinary.com/drlhghtqx/image/upload/v1773893844/songs/covers/26940693-9688-4ef5-a539-735dc1af695f.png',
      audio:
        'https://res.cloudinary.com/drlhghtqx/video/upload/v1773893850/songs/audios/1f04df15-52bd-4850-a979-0c58f360ed53.mp3',
      description: 'RPT MCK - TẠI VÌ SAO | Official Music Video',
      artistId: 'c8ffdb22-4b48-42b3-8671-2d633fb3aff0',
      albumId: '89566bc1-2c5c-487a-924e-f44070b8d4e4',
      genreId: 'd6dfed87-c187-40c5-bf15-7e4684da0b62',
      favorites: 0,
      listenCount: 3,
      createdAt: '2026-03-19T04:17:32.634432Z',
    },
    {
      id: '0cff5749-ed4b-447f-9371-978ee49ee097',
      title: 'Ai Mà Biết Được',
      cover:
        'https://res.cloudinary.com/drlhghtqx/image/upload/v1773892941/songs/covers/a4735a64-d41e-4133-811e-473ff1ab125e.png',
      audio:
        'https://res.cloudinary.com/drlhghtqx/video/upload/v1773892948/songs/audios/87c58014-bec1-4a8a-8b81-405c830bc882.mp3',
      description: 'SOOBIN, tlinh - Ai Mà Biết Được (ft. Touliver)',
      artistId: 'ba427ec4-34f0-4507-9af6-022752f67a6e',
      albumId: null,
      genreId: 'd6dfed87-c187-40c5-bf15-7e4684da0b62',
      favorites: 0,
      listenCount: 1,
      createdAt: '2026-03-19T04:02:31.222596Z',
    },
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
  ];
  const albums = [
    {
      id: '201a05e3-3cda-4850-856a-5758a423e221',
      title: 'Đom Đóm',
      cover:
        'https://res.cloudinary.com/drlhghtqx/image/upload/v1773795911/albums/164b5f1e-a679-4623-8818-89b286390a1e.jpg',
      artistId: 'b46c5832-da9b-4c76-b173-44df88de0fd5',
      favorites: 0,
      createdAt: '2026-03-18T01:05:26.269383Z',
    },
    {
      id: '357ed8df-f2fe-4ee0-b465-975eb749a934',
      title: 'THE WXRDIES',
      cover:
        'https://res.cloudinary.com/drlhghtqx/image/upload/v1773890539/albums/22a56c28-7911-44ef-9412-cd3ff6f6f2c9.jpg',
      artistId: 'a6dd2e8c-1aa0-4545-87e1-b0f7a71cb1ef',
      favorites: 0,
      createdAt: '2026-03-19T03:22:20.894201Z',
    },
    {
      id: '49e937a5-217c-45c3-bccc-9c955cb8bbcb',
      title: 'Sky',
      cover:
        'https://res.cloudinary.com/drlhghtqx/image/upload/v1772539907/albums/8f4fb9ab-ddf8-4efe-8304-e3231db17f6a.jpg',
      artistId: 'fe9a1409-4f94-4246-902e-2e1ce22354a1',
      favorites: 1,
      createdAt: '2026-03-03T12:11:48.78393Z',
    },
  ];

  // ===== SEARCH KEYWORD =====
  const handleInputSearch = e => {
    const value = e.target.value;
    setSearchKeyword(value);
    if (value.trim() === '') {
      setSearchResults([]);
      return;
    }
    const keyword = value.toLowerCase();

    // Artist
    const matchedArtists = artists
      .filter(artist => artist.name.toLowerCase().includes(keyword))
      .map(artist => ({ ...artist, type: 'artist' }));

    // Song
    const matchedSongs = songs
      .filter(song => song.title.toLowerCase().includes(keyword))
      .map(song => ({ ...song, type: 'song' }));

    // Album
    const matchedAlbums = albums
      .filter(album => album.title.toLowerCase().includes(keyword))
      .map(album => ({ ...album, type: 'album' }));

    const resultSearchs = [...matchedArtists, ...matchedSongs, ...matchedAlbums];
    setSearchResults(resultSearchs);
  };

  // ===== SUBMIT SEARCH =====
  const handleSubmit = e => {
    e.preventDefault();
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return;
    const matchedArtist = artists.find(a => a.name.toLowerCase().includes(keyword));
    if (matchedArtist) {
      navigate(`/artist/${encodeURIComponent(matchedArtist.name)}`);
      setSearchKeyword('');
      return;
    }

    const matchedSong = songs.find(s => s.title.toLowerCase().includes(keyword));
    if (matchedSong) {
      navigate(`/song/${matchedSong.id}`);
      setSearchKeyword('');
      return;
    }

    const matchedAlbum = albums.find(a => a.title.toLowerCase().includes(keyword));
    if (matchedAlbum) {
      navigate(`/album/${matchedAlbum.id}`);
      setSearchKeyword('');
      return;
    }

    setSearchKeyword('');
  };

  // ===== RENDER ROW =====
  const renderSearchRow = item => (
    <SearchRow
      key={`${item.type}-${item.id}`}
      id={item.id}
      type={item.type}
      cover={item.cover || item.avatar}
      content={item.title || item.name}
      desc={item.type === 'song' ? 'Bài hát' : item.type === 'artist' ? 'Nghệ sĩ nổi bật' : 'Album'}
      onClick={() => {
        if (item.type === 'artist') {
          navigate(`/artist/${encodeURIComponent(item.name)}`);
        }
        if (item.type === 'song') {
          navigate(`/song/${item.id}`);
        }
        if (item.type === 'album') {
          navigate(`/album/${item.id}`);
        }
        setSearchKeyword('');
      }}
    />
  );

  return (
    <Tippy
      visible={searchKeyword.length > 0 && searchResults.length > 0}
      interactive
      placement="bottom-start"
      onClickOutside={() => setSearchKeyword('')}
      render={attrs => (
        <div className={cx('tippy-popup-box')} tabIndex="-1" {...attrs}>
          <h6>Gợi ý kết quả</h6>
          <LimitedList
            items={searchResults}
            renderItem={renderSearchRow}
            showAllText="Hiện tất cả kết quả"
            showLessText="Ẩn bớt"
            wrapInRow={false}
          />
        </div>
      )}
    >
      <form onSubmit={handleSubmit} className={cx('input-group', 'search-form', 'w-50')}>
        <input
          type="search"
          className="form-control"
          placeholder="Bạn muốn phát nội dung gì?"
          value={searchKeyword}
          onChange={handleInputSearch}
        />

        <button className={cx('btn', 'btn-outline-custom')} type="submit">
          <i className={icons.iconSearch}></i>
        </button>
      </form>
    </Tippy>
  );
}

export default Search;
