require('dotenv').config();
const express = require('express');
const connectDB = require('./configs/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const tourRoutes = require('./routes/tourRoutes');
const fakeJwtRoutes = require('./routes/fakeJwtRoutes');


const app = express();

connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/fake-jwt', fakeJwtRoutes);

// Xử lý lỗi toàn cục
app.use(errorMiddleware);

app.listen(3000, () => console.log(`Server running on port 3000`));