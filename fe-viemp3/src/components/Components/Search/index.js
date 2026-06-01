import React, { useState, useEffect } from 'react';
import Tippy from '@tippyjs/react/headless';
import icons from '~/assets/icons';
import { SearchRow } from '../Row';
import { useNavigate } from 'react-router-dom';
import LimitedList from '../LimitedList';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';

import { apiGetArtists } from '~/api/services/serviceArtists';
import { apiGetAlbums } from '~/api/services/serviceAlbums';
import { apiGetSongs } from '~/api/services/serviceSongs';

const cx = classNames.bind(styles);

function Search() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistRes, songRes, albumRes] = await Promise.all([apiGetArtists(), apiGetSongs(), apiGetAlbums()]);
        setArtists(artistRes || []);
        setSongs(songRes || []);
        setAlbums(albumRes || []);
      } catch (error) {
        console.error('Lỗi load search data', error);
      }
    };

    fetchData();
  }, []);

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
