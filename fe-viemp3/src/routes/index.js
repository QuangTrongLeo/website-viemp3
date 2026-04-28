import config from '~/config';

import { Home, Genres } from '~/pages';

const publishRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.genres, component: Genres },
];

const userRoutes = [];

const modRoutes = [];

const adminRoutes = [];

export { publishRoutes, userRoutes, modRoutes, adminRoutes };
