# Booking Tour Web

A full-stack web application for managing and booking tours, built with a **React** frontend and a **Node.js/Express** backend, using **MongoDB** as the database. The application allows users to browse, search, and create tour packages, with JWT-based authentication for secure access.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- Browse and search tours by keyword, departure point, and destination.
- Create new tours with validation (title, description, services, etc.).
- JWT-based authentication for secure API access (access and refresh tokens).
- Pagination and filtering for tour listings.
- Support for Vietnamese text search with diacritic-insensitive matching (planned).

## Tech Stack

- **Frontend**: React, JavaScript, HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: JSON Web Tokens (JWT)
- **Logging**: Log4js
- **Validation**: Express-validator
- **Others**: dotenv, bcryptjs, jsonwebtoken

## Project Structure

### Client (`client/`)

The frontend of the application, built with React.

```
client/
├── public/                # Static assets (favicon, index.html)
├── src/                   # Source code
│   ├── assets/            # Images, fonts, and other static files
│   ├── components/        # Reusable React components
│   ├── pages/             # Page components (e.g., Home, Tours, Login)
│   ├── services/          # API service functions (fetch tours, auth)
│   ├── App.js             # Main App component
│   ├── index.js           # Entry point for React
│   └── ...                # Other configurations (e.g., routes, styles)
├── package.json           # Client dependencies and scripts
└── README.md              # Client-specific instructions (if any)
```

### Server (`server/`)

The backend API, built with Express and MongoDB.

```
server/
├── configs/               # Configuration files
│   └── db.js              # MongoDB connection setup
├── controllers/           # Request handlers
│   ├── authController.js  # Authentication handlers (login, refresh)
│   └── tourController.js  # Tour-related handlers (create, get tours)
├── middleware/            # Custom middleware
│   ├── authMiddleware.js  # JWT authentication middleware
│   ├── errorMiddleware.js # Global error handling
│   └── validationMiddleware.js # Request validation
├── models/                # Mongoose schemas
│   ├── Tour.js            # Tour schema
│   └── User.js            # User schema (for authentication)
├── routes/                # API routes
│   ├── authRoutes.js      # Auth-related routes (login, refresh)
│   └── tourRoutes.js      # Tour-related routes
├── utils/                 # Utility functions
│   ├── jwt.js             # JWT token generation
│   └── response.js        # Standardized response helpers
├── .env                   # Environment variables (not tracked)
├── app.js                 # Main server entry point
├── package.json           # Server dependencies and scripts
└── .gitignore             # Git ignore rules
```

## Prerequisites

- **Node.js**: v20.17.0 or higher
- **MongoDB**: MongoDB Atlas account or local MongoDB instance
- **Git**: For cloning the repository
- **Postman** (optional): For testing API endpoints

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Nguyentanengr/booking-tour-web.git
   cd booking-tour-web
   ```

2. **Install server dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**:
   ```bash
   cd client
   npm install
   ```

## Running the Application

1. **Start the server**:
   ```bash
   cd server
   npm start
   ```
   - The server will run on `http://localhost:3000`.
   - Ensure MongoDB Atlas is accessible or a local MongoDB instance is running.

2. **Start the client**:
   ```bash
   cd client
   npm run dev
   ```
   - The React app will run on `http://localhost:3000` (default for Create React App).
   - The client will communicate with the server API at `http://localhost:3000/api/v1`.

3. **Test API endpoints (optional)**:
   - Use Postman to test API endpoints (see [API Endpoints](#api-endpoints)).

## API Endpoints

1. **POST `/api/v1/fake-jwt`** (Fake login with custom user):
   - **Request Body**:
     ```json
     {
         "userId": "kdjr3",
         "role": "admin"
     }
     ```
   - **Response**:
     ```json
     {
         "status": "success",
         "data": {
             "accessToken": "eyJhbGciOiJIUzI1NiIsInR5sRrZQu9XnUd4...",
             "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..."
         },
         "error": null,
         "timestamp": "2025-05-12T10:40:02.113Z"
     }
     ```

2. **GET `/api/v1/tours`** (Get all tours):
   - **Query Parameters**: `key` (optional), `from` (optional), `to` (optional), `page` (default: 1), `limit` (default: 10)
   - **Example**: `http://localhost:3000/api/v1/tours?key=hoi an&from=Quang Ngai&to=Hoi An&page=1&limit=10`
   - **Response**: List of tours with pagination metadata.

3. **POST `/api/v1/tours`** (Create a tour, requires `admin` role):
   - **Headers**:
     ```plaintext
     Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5sRrZQu9XnUd4...
     ```
   - **Request Body**:
     ```json
     {
         "title": "Tour du lịch Hội An",
         "description": "Chuyến đi khám phá vẻ đẹp cổ kính của Hội An, với các hoạt động tham quan, mua sắm và trải nghiệm ẩm thực địa phương.",
         "services": ["Hướng dẫn viên", "Vận chuyển", "Ăn uống", "Vé tham quan"],
         "departurePoint": "Đà Nẵng",
         "destination": "Hội An",
         "price": 1500000
     }
     ```
   - **Response**:
     ```json
     {
         "status": "success",
         "data": {
             "title": "Tour du lịch Hội An",
             "description": "Chuyến đi khám phá vẻ đẹp cổ kính của Hội An, với các hoạt động tham quan, mua sắm và trải nghiệm ẩm thực địa phương.",
             "services": [
                 "Hướng dẫn viên",
                 "Vận chuyển",
                 "Ăn uống",
                 "Vé tham quan"
             ],
             "departurePoint": "Đà Nẵng",
             "destination": "Hội An",
             "price": 1500000,
             "deletedAt": null,
             "_id": "6821d00d6929ccdbc5b14d3e",
             "createdAt": "2025-05-12T10:40:13.085Z",
             "updatedAt": "2025-05-12T10:40:13.085Z",
             "__v": 0
         },
         "error": null,
         "timestamp": "2025-05-12T10:40:13.168Z"
     }
     ```


## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.