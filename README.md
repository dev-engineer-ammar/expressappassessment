# Express + MongoDB Auth API

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and set `MONGODB_URI` (replace `<db_password>`) and `JWT_SECRET`.
3. `npm run dev` (or `npm start`)

## Endpoints
- `POST /api/auth/register` — `{ name, email, password }` → returns `{ token }`
- `POST /api/auth/login` — `{ email, password }` → returns `{ token }`
- All `/api/timesheets/*` routes require header: `Authorization: Bearer <token>`
  - `GET /api/timesheets`
  - `POST /api/timesheets` — `{ week, dateRange, status }`
  - `PUT /api/timesheets/:id`
  - `DELETE /api/timesheets/:id`

## Deploy to Vercel
1. Push this folder to GitHub.
2. Import the repo in Vercel.
3. Add Environment Variables in Vercel dashboard:
   - `MONGODB_URI` = your full Mongo connection string (with real password)
   - `JWT_SECRET` = any long random string
4. Deploy. Your API base URL is `https://<project>.vercel.app`.

> ⚠️ Never commit your real MongoDB password. Always use environment variables.
