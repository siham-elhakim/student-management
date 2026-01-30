# Student Management System

A full-stack web application for managing student records with a Node.js/Express backend, SQLite database, and responsive HTML/CSS/JavaScript frontend.

## Features

- ✅ Add, view, edit, and delete student records
- ✅ Search students by name or email
- ✅ Student information includes: Name, Email, Phone, Address, Enrollment Date, and Status
- ✅ Responsive design for desktop and mobile devices
- ✅ Real-time data validation
- ✅ Beautiful and intuitive user interface
- ✅ RESTful API endpoints

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Server Port**: 3000

## Project Structure

```
student-management/
├── server.js              # Express server and API routes
├── package.json           # Node.js dependencies
├── students.db            # SQLite database (auto-created)
├── public/                # Frontend files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS styling
│   └── script.js          # Client-side JavaScript
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v12.0.0 or higher)
- npm (comes with Node.js)

### Steps

1. **Clone the repository** (if cloning from GitHub):
   ```bash
   git clone https://github.com/siham-elhakim/student-management.git
   cd student-management
   ```

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

### Get All Students
```
GET /api/students
```

### Get Student by ID
```
GET /api/students/:id
```

### Create New Student
```
POST /api/students
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

### Update Student
```
PUT /api/students/:id
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

### Delete Student
```
DELETE /api/students/:id
```

### Search Students
```
GET /api/students/search/:query
```

## Database Schema

### Students Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| name | TEXT | NOT NULL |
| email | TEXT | NOT NULL, UNIQUE |
| phone | TEXT | NULLABLE |
| address | TEXT | NULLABLE |
| enrollmentDate | TEXT | NOT NULL |
| status | TEXT | DEFAULT 'Active' |

## Usage

1. **Add Student**: Fill in the form at the top and click "Add Student"
2. **View Students**: All students are displayed in the table below the form
3. **Search**: Use the search box to find students by name or email
4. **Edit**: Click the "Edit" button on any student row to update their information
5. **Delete**: Click the "Delete" button to remove a student (confirmation required)

## Features in Detail

### Form Validation
- Name, Email, and Enrollment Date are required fields
- Email format is validated
- Duplicate emails are prevented
- Real-time visual feedback for valid/invalid fields

### Search Functionality
- Search by student name or email
- Case-insensitive search
- Reset button to view all students

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
