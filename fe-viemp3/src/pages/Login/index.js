import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '~/components/Components/AuthProvider';
import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { ShortButton } from '~/components/Components/Button';
import { Link } from 'react-router-dom';
import config from '~/config';
import { apiLogin } from '~/api/services/serviceAuths';

const cx = classNames.bind(styles);

function Login({ showNotification }) {
  const { setCurrentToken } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginGoogle = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await apiLogin(email, password);
      const { accessToken, refreshToken } = res;

      localStorage.setItem('refreshToken', refreshToken);

      navigate(config.routes.home, { replace: true });

      setTimeout(() => {
        setCurrentToken(accessToken);
        showNotification('Đăng nhập thành công');
      }, 100);
    } catch (err) {
      console.error(err);
      setPassword('');
      showNotification('Đăng nhập thất bại. Mật khẩu không chính xác!');
    }
  };

  return (
    <>
      <section className={cx('text-center', 'text-lg-start')} style={{ marginTop: '5%' }}>
        <div className={cx('container', 'py-4')}>
          <div className={cx('row', 'g-0', 'align-items-center', 'justify-content-center')}>
            <div className={cx('col-lg-5', 'mb-5', 'mb-lg-0', 'd-none', 'd-lg-block')}>
              <img
                src={images.imageLoginRegister}
                className={cx('w-100', 'rounded-4', 'shadow-4')}
                style={{ height: '400px', objectFit: 'cover' }}
                alt=""
              />
            </div>
            <div className={cx('col-lg-6', 'mb-5', 'mb-lg-0')}>
              <div
                className={cx('card', 'cascading-right', 'bg-body-tertiary', 'mx-auto')}
                style={{
                  maxWidth: '420px',
                  backdropFilter: 'blur(30px)',
                }}
              >
                <div className={cx('card-body', 'p-3', 'shadow-5')} style={{ fontSize: '0.9rem' }}>
                  <h2 className={cx('fw-bold', 'mb-4')} style={{ fontSize: '1.5rem' }}>
                    Đăng nhập
                  </h2>
                  <form onSubmit={handleLogin}>
                    <div data-mdb-input-init className={cx('form-outline', 'mb-3')}>
                      <label className={cx('form-label', 'text-start', 'w-100')} htmlFor="form3Example3">
                        Email*:
                      </label>
                      <input
                        type="email"
                        id="form3Example3"
                        className={cx('form-control')}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>

                    <div data-mdb-input-init className={cx('form-outline', 'mb-3')}>
                      <label className={cx('form-label', 'text-start', 'w-100')} htmlFor="form3Example3">
                        Mật khẩu*:
                      </label>
                      <input
                        type="password"
                        id="form3Example4"
                        className={cx('form-control')}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>

                    <div className={cx('text-center')}>
                      <ShortButton
                        type="submit"
                        color="var(--black-color)"
                        backgroundColor="var(--primary-color)"
                        borderColor="var(--primary-color)"
                      >
                        Đăng nhập
                      </ShortButton>
                      {/* <ShortButton
                        color="var(--black-color)"
                        backgroundColor="var(--primary-color)"
                        borderColor="var(--primary-color)"
                        href={config.routes.home}
                      >
                        Đăng nhập
                      </ShortButton> */}
                    </div>
                  </form>
                  {/* REGISTER */}
                  <div className={cx('text-center')}>
                    <p style={{ fontSize: '0.85rem', paddingTop: '4%' }}>
                      Nếu chưa có tài khoản?{' '}
                      <Link
                        to={config.routes.register}
                        style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
                      >
                        Đăng ký
                      </Link>
                    </p>
                  </div>

                  {/* LOGIN BY GG */}
                  <div className={cx('text-center')}>
                    <p>hoặc đăng nhập với</p>
                    <button className={cx('google-btn')} onClick={handleLoginGoogle}>
                      <i className={cx('fab', 'fa-google')}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
