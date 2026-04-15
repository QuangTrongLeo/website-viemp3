import { Routes, Route } from 'react-router-dom';
import { publishRoutes, userRoutes, modRoutes, adminRoutes } from '~/routes';
import { Fragment, useEffect, useState } from 'react';
import { MainLayout } from './layouts';
import config from './config';

function App() {
  const getAccessibleRoutes = () => {

    let allowedRoutes = publishRoutes.filter(r => r.path !== config.routes.login && r.path !== config.routes.register);

    return allowedRoutes;
  };

  const accessibleRoutes = getAccessibleRoutes();
  return (
    <div className="App">
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
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
    </div>
  );
}

export default App;
