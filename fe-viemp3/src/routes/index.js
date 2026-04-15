import config from "~/config";

import { Home } from "~/pages";

const publishRoutes = [
  { path: config.routes.home, component: Home },
];

const userRoutes = [];

const modRoutes = [];

const adminRoutes = [];

export { publishRoutes, userRoutes, modRoutes, adminRoutes };