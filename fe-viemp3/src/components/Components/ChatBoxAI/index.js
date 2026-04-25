import { useState, useRef, useEffect } from 'react';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import styles from './ChatBoxAI.module.scss';
import { images } from '~/assets';
// import { apiChatAI } from '~/api/services/serviceAIs';

const cx = classNames.bind(styles);

function ChatBoxAI() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', content: 'Xin chào 👋 Tôi có thể giúp gì cho bạn?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRef = useRef();
  const messagesEndRef = useRef();

  // Auto scroll xuống cuối
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleToggle = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setVisible(prev => !prev);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input;

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    inputRef.current.focus();
    setLoading(true);
    setMessages(prev => [...prev, { role: 'ai', content: 'Đang trả lời...' }]);

    // try {
    //   const aiResponse = await apiChatAI(userMessage);
    //   setMessages(prev => {
    //     const updated = [...prev];
    //     updated[updated.length - 1] = {
    //       role: 'ai',
    //       content: aiResponse,
    //     };
    //     return updated;
    //   });
    // } catch (error) {
    //   setMessages(prev => {
    //     const updated = [...prev];
    //     updated[updated.length - 1] = {
    //       role: 'ai',
    //       content: 'AI đang quá tải, thử lại sau!',
    //     };
    //     return updated;
    //   });
    // }

    setLoading(false);
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
            {/* Header */}
            <div className={cx('header')}>
              <img src={images.logo} alt="AI" className={cx('avatar')} />
              <span>VieMp3 ChatAI</span>
            </div>

            {/* Messages */}
            <div className={cx('messages')}>
              {messages.map((msg, index) => (
                <div key={index} className={cx('message', msg.role)}>
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={cx('inputBox')}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Nhập câu hỏi..."
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={loading}
              />
              <button onClick={handleSend} disabled={loading}>
                {loading ? '...' : 'Gửi'}
              </button>
            </div>
          </div>
        )}
      >
        {/* Floating Button */}
        <button className={cx('chatButton')} onClick={handleToggle}>
          <img src={images.logo} alt="chat" />
        </button>
      </Tippy>
    </div>
  );
}

export default ChatBoxAI;
