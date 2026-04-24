import './Header.scss';
import React, { useRef } from 'react';
import images from '~/assets/images';
import config from '~/config';
import icons from '~/assets/icons';
import { ShortButton, LongButton } from '../Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import AvatarDropdownMenu from '../AvatarDropdownMenu';
import Search from '../Search';

function Header({ onToggleNotificationTablet, bellButtonRef }) {
  const { currentToken, setCurrentToken, roles } = useAuth();
  const recognitionRef = useRef(null);

  const isLoggedIn = !!currentToken;
  const isMod = roles.includes('MOD');
  const isAdmin = roles.includes('ADMIN');

  const handleLogout = () => {
    setCurrentToken('');
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Trình duyệt không hỗ trợ voice search');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log('Đang nghe...');
    };

    recognition.onresult = async event => {
      const transcript = event.results[0][0].transcript;
      console.log('Bạn nói:', transcript);

      // Gửi lên backend
      const response = await fetch('/api/v1/search/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ text: transcript }),
      });

      const result = await response.json();

      console.log('Kết quả AI:', result);
    };

    recognition.onerror = err => {
      console.error('Lỗi nhận diện:', err);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top custom-navbar">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Logo + Search */}
        <div className="d-flex align-items-center flex-grow-1 gap-3">
          {/* Logo */}
          <Link className="navbar-brand mb-0" to={config.routes.home}>
            {/* <i className="fab fa-linkedin fa-2x"></i> */}
            <img className="navbar-logo" src={images.logo} alt="VieMp3" />
          </Link>

          {/* Search form */}
          <Search />

          {/* Voice button */}
          <button className="btn voice-btn" onClick={handleVoiceSearch}>
            <i className={icons.iconMicrophone}></i>
          </button>
        </div>

        {/* Toggle button */}
        <button
          className="navbar-toggler ms-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav navbar-nav-header d-flex align-items-center justify-content-end flex-row gap-3 mb-0">
            {/* Nút Khám phá Premium */}
            <li>
              <LongButton
                href={config.routes.premium}
                backgroundColor="var(--primary-color)"
                color="var(--black-color)"
              >
                Khám phá Premium
              </LongButton>
            </li>

            {/* Nếu đã đăng nhập */}
            {isLoggedIn ? (
              <>
                {[{ icon: 'bell', label: 'Thông báo', onClick: onToggleNotificationTablet }].map((item, i) => (
                  <li
                    key={i}
                    ref={bellButtonRef}
                    className="nav-item position-relative icon-tooltip-wrapper"
                    onClick={item.onClick}
                  >
                    <Link className="nav-link d-flex flex-column text-center" to="#" onClick={e => e.preventDefault()}>
                      <i className={`fas fa-${item.icon} fa-lg my-1`}></i>
                      <div className="icon-tooltip">{item.label}</div>
                    </Link>
                  </li>
                ))}

                {/* Avatar dropdown */}
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    to="#"
                    id="navbarDropdownMenuLink"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={e => e.preventDefault()}
                  >
                    <img
                      src={images.avatarDefault}
                      className="rounded-circle"
                      height="40"
                      alt="Avatar"
                      loading="lazy"
                    />
                  </Link>
                  <AvatarDropdownMenu isMod={isMod} isAdmin={isAdmin} handleLogout={handleLogout} />
                </li>
              </>
            ) : (
              <>
                {/* Nếu chưa đăng nhập */}
                <li>
                  <ShortButton
                    color="var(--white-color)"
                    backgroundColor="var(--black-color-light-2)"
                    borderColor="var(--black-dark-color)"
                    href={config.routes.register}
                  >
                    Đăng ký
                  </ShortButton>
                </li>
                <li>
                  <ShortButton
                    color="var(--white-color)"
                    backgroundColor="var(--primary-color)"
                    borderColor="var(--black-dark-color)"
                    href={config.routes.login}
                  >
                    Đăng nhập
                  </ShortButton>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
