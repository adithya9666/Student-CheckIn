# Student Check-in Backend API

Backend API for the Student Check-in application built with Node.js, Express, Supabase, and JWT authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory (use `.env.example` as a template):
```bash
cp .env.example .env
```

3. Configure your environment variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `JWT_SECRET`: A secret key for JWT token signing (use a strong random string)
   - `JWT_EXPIRES_IN`: Token expiration time (default: 7d)
   - `PORT`: Server port (default: 3001)
   - `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)

## Database Schema

You'll need to create the following tables in Supabase:

### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Entries Table
```sql
CREATE TABLE entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  course TEXT,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/signup` - Register a new user
  - Body: `{ email, password, name? }`
  - Returns: `{ user, token }`

- `POST /api/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ user, token }`

### Entries (Requires Authentication)

- `POST /api/entry` - Create a new check-in entry
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ studentName, studentId, course?, location?, notes? }`
  - Returns: `{ entry }`

- `GET /api/entries` - Get all entries for authenticated user
  - Headers: `Authorization: Bearer <token>`
  - Query params: `limit?`, `offset?`, `studentId?`, `course?`
  - Returns: `{ entries, count }`

- `DELETE /api/entry/:id` - Delete an entry
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ message }`

## Authentication

All entry endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```
