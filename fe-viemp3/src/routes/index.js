import config from '~/config';

import { Home, GenreDetail, Genres } from '~/pages';

const publishRoutes = [
  { path: config.routes.home, component: Home },
  { path: `${config.routes.genre}/:genreId`, component: GenreDetail },
  { path: config.routes.genres, component: Genres },
];

const userRoutes = [];

const modRoutes = [];

const adminRoutes = [];

export { publishRoutes, userRoutes, modRoutes, adminRoutes };
