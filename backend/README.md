# Travel Booking System Backend

This is the backend API for the Travel Booking System, deployed on Vercel using serverless functions.

## Folder Structure

```
backend/
├── api/
│   ├── graphql.js       # Main GraphQL API handler
│   └── cleanup.js       # Scheduled cleanup endpoint
├── lib/
│   └── db.js            # Database connection utility
├── models/              # MongoDB models
├── graphql/             # GraphQL schema and resolvers
├── .env                 # Environment variables (local development)
└── vercel.json          # Vercel deployment configuration
```

## Deployment

This backend is configured for Vercel deployment:

1. Push your code to a Git repository
2. Import the repository in the Vercel dashboard
3. Add your MongoDB connection string as an environment variable named "MONGO_URI" in the Vercel project settings
4. Deploy the project

## Scheduled Cleanup

To enable the scheduled cleanup of expired bookings:

1. Go to your Vercel Dashboard
2. Navigate to Project > Settings > Cron Jobs
3. Add a new Cron Job:
   - URL: `/api/cleanup`
   - Schedule: `0 0 * * *` (runs daily at midnight)

## API Endpoints

- GraphQL API: `/graphql`
- Cleanup API: `/api/cleanup`

## Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Make sure to create a `.env` file with your `MONGO_URI` for local development. 