//require dependencies
const express     = require('express');
const app         = express();
const morgan      = require('morgan'); //logging
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');


//require routes
const productRoutes   = require('./api/routes/products');
const listingRoutes   = require('./api/routes/listings');
const orderRoutes     = require('./api/routes/orders');
const userRoutes      = require('./api/routes/users');

//database connection
const databaseURI = process.env.DB_URL2 //ENV set in nodemon.json

mongoose.connect(databaseURI, {dbName: 'radius_api', useNewUrlParser: true });


//logging middleware
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//CORS setup: adding the right headers to the response
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');   //limit * in production
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
})


//using routes
app.use('/products', productRoutes);
app.use('/listings', listingRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);


// seeing that the above routes should catch all valid requests, anything that makes it past those lines without being picked up should throw an error. Which is why error handling can just live below here
app.use((req, res, next) => {
  const error = new Error('not found');
  error.status = 404;
  next(error); //call next function and pass error along
})

//below error handling will be triggered when the above function throws an error, or when any other function throws an error; for example because a db operation failed.
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: 'Oops, an error occured: ' + error.message
    }
  });
});

module.exports = app;
