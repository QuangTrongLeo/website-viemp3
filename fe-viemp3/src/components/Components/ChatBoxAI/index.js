import { useState, useRef, useEffect } from 'react';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import styles from './ChatBoxAI.module.scss';

import { images } from '~/assets';
import icons from '~/assets/icons';

import { apiChatAI } from '~/api/services/serviceAIs';

import HorizontalScroll from '~/components/Components/HorizontalScroll';

import { SquareCard, CircleCard } from '../Card';

const cx = classNames.bind(styles);

function ChatBoxAI() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Xin chào. Tôi có thể giúp gì cho bạn?',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  const handleToggle = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    setVisible(prev => !prev);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        text: userMessage,
      },
      {
        role: 'ai',
        text: 'Đang trả lời...',
      },
    ]);

    setInput('');
    inputRef.current?.focus();
    setLoading(true);

    try {
      const response = await apiChatAI(userMessage);

      setMessages(prev => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: 'ai',
          text: response.text,
          data: {
            songs: response.songs || [],
            albums: response.albums || [],
            artists: response.artists || [],
            genres: response.genres || [],
          },
        };

        return updated;
      });
    } catch (error) {
      setMessages(prev => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: 'ai',
          text: 'AI đang quá tải, vui lòng thử lại sau.',
        };

        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCards = (items, renderItem) => {
    if (!items?.length) return null;

    if (items.length === 1) {
      return <div className={cx('singleCard')}>{renderItem(items[0])}</div>;
    }

    return <HorizontalScroll>{items.map(renderItem)}</HorizontalScroll>;
  };

  const renderAIData = data => {
    if (!data) return null;

    // Songs
    if (data.songs?.length > 0) {
      return (
        <div className={cx('resultWrapper')}>
          {renderCards(data.songs, song => (
            <SquareCard
              key={song.id}
              content={song.title}
              desc={song.artistName}
              cover={song.cover}
              href={`/song/${song.id}`}
            />
          ))}
        </div>
      );
    }

    // Albums
    if (data.albums?.length > 0) {
      return (
        <div className={cx('resultWrapper')}>
          {renderCards(data.albums, album => (
            <SquareCard
              key={album.id}
              content={album.title}
              desc={album.artistName}
              cover={album.cover}
              href={`/album/${album.id}`}
            />
          ))}
        </div>
      );
    }

    // Artists
    if (data.artists?.length > 0) {
      return (
        <div className={cx('resultWrapper')}>
          {renderCards(data.artists, artist => (
            <CircleCard key={artist.id} content={artist.name} cover={artist.avatar} href={`/artist/${artist.name}`} />
          ))}
        </div>
      );
    }

    // Genres
    if (data.genres?.length > 0) {
      return (
        <div className={cx('resultWrapper')}>
          {renderCards(data.genres, genre => (
            <SquareCard
              key={genre.id}
              content={genre.name}
              desc={genre.description}
              href={`/genre/${genre.id}`}
              icon={<i className={`${icons.iconMusic} fa-3x`} />}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className={cx('wrapper')}>
      <Tippy
        interactive
        visible={visible}
        placement="top-end"
        offset={[0, 10]}
        onClickOutside={() => setVisible(false)}
        render={() => (
          <div className={cx('chatBox')}>
            <div className={cx('header')}>
              <img src={images.logo} alt="AI" className={cx('avatar')} />

              <span>VieMP3 ChatAI</span>
            </div>

            <div className={cx('messages')}>
              {messages.map((msg, index) => (
                <div key={index} className={cx('message', msg.role)}>
                  <div className={cx('messageText')}>{msg.text}</div>

                  {msg.role === 'ai' && renderAIData(msg.data)}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            <div className={cx('inputBox')}>
              <input
                ref={inputRef}
                value={input}
                disabled={loading}
                placeholder="Nhập câu hỏi..."
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />

              <button onClick={handleSend} disabled={loading}>
                {loading ? '...' : 'Gửi'}
              </button>
            </div>
          </div>
        )}
      >
        <button className={cx('chatButton')} onClick={handleToggle}>
          <img src={images.logo} alt="chat" />
        </button>
      </Tippy>
    </div>
  );
}

export default ChatBoxAI;
