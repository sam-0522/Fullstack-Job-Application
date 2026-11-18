# CareerConnect – Job Portal

A full-stack job portal built using the MERN stack. CareerConnect allows users to explore job opportunities, search and filter listings, view job details, and submit applications. Administrators can log in, post jobs, and manage candidate applications through a protected dashboard.

> This project is a customized extension of the original [UNC-GDSC Fullstack Job Application](https://github.com/UNC-GDSC/Fullstack-Job-Application) repository.

## Features

### Job Seeker Features
- Browse available job opportunities.
- Search jobs by title, skill, location, and department.
- Filter jobs by employment type.
- Sort job listings.
- View detailed job descriptions.
- Submit applications with candidate information, resume links, and cover letters.
- Explore job categories by department.

### Admin Features
- Secure administrator login using email and password.
- JWT-based authentication.
- Protected job management routes.
- Post new job opportunities.
- View submitted candidate applications.
- Review candidate details, resume links, and cover letters.
- Delete applications through the admin dashboard.
- Admin logout functionality.

### Backend and Security
- REST API built with Express.js.
- MongoDB database integration using Mongoose.
- Password hash verification using bcryptjs.
- JWT authentication and authorization.
- Request validation using express-validator.
- CORS configuration.
- Helmet security headers.
- Rate limiting.
- MongoDB sanitization.
- Environment-based configuration.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React 18, JavaScript |
| UI | Material UI (MUI) |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcryptjs |
| Validation | express-validator |
| Security | Helmet, CORS, express-rate-limit |
| Version Control | Git and GitHub |

## Project Structure

```text
UNC-JobPortal/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   └── applications.js
│   ├── generatePasswordHash.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── JobList.js
│   │   │   ├── JobForm.js
│   │   │   ├── ApplicationForm.js
│   │   │   ├── AdminLogin.js
│   │   │   └── AdminApplications.js
│   │   ├── styles/
│   │   │   └── main.css
│   │   ├── App.js
│   │   ├── config.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── docs/
├── .gitignore
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

Install the following:

- Node.js 18 or higher
- npm 9 or higher
- MongoDB Atlas account or local MongoDB installation
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/UNC-GDSC/Fullstack-Job-Application.git
cd Fullstack-Job-Application
```

### 2. Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create your environment file:

```powershell
Copy-Item .env.example .env
```

Configure `backend/.env` with your own values:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

JWT_SECRET=your_private_jwt_secret
JWT_EXPIRE=7d

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD_HASH=your_bcrypt_password_hash

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Important:
- Replace the MongoDB URI with your own MongoDB Atlas connection string.
- Configure the administrator email and bcrypt password hash.
- Use a strong, private JWT secret.
- Never commit `.env` or share your credentials publicly.

Start the backend:

```bash
npm run dev
```

The backend runs at:

`http://localhost:5000`

### 3. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
```

Create the frontend environment file:

```powershell
Copy-Item .env.example .env
```

Configure `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_TIMEOUT=10000
REACT_APP_COMPANY_NAME=CareerConnect
REACT_APP_ENV=development
```

Start the frontend:

```bash
npm start
```

The application normally opens at:

`http://localhost:3000`

### 4. Access the Application

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| API Health Check | http://localhost:5000/api/health |
| Jobs API | http://localhost:5000/api/jobs |

Keep the backend and frontend running in separate terminals.

## API Endpoints

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/login` | Public |

### Jobs

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/jobs` | Public |
| GET | `/api/jobs/:id` | Public |
| POST | `/api/jobs` | Admin |
| PUT | `/api/jobs/:id` | Admin |
| DELETE | `/api/jobs/:id` | Admin |

### Applications

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/applications` | Public |
| GET | `/api/applications` | Admin |
| GET | `/api/applications/:id` | Admin |
| DELETE | `/api/applications/:id` | Admin |

Protected endpoints require a valid JWT bearer token.

### Health Check

```http
GET /api/health
```

For more API details, refer to the project's API documentation in the `docs/` directory.

## Application Workflow

1. A visitor opens CareerConnect and browses available jobs.
2. The visitor searches, filters, or sorts job listings.
3. The visitor opens a job and submits an application.
4. The application is stored in MongoDB.
5. An administrator logs in.
6. The administrator posts job opportunities and reviews submitted applications.
7. The administrator can manage applications from the dashboard.

## Security Notes

- Passwords are verified against bcrypt hashes.
- JWT tokens protect administrator-only endpoints.
- Environment variables store sensitive configuration.
- CORS restricts permitted frontend origins.
- Request validation and rate limiting help protect API endpoints.

This project is intended as a learning and portfolio project. Additional security review, automated testing, deployment configuration, and production hardening are recommended before real-world production use.

## Future Improvements

- Candidate registration and login.
- Application status tracking.
- Email notifications.
- Advanced job filtering.
- Pagination and improved application management.
- Cloud-based resume upload.
- Automated testing and deployment.

## Acknowledgements

- [UNC-Chapel Hill Google Developer Student Club](https://github.com/UNC-GDSC) for the original open-source project.
- [React](https://react.dev/)
- [Material UI](https://mui.com/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

## License

This project retains the MIT License of the original repository. See the [LICENSE](LICENSE) file for details.
