import config from '~/config';
import { SecondLayout } from '~/layouts';

import { ArtistDetail, Home, GenreDetail, Genres, Login, Register, Otp } from '~/pages';

const publishRoutes = [
  { path: config.routes.home, component: Home },
  { path: `${config.routes.artist}/:artistName`, component: ArtistDetail },
  { path: `${config.routes.genre}/:genreId`, component: GenreDetail },
  { path: config.routes.genres, component: Genres },
  { path: config.routes.login, component: Login, layout: SecondLayout },
  { path: config.routes.register, component: Register, layout: SecondLayout },
  { path: config.routes.otp, component: Otp, layout: SecondLayout },
];

const userRoutes = [];

const modRoutes = [];

const adminRoutes = [];

export { publishRoutes, userRoutes, modRoutes, adminRoutes };
