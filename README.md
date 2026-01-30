# Student Management System

A full-stack web application for managing student records with a Node.js/Express backend, SQLite database, JWT authentication, and responsive HTML/CSS/JavaScript frontend. Ready for deployment on Vercel.

## Features

- ✅ User authentication (Register/Login with JWT)
- ✅ Secure password hashing with bcryptjs
- ✅ Add, view, edit, and delete student records
- ✅ Search students by name or email
- ✅ Student information includes: Name, Email, Phone, Address, Enrollment Date, and Status
- ✅ Responsive design for desktop and mobile devices
- ✅ Real-time data validation
- ✅ Beautiful and intuitive user interface
- ✅ RESTful API endpoints with authentication
- ✅ Vercel deployment ready with serverless support

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: Vercel (serverless)
- **Server Port**: 3000

## Project Structure

```
student-management/
├── server.js              # Express server and API routes
├── package.json           # Node.js dependencies
├── vercel.json            # Vercel deployment configuration
├── .env.example           # Environment variables template
├── students.db            # SQLite database (auto-created)
├── public/                # Frontend files
│   ├── index.html         # Main dashboard (protected)
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   ├── styles.css         # Main CSS styling
│   ├── auth-styles.css    # Authentication pages CSS
│   └── script.js          # Client-side JavaScript
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v12.0.0 or higher)
- npm (comes with Node.js)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/siham-elhakim/student-management.git
   cd student-management
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and set JWT_SECRET to a secure random string
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```
   The application will run on `http://localhost:3000`

5. **Access the application**:
   - Go to `http://localhost:3000/public/login.html` or `http://localhost:3000` will redirect you to login
   - Register a new account or login with your credentials

## Authentication

### Register
- **Endpoint**: `POST /api/auth/register`
- **Body**: `{ "name": "string", "email": "string", "password": "string" }`
- **Response**: User ID and success message

### Login
- **Endpoint**: `POST /api/auth/login`
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: JWT token, user info, and success message
- **Token Storage**: Saved in localStorage as `Bearer token`

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```
   or for development:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## API Endpoints

### Health Check (No Authentication Required)
```
GET /api/health
Response: { "status": "OK", "message": "Server is running" }
```

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
Response: { "id": 1, "message": "User registered successfully. Please login." }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
Response: {
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" },
  "message": "Login successful"
}
```

### Student Endpoints (All Require Authentication)

#### Get All Students
```
GET /api/students
Headers: Authorization: Bearer {token}
```

#### Get Student by ID
```
GET /api/students/:id
Headers: Authorization: Bearer {token}
```

#### Create New Student
```
POST /api/students
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "enrollmentDate": "2024-01-15",
  "status": "Active"
}
```

#### Update Student
```
PUT /api/students/:id
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "0987654321",
  "address": "456 Oak Ave",
  "enrollmentDate": "2024-01-15",
  "status": "Active"
}
```

#### Delete Student
```
DELETE /api/students/:id
Headers: Authorization: Bearer {token}
```

#### Search Students
```
GET /api/students/search/:query
Headers: Authorization: Bearer {token}
```

## Database Schema

### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| name | TEXT | NOT NULL |
| email | TEXT | NOT NULL, UNIQUE |
| password | TEXT | NOT NULL (hashed) |
| createdAt | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### Students Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| userId | INTEGER | FOREIGN KEY (users.id) |
| name | TEXT | NOT NULL |
| email | TEXT | NOT NULL |
| phone | TEXT | NULLABLE |
| address | TEXT | NULLABLE |
| enrollmentDate | TEXT | NOT NULL |
| status | TEXT | DEFAULT 'Active' |
| createdAt | DATETIME | DEFAULT CURRENT_TIMESTAMP |

## Usage

1. **Register**: Create a new account on the registration page
2. **Login**: Sign in with your credentials
3. **Add Student**: Fill in the form and click "Add Student"
4. **View Students**: All your students are displayed in the table
5. **Search**: Use the search box to find students by name or email
6. **Edit**: Click the "Edit" button on any student row to update their information
7. **Delete**: Click the "Delete" button to remove a student
8. **Logout**: Click the "Logout" button in the header to sign out

## Deployment on Vercel

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub account with your repository

### Steps

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add authentication and Vercel configuration"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect the Node.js framework
   - Configure environment variables:
     - `JWT_SECRET`: Set a secure random string (at least 32 characters)
     - `NODE_ENV`: Set to `production`
   - Click "Deploy"

3. **Post-Deployment**:
   - Your app will be live at a Vercel URL
   - Database (students.db) will persist in the Vercel file system during the same deployment
   - For persistent storage across deployments, consider using a remote database service

### Environment Variables for Production
Set these in Vercel dashboard under Project Settings > Environment Variables:
```
JWT_SECRET=your-secure-random-string-here
NODE_ENV=production
```

### Important Notes for Vercel Deployment
- ✅ The application uses serverless functions (compatible with Vercel)
- ✅ No special configuration needed for file uploads
- ✅ SQLite database works locally but data persists only during current deployment
- ⚠️ For production with persistent data, migrate to PostgreSQL, MongoDB, or other cloud database services
- ✅ JWT tokens are stateless and don't require session storage

## Security Considerations

- **Passwords**: Hashed using bcryptjs with salt rounds (10)
- **Tokens**: JWT tokens expire in 7 days
- **API Protection**: All student endpoints require valid JWT token
- **Data Isolation**: Each user can only access their own students
- **HTTPS**: Use HTTPS in production (automatic with Vercel)
- **Environment Variables**: Keep JWT_SECRET secure and never commit it to version control

## Features in Detail

### Form Validation
- Name, Email, and Enrollment Date are required fields
- Email format is validated
- Duplicate emails are prevented (per user)
- Password minimum 6 characters
- Real-time visual feedback for valid/invalid fields

### Search Functionality
- Search by student name or email
- Case-insensitive search
- Reset button to view all students
- Only returns results for logged-in user

### Status Options
- Active
- Inactive
- Graduated

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Touch-friendly buttons and controls
- Optimized layout for different screen sizes

## Error Handling

The application includes comprehensive error handling:
- Database errors are caught and displayed to the user
- Validation errors prevent invalid data entry
- Network errors are handled gracefully
- User-friendly error messages

## Future Enhancements

- User authentication and authorization
- Student grade tracking
- Course management
- Email notifications
- Advanced search filters
- Data export to CSV/PDF
- Dashboard with statistics

## Contributing

Feel free to fork this repository and submit pull requests for any improvements.

## Author

s.elhakim@esisa.ac.ma

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Support

For issues or questions, please create an issue in the GitHub repository.
