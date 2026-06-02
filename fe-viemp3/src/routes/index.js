import config from '~/config';
import { SecondLayout } from '~/layouts';

// publishRoutes
import { Home, GenreDetail, Genres, Login, Register, Otp, Premium } from '~/pages';

// userRoutes
import {
  ArtistDetail,
  AlbumDetail,
  SongDetail,
  History,
  Library,
  Profile,
  FavoriteArtists,
  FavoriteSongs,
  FavoriteAlbums,
  PlayListDetail,
  PlayList,
  PaymentCallback,
} from '~/pages';

// modRoutes
import { AlbumManage } from '~/pages';

const publishRoutes = [
  { path: config.routes.home, component: Home },
  { path: `${config.routes.artist}/:artistName`, component: ArtistDetail },
  { path: `${config.routes.genre}/:genreId`, component: GenreDetail },
  { path: `${config.routes.album}/:albumId`, component: AlbumDetail },
  { path: config.routes.genres, component: Genres },
  { path: config.routes.premium, component: Premium },
  { path: config.routes.login, component: Login, layout: SecondLayout },
  { path: config.routes.register, component: Register, layout: SecondLayout },
  { path: config.routes.otp, component: Otp, layout: SecondLayout },
];

const userRoutes = [
  { path: `${config.routes.song}/:songId`, component: SongDetail },
  { path: `${config.routes.playlist}/:playlistId`, component: PlayListDetail },
  { path: config.routes.playlists, component: PlayList },
  { path: config.routes.library, component: Library },
  { path: config.routes.history, component: History },
  { path: config.routes.profile, component: Profile },
  { path: config.routes.paymentCallback, component: PaymentCallback },
  { path: config.routes.favoriteAlbums, component: FavoriteAlbums },
  { path: config.routes.favoriteArtists, component: FavoriteArtists },
  { path: config.routes.favoriteSongs, component: FavoriteSongs },
];

const modRoutes = [{ path: config.routes.manageAlbums, component: AlbumManage }];

const adminRoutes = [];

export { publishRoutes, userRoutes, modRoutes, adminRoutes };
