require('dotenv').config();
const express = require('express');
const connectDB = require('./configs/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const tourRoutes = require('./routes/tourRoutes');
const fakeJwtRoutes = require('./routes/fakeJwtRoutes');
const aPaymentRoutes = require('./routes/aPaymentRoutes');

const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: { type: 'console' }, 
    file: { type: 'file', filename: 'logs/app.log' } 
  },
  categories: {
    default: { appenders: ['console'], level: 'info' }, 
  }
});

const logger = log4js.getLogger(); 


const app = express();

connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/fake-jwt', fakeJwtRoutes);
app.use('/api/v1/payments', aPaymentRoutes);

// Xử lý lỗi toàn cục
app.use(errorMiddleware);

app.listen(3000, () => console.log(`Server running on port 3000`));

