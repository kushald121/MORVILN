// This script will help us debug what routes are registered
// We'll create a simple Express app and load our routes to see what's registered

const express = require('express');
const routes = require('./dist/routes/index').default;

const app = express();
app.use('/api', routes);

// Function to list all registered routes
function listRoutes(app) {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Regular routes
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  return routes;
}

// Mount the routes
console.log('Registered routes:');
// Note: This is a simplified approach and may not show all routes due to nested routers

console.log('Testing route loading...');
console.log('If you can see this, the routes module loaded successfully');