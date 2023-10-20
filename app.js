require('dotenv').config();
require('express-async-errors');
const express = require('express');
const noAuthRoutes = require('./routes/no-auth-routes')
const reqAuthRoutes = require('./routes/req-auth-routes')
const auth = require('./routes/auth')
const app = express();
const connectDB = require('./db/connect')
const errorHandlerMiddleware = require('./middleware/error-handler')
const routeAuth = require('./middleware/route-auth')
//extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// trust proxy is important if you are going to host the api on the internet (heroko)
app.set('trust proxy', 1);
app.use(express.json());
app.use(helmet())
app.use(xss())
app.use(cors({
  origin: ['http://192.168.1.7:5173']
}))
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, //limit each ip to 100 requests per windowMs
}))
//routes
app.use('/api/v1', noAuthRoutes)
app.use('/api/v1/auth', auth)
app.use('/api/v1/user', routeAuth, reqAuthRoutes)

//error handlers
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI).then(console.log('connction successful'))
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
