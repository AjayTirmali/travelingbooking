# Travel Booking System

A full-stack travel booking application built with React, Node.js, Express, GraphQL, and MongoDB.

## Features

- Create and manage travel bookings
- View active bookings
- Delete bookings
- Automatic removal of expired bookings
- Responsive design

## Project Structure

```
travel-booking-system/
├── backend/             # Backend server code
│   ├── config/          # Configuration files
│   ├── graphql/         # GraphQL schema and resolvers
│   ├── models/          # MongoDB models
│   ├── package.json     # Backend dependencies
│   └── index.mjs        # Server entry point
├── frontend/            # Frontend React application
│   ├── public/          # Static files
│   ├── src/             # React source code
│   │   ├── components/  # React components
│   │   └── App.js       # Main App component
│   └── package.json     # Frontend dependencies
├── .gitignore           # Git ignore file
├── package.json         # Root package.json for scripts
└── README.md            # Project documentation
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd travel-booking-system
   ```

2. Install dependencies for both frontend and backend:
   ```
   npm run install:all
   ```

3. Set up environment variables:
   - Create a `.env` file in the backend directory with the following variables:
     ```
     MONGO_URI=mongodb://localhost:27017/travelBookingDB
     PORT=5000
     ```

## Running the Application

1. Start both the backend and frontend concurrently:
   ```
   npm start
   ```

   This will start:
   - Backend server at http://localhost:5000
   - Frontend application at http://localhost:3000

2. Alternatively, you can start them separately:
   - Backend: `npm run start:backend`
   - Frontend: `npm run start:frontend`

## Deployment

### Backend Deployment

1. Build the backend:
   ```
   cd backend
   npm install
   ```

2. Set up environment variables on your hosting platform:
   - `MONGO_URI`: Your MongoDB connection string
   - `PORT`: The port for your server (often set by the hosting platform)

3. Start the server:
   ```
   npm start
   ```

### Frontend Deployment

1. Build the frontend:
   ```
   npm run build
   ```

2. Deploy the contents of the `frontend/build` directory to your static hosting service.

3. Ensure the frontend is configured to connect to your deployed backend GraphQL endpoint.

## Cleaning Up

To clean up node_modules and other generated files:

```
npm run clean
```

## License

ISC 