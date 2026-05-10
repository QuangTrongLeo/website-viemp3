import config from '~/config';
import { SecondLayout } from '~/layouts';

// publishRoutes
import { Home, GenreDetail, Genres, Login, Register, Otp, History, AlbumDetail } from '~/pages';

// userRoutes
import { ArtistDetail, SongDetail, Profile } from '~/pages';

// modRoutes
import { AlbumManage } from '~/pages';


const publishRoutes = [
  { path: config.routes.home, component: Home },
  { path: `${config.routes.artist}/:artistName`, component: ArtistDetail },
  { path: `${config.routes.genre}/:genreId`, component: GenreDetail },
  { path: `${config.routes.album}/:albumId`, component: AlbumDetail },
  { path: config.routes.genres, component: Genres },
  { path: config.routes.login, component: Login, layout: SecondLayout },
  { path: config.routes.register, component: Register, layout: SecondLayout },
  { path: config.routes.otp, component: Otp, layout: SecondLayout },
];

const userRoutes = [
  { path: `${config.routes.song}/:songId`, component: SongDetail },
  { path: config.routes.history, component: History },
  { path: config.routes.profile, component: Profile },
];

const modRoutes = [
  { path: config.routes.manageAlbums, component: AlbumManage },
];

const adminRoutes = [];

export { publishRoutes, userRoutes, modRoutes, adminRoutes };
