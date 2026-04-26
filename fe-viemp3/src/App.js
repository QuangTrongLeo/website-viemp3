import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { publishRoutes, userRoutes, modRoutes, adminRoutes } from '~/routes';
import { MainLayout } from './layouts';
import { Fragment, useEffect, useState } from 'react';
import { useAuth } from './components/Components/AuthProvider';
import config from './config';
import ScrollToTop from './components/Components/ScrollToTop';
import NotificationBar from './components/Components/NotificationBar';

function App() {
  const { roles } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [notification, setNotification] = useState('');
  const [visible, setVisible] = useState(false);

  const showNotification = message => {
    setNotification(message);
    setVisible(true);
    setTimeout(() => setVisible(false), 2500);
  };

  const getAccessibleRoutes = () => {
    // Nếu chưa đăng nhập thì chỉ cho các route public
    if (!roles || roles.length === 0) {
      return publishRoutes;
    }

    // Nếu đã đăng nhập thì loại bỏ login/register
    let allowedRoutes = publishRoutes.filter(r => r.path !== config.routes.login && r.path !== config.routes.register);

    if (roles.includes('USER')) allowedRoutes.push(...userRoutes);
    if (roles.includes('MOD')) allowedRoutes.push(...modRoutes);
    if (roles.includes('ADMIN')) allowedRoutes.push(...adminRoutes);

    return allowedRoutes;
  };

  const accessibleRoutes = getAccessibleRoutes();

  useEffect(() => {
    const currentPath = location.pathname;

    // Nếu đã login mà cố tình gõ /login hoặc /register thì redirect về home
    if (
      roles &&
      roles.length > 0 &&
      (currentPath === config.routes.login ||
        currentPath === config.routes.register ||
        currentPath === config.routes.otp)
    ) {
      showNotification('Bạn không có quyền truy cập');
      navigate(config.routes.home, { replace: true });
      return;
    }

    // Kiểm tra route có hợp lệ không
    const isAllowed = accessibleRoutes.some(r => matchPath({ path: r.path, end: false }, currentPath));

    if (!isAllowed) {
      showNotification('Vui lòng "Đăng Nhập" hoặc không có quyền truy cập');
      navigate(-1);
    }
  }, [location, accessibleRoutes, navigate, roles]);

  return (
    <>
      <ScrollToTop />
      <div className="App">
        <NotificationBar notification={notification} visible={visible} />

        <Routes>
          {accessibleRoutes.map((route, index) => {
            const Page = route.component;
            const Layout = route.layout !== undefined ? route.layout || Fragment : MainLayout;

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page showNotification={showNotification} />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </>
  );
}

export default App;
