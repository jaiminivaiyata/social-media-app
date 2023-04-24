const express = require('express');
const authRoute = require('./auth.route');
const todoRoute = require('./todo.route');
const postRoute = require('./post.route');

const docsRoute = require('./docs.route');

const config = require('../../general-resources/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/todos',
    route: todoRoute,
  },
  {
    path: '/posts',
    route: postRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
