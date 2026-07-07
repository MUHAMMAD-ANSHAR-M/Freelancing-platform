<<<<<<< HEAD
# Forge — Freelancing Platform

A full-stack freelancing marketplace: React + Tailwind frontend, Node/Express
backend with JWT auth and Stripe payments, MongoDB (Mongoose) as the primary
database, with an equivalent SQL schema included for MySQL/PostgreSQL.

```
/freelancing-platform
  /frontend   → React app (Tailwind CSS)
  /backend    → Express API (MongoDB via Mongoose)
  /database   → schema.sql + MongoDB schema reference
```

## 1. Run the frontend

```bash
cd frontend
npm install
npm start        # http://localhost:3000
```

The app reads the API base URL from `REACT_APP_API_URL` (defaults to
`http://localhost:5000/api`). Create `frontend/.env` to override it:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Every page works standalone with sample data even if the backend isn't
running yet (see `pages/Jobs.js`), so you can preview the UI immediately.

## 2. Run the backend

```bash
cd backend
npm install
cp .env.example .env    # then fill in MONGO_URI, JWT_SECRET, STRIPE_SECRET_KEY
npm run dev              # http://localhost:5000, requires nodemon (npm install -D nodemon)
# or: npm start
```

Requires a running MongoDB instance — either local (`mongodb://localhost:27017`)
or a free MongoDB Atlas cluster (recommended, see step 4).

### Key endpoints

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Create account (client or freelancer) |
| POST | `/api/auth/login` | — | Log in, returns JWT |
| GET | `/api/jobs` | — | List/search jobs |
| POST | `/api/jobs` | client | Post a job |
| POST | `/api/proposals` | freelancer | Submit a bid on a job |
| PUT | `/api/proposals/:id/status` | client | Accept/reject a bid |
| POST | `/api/messages` | logged in | Message the other party on a job |
| POST | `/api/reviews` | logged in | Leave a rating after job completion |
| POST | `/api/payments/create-intent` | client | Create a Stripe PaymentIntent for a job |

Full request bodies and validation rules are in `backend/routes/*.js`.

## 3. Set up the database

**MongoDB (used by the backend as-is):**
Models are in `backend/models/`. No manual migration needed — Mongoose
creates collections and indexes automatically on first write. See
`database/mongodb-schema-reference.md` for how the collections relate.

**SQL (MySQL/PostgreSQL alternative):**
Run `database/schema.sql` against your database if you'd rather build the
API on a relational store instead of MongoDB. It mirrors the same entities
and relationships.

## 4. Connect frontend ⇄ backend ⇄ database

1. **Database** — create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas),
   grab the connection string, and put it in `backend/.env` as `MONGO_URI`.
2. **Backend** — `npm run dev` inside `/backend`. Confirm it's up at
   `http://localhost:5000/api/health`.
3. **Frontend** — `npm start` inside `/frontend`. It calls the backend via
   `src/api/client.js`, which attaches the JWT from `localStorage` to every
   request automatically after login/signup.
4. **Auth flow** — Signup/Login pages POST to `/api/auth/signup` or
   `/api/auth/login` → backend returns `{ user, token }` → frontend stores
   both via `AuthContext` (`src/context/AuthContext.js`) → token is sent as
   `Authorization: Bearer <token>` on subsequent requests.

## 5. Payments (Stripe)

1. Create a Stripe account and grab your **secret key** (test mode) from the
   Stripe dashboard → put it in `backend/.env` as `STRIPE_SECRET_KEY`.
2. Backend exposes `POST /api/payments/create-intent`, which creates a
   PaymentIntent for a job's budget and returns a `clientSecret`.
3. On the frontend, use `@stripe/stripe-js` + `@stripe/react-stripe-js`
   (not scaffolded here — add via `npm install @stripe/stripe-js
   @stripe/react-stripe-js`) to mount a payment form with that
   `clientSecret` and confirm the card payment.
4. Stripe confirms success/failure asynchronously via webhook —
   `POST /api/payments/webhook` is already wired up in `server.js` to update
   the `Payment` record's status. Point your Stripe webhook endpoint at
   `https://<your-backend-domain>/api/payments/webhook` and set the signing
   secret if you want to verify signatures (not yet enforced in the sample
   code — add `stripe.webhooks.constructEvent` in `paymentController.js`
   before going to production).

## 6. Testing

- Import the routes above into Postman and test each one with a real JWT
  from `/api/auth/login`.
- Run frontend (`npm start`) and backend (`npm run dev`) side by side and
  click through: signup → post a job → browse jobs → submit a proposal.

## 7. Deployment

| Piece | Suggested host |
|---|---|
| Frontend | Vercel or Netlify — `npm run build` then deploy `/frontend/build` |
| Backend | Render, Railway, or Heroku — deploy `/backend` as a Node service |
| Database | MongoDB Atlas (managed) |

After deploying, update:
- `frontend/.env` → `REACT_APP_API_URL` to your live backend URL
- `backend/.env` → `CLIENT_URL` to your live frontend URL (used for CORS)
- Stripe dashboard → webhook endpoint to your live backend URL

## 8. Scaling ideas (not implemented, noted for future work)

- **Caching** — Redis for hot job listings and session/rate-limit data.
- **Logging** — Winston (or pino) with structured JSON logs shipped to a
  log aggregator.
- **Analytics** — a dashboard aggregating job volume, proposal acceptance
  rate, and payment totals per client/freelancer.
- **Real-time messaging** — swap the polling-based `/api/messages` GET for
  a WebSocket (Socket.IO) layer if you need live chat instead of
  request/refresh.
=======
# Freelancing-platform
   The Freelancing Platform is a web‑based solution designed to connect clients and freelancers seamlessly. It enables project posting, secure payments, user authentication, and efficient task management. With intuitive UI, robust backend, and integrated APIs, it ensures smooth collaboration, transparency, and scalability.
>>>>>>> 054c236755fc2039acbf126c40983afa610dd5e2
