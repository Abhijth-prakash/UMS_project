# 🛡️ UMS - User Management System

A full-stack User Management System built with Node.js, Express.js, MongoDB, and EJS. It includes user authentication, email verification, password reset, and an admin dashboard to manage users.

---

## 🚀 Features

### User Side
- User Registration with image upload
- Login with email & password
- Email verification via link
- Forgot password & reset via email
- View and edit profile
- Session-based authentication

### Admin Side
- Admin login with session
- Dashboard to view all users
- Add, edit, and delete users
- Admin forgot password & reset
- View admin profile

---

## 🛠️ Tech Stack

| Package | Version | Usage |
|---|---|---|
| express | ^5.2.1 | Web framework |
| mongoose | ^9.2.1 | MongoDB ODM |
| mongodb | ^7.1.0 | Database driver |
| ejs | ^4.0.1 | Templating engine |
| bcrypt | ^6.0.0 | Password hashing |
| express-session | ^1.19.0 | Session management |
| multer | ^2.0.2 | Image/file uploads |
| nodemailer | ^8.0.1 | Sending emails |
| body-parser | ^2.2.2 | Request body parsing |
| randomstring | ^1.3.1 | Token generation |
| random | ^5.4.1 | Random number generation |
| string | ^3.3.3 | String utilities |
| nodemon | ^3.1.11 | Dev auto-restart |

Frontend styled with **Bootstrap 5** (CDN)

---

## 🔒 Security Features

- Passwords hashed with **bcrypt**
- Session-based authentication with **express-session**
- Protected routes with custom middleware
- Email verification before login
- Password reset via secure email link
