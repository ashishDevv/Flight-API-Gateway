const express = require('express');

const ratelimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const { PORT } = require('./src/config/server-config');

const apiRoutes = require('./src/routes/index');

const sequelize = require('./src/models');

const { AuthMiddlewares } = require('./src/middlewares/index')

const app = express();

const limiter = ratelimit({
	windowMs: 15 * 60 * 1000,                                                // 15 minutes
	limit: 100,                                                             // Limit each IP to 100 requests per `window` (here, per 15 minutes).
});

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(limiter);                                                                        // using rate limiter for every api as middleware

// API Gateway Proxies

// Proxies for Flight-Search-Service (Admin part)
app.use('/api/v1/admin/airports', [ AuthMiddlewares.isAuthenticated, AuthMiddlewares.isAdmin ], createProxyMiddleware({
    target: 'http://localhost:3000/api/v1/admin/airports',
    changeOrigin: true,
  })
);
app.use('/api/v1/admin/airlines', [ AuthMiddlewares.isAuthenticated, AuthMiddlewares.isAdmin ], createProxyMiddleware({
    target: 'http://localhost:3000/api/v1/admin/airlines',
    changeOrigin: true,
  })
);
app.use('/api/v1/admin/flights', [ AuthMiddlewares.isAuthenticated, AuthMiddlewares.isAdmin ], createProxyMiddleware({
    target: 'http://localhost:3000/api/v1/admin/flights',
    changeOrigin: true,
  })
);
app.use('/api/v1/admin/flight-seats', [ AuthMiddlewares.isAuthenticated, AuthMiddlewares.isAdmin ], createProxyMiddleware({
    target: 'http://localhost:3000/api/v1/admin/flight-seats',
    changeOrigin: true,
  })
);


// Proxies for Flight-Booking-Service (Admin part)
app.use('/api/v1/admin/bookings', [ AuthMiddlewares.isAuthenticated, AuthMiddlewares.isAdmin ], createProxyMiddleware({
    target: 'http://localhost:4000/api/v1/admin/bookings',
    changeOrigin: true,
  })
);
app.use('/api/v1/admin/payments', [ AuthMiddlewares.isAuthenticated, AuthMiddlewares.isAdmin ], createProxyMiddleware({
  target: 'http://localhost:4000/api/v1/admin/payments',
  changeOrigin: true,
 })
);
app.use('/api/v1/admin/seats', [ AuthMiddlewares.isAuthenticated, AuthMiddlewares.isAdmin ], createProxyMiddleware({
  target: 'http://localhost:4000/api/v1/admin/seats',
  changeOrigin: true,
 })
);

// Proxies for Flight-Search-Service (User part)
app.use('/api/v1/user/bookings',  createProxyMiddleware({
  target: 'http://localhost:4000/api/v1/user/bookings',
  changeOrigin: true,
 })
);


app.use('/api/v1/user/payments', [AuthMiddlewares.isAuthenticated], createProxyMiddleware({
  target: 'http://localhost:4000/api/v1/user/payments',
  changeOrigin: true,
 })
);


// Proxy for Flight-Search-Service (for flight-search)
app.use('/api/v1/user/search', createProxyMiddleware({
    target: 'http://localhost:3000/api/v1/user/search',
    changeOrigin: true,
  })
);

app.use("/api", apiRoutes);

// app.get('/cat', AuthMiddlewares.isAuthenticated, (req, res) => {                             for testing isAuthenticated middleware
//     res.json({ message: 'This is a protected cat', user: req.userData });
// })



app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);   
});

