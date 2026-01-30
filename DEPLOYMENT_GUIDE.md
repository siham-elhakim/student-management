# Student Management System - Vercel Deployment Guide

## 🚀 Complete Deployment Instructions

### ✅ What Has Been Implemented

1. **User Authentication System**
   - User registration with password hashing (bcryptjs)
   - User login with JWT token generation
   - Token validation on all protected routes
   - Secure password storage (never stored in plaintext)

2. **Frontend Authentication**
   - Login page with email/password form
   - Registration page with validation
   - Automatic redirect to login if not authenticated
   - User info displayed in header
   - Logout functionality

3. **Vercel Configuration**
   - `vercel.json` configured for serverless deployment
   - Proper routing for API and static files
   - Environment variable support for JWT_SECRET

4. **Security Features**
   - JWT tokens with 7-day expiration
   - Password hashing with bcryptjs
   - Data isolation per user
   - Authentication required for all student endpoints

---

## 📋 Pre-Deployment Checklist

- [x] User authentication system implemented
- [x] JWT token generation and validation
- [x] Login and registration pages created
- [x] Vercel configuration file created
- [x] Environment variables configured
- [x] Code committed and pushed to GitHub
- [ ] Vercel deployment (next steps)
- [ ] Test application on Vercel
- [ ] Configure custom domain (optional)

---

## 🔧 Step-by-Step Vercel Deployment

### Step 1: Verify GitHub Push
Your code has been pushed to:
```
https://github.com/siham-elhakim/student-management.git
```

Check the commits and files are present on GitHub.

### Step 2: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select "Import Git Repository"
4. Search for and select `student-management`
5. Click "Import"

### Step 3: Configure Environment Variables

In the Vercel Project Settings:

1. Go to Settings → Environment Variables
2. Add the following variables:

**Production Environment:**
```
JWT_SECRET=your-secure-random-string-min-32-chars
NODE_ENV=production
```

Example JWT_SECRET (generate a secure one):
```
e7f3g9h2k4m6n8p1q3r5s7t9v1w3x5z7a9b1c3d5e7f9g1h3j5k7l9m1n3p5r7
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete (usually 2-3 minutes)
3. You'll get a Vercel URL like: `https://student-management-xyz.vercel.app`

### Step 5: Test Your Application

1. Open the Vercel URL in your browser
2. You should be redirected to login page
3. Click "Register" to create a new account
4. Fill in the registration form:
   - Name: Your name
   - Email: Your email
   - Password: At least 6 characters
5. Login with your credentials
6. Create some student records
7. Test add, edit, search, and delete functionality

---

## 🔑 Environment Variables Explained

### JWT_SECRET
- **Purpose**: Sign and verify JWT tokens
- **Security**: Must be a long, random string
- **Generation**: Use this command:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Never**: Commit this to GitHub (it's in .env which is in .gitignore)

### NODE_ENV
- **Development**: `development`
- **Production**: `production`
- **Purpose**: Controls logging and error handling verbosity

---

## 🌍 Accessing Your Deployed App

After successful deployment:

1. **Login Page**: `https://your-vercel-url/public/login.html`
2. **Auto-redirect**: Accessing root URL will redirect to login
3. **API Endpoints**: `https://your-vercel-url/api/*`

---

## 🐛 Troubleshooting

### Issue: "JWT_SECRET is undefined"
**Solution**: Add JWT_SECRET in Vercel Environment Variables

### Issue: "Cannot POST /api/auth/login"
**Solution**: Check that vercel.json routes are configured correctly

### Issue: "Students table not initialized"
**Solution**: This is normal on first load. Refresh the page after login.

### Issue: "localStorage is not defined"
**Solution**: Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: CORS errors
**Solution**: The app is same-origin so CORS shouldn't be an issue. Check browser console for actual error.

---

## 📱 Database Persistence

### Current Setup (SQLite)
- Database file: `students.db`
- Persists during single deployment
- Data is reset on new deployments

### For Production with Persistent Data

Consider migrating to:

1. **PostgreSQL** (Recommended)
   - Use [Heroku PostgreSQL](https://www.heroku.com/postgres) or [Railway](https://railway.app)
   - Update `server.js` to use `pg` package instead of `sqlite3`

2. **MongoDB** (Popular)
   - Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Update `server.js` to use `mongoose`

3. **Firebase**
   - Use [Firebase Realtime Database](https://firebase.google.com)
   - Automatic backup and scaling

Example migration would require:
```bash
npm install pg
# Update server.js with PostgreSQL connection
# Update database queries to PostgreSQL syntax
```

---

## 🔐 Security Best Practices

### Current Implementation ✅
- Passwords hashed with bcryptjs
- JWT tokens for stateless authentication
- HTTPS on Vercel (automatic)
- No sensitive data in localStorage except token

### Recommended for Production 🔒
1. Add rate limiting to prevent brute force attacks
2. Add CSRF protection
3. Use secure HTTP-only cookies instead of localStorage
4. Add request validation
5. Monitor for suspicious activity
6. Regular security audits

Example rate limiting:
```bash
npm install express-rate-limit
```

---

## 📊 Monitoring & Logs

### View Logs on Vercel
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Deployments"
4. Click on latest deployment
5. View "Functions" tab for errors

### Common Log Messages
- "Connected to SQLite database" - ✅ Good
- "Students table initialized" - ✅ Good
- "Server running on http://localhost:3000" - ✅ Local only (ignore in production)

---

## 🚀 Performance Optimization

### Current Optimizations
- Minified CSS and JavaScript
- Efficient database queries
- JWT tokens reduce session overhead
- Static file caching on Vercel

### Further Optimization
1. Add API response caching
2. Lazy load student data (pagination)
3. Compress images
4. Use CDN for static assets

---

## 🔄 Continuous Deployment

### Automatic Deployments
- Every push to `main` branch triggers automatic Vercel deployment
- Deployment preview for pull requests
- Automatic rollback capability

### Manual Deployment
If needed, from Vercel Dashboard:
1. Go to Deployments
2. Click "Redeploy" on any previous deployment
3. Or push to main branch to trigger new deployment

---

## 💡 Useful Commands

### Local Development
```bash
# Install dependencies
npm install

# Start local server
npm start

# Test API with curl
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"123456"}'
```

### GitHub Operations
```bash
# Check status
git status

# See recent commits
git log --oneline -5

# Create new branch
git checkout -b feature/new-feature
git push origin feature/new-feature
```

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Node.js Docs**: https://nodejs.org/docs
- **Express.js**: https://expressjs.com
- **JWT.io**: https://jwt.io/introduction
- **SQLite**: https://www.sqlite.org/docs.html

---

## ✨ Next Steps

1. ✅ Deploy to Vercel (see steps above)
2. ✅ Test all functionality
3. 📌 Configure custom domain (if needed)
4. 🔐 Set up production database
5. 📊 Monitor application performance
6. 🔄 Set up CI/CD pipeline
7. 📝 Keep documentation updated

---

## 📝 Version Control

- **Repository**: https://github.com/siham-elhakim/student-management.git
- **Main Branch**: Contains production-ready code
- **Commits**: Use descriptive commit messages
- **Pull Requests**: For feature branches before merging to main

---

**Deployment Date**: January 30, 2026  
**Author**: Siham Elhakim (s.elhakim@esisa.ac.ma)  
**License**: MIT
