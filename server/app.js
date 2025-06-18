require('dotenv').config();
const express = require('express');
const connectDB = require('./configs/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const tourRoutes = require('./routes/aTourRoutes');
const fakeJwtRoutes = require('./routes/fakeJwtRoutes');
const aPaymentRoutes = require('./routes/aPaymentRoutes');
const authRoutes = require('./routes/authRoutes');   
const aBookingRoutes = require('./routes/aBookingRoutes'); 
const aAccountRoutes = require('./routes/aAccountRoutes');
const aOverviewRoutes = require('./routes/aOverviewRoutes');
const aTourRoutes = require('./routes/aTourRoutes');

const log4js = require('log4js');
const cors = require('cors');

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
app.use(cors());

connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/fake-jwt', fakeJwtRoutes);
app.use('/api/v1/admin/payments', aPaymentRoutes);
app.use('/api/v1/admin/bookings', aBookingRoutes);
app.use('/api/v1/admin/accounts', aAccountRoutes);
app.use('/api/v1/admin/overviews', aOverviewRoutes);
app.use('/api/v1/admin/tours', aTourRoutes);

// Xử lý lỗi toàn cục
app.use(errorMiddleware);

app.listen(3000, () => console.log(`Server running on port 3000`));

