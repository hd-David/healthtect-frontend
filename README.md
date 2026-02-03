# Healthtect Frontend

A modern React-based frontend for the Healthtect healthcare management platform. This application provides an intuitive interface for hospital administrators, radiologists, and clinicians to manage medical imaging studies, AI-powered diagnostics, and hospital operations.

## 🏥 Features

### Role-Based Dashboards
- **Hospital Administrators**: Full access to user management, hospital settings, access logs, and analytics
- **Radiologists**: Access to imaging studies and AI analysis results
- **Clinicians**: View imaging studies and diagnostic results

### Core Functionality
- 🔬 **Medical Imaging Management** - View and manage CT, MRI, X-Ray, and Ultrasound studies
- 🤖 **AI Analysis Results** - Review AI-powered diagnostic insights
- 👥 **User Management** - Invite and manage hospital staff (Admin only)
- 🏨 **Hospital Management** - Configure hospital details and settings
- 📝 **Access Logs** - Monitor system activity and compliance (Admin only)
- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Healthtect Backend API running on `http://localhost:8000`

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hd-David/healthtect-frontend.git
cd healthtect-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Environment Configuration

The app connects to the backend API at `http://localhost:8000` by default. To change this, update the API URLs in the component files or create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:8000
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Landing.js          # Public landing page
│   ├── Login.js            # User authentication
│   ├── Register.js         # Hospital registration
│   ├── Dashboard.js        # Main dashboard (role-based)
│   ├── Study.js            # Imaging studies list
│   ├── AIResult.js         # AI analysis results
│   ├── User.js             # User management (Admin)
│   ├── InviteUser.js       # User invitations (Admin)
│   ├── Hospital.js         # Hospital details (Admin)
│   ├── AccessLogs.js       # System access logs (Admin)
│   ├── ForgotPassword.js   # Password recovery
│   ├── ResetPassword.js    # Password reset
│   └── AcceptInvitation.js # Invitation acceptance
├── App.js                  # Main app with routing
├── FormStyles.css          # Global styles
└── index.js                # App entry point
```

## 🎨 UI/UX

- Modern, responsive design inspired by SmartAdmin
- Dark sidebar navigation with role-based menu items
- Card-based dashboard layout
- Consistent color scheme with purple primary accent
- Mobile-friendly responsive breakpoints

## 🔒 Authentication Flow

1. Users can register as hospital administrators
2. Admins invite staff via email (radiologists, clinicians)
3. Invited users accept invitation and set password
4. JWT tokens stored in localStorage for session management
5. Protected routes redirect unauthenticated users to landing page

## 🛠️ Available Scripts

- `npm start` - Run development server
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

## 🔗 Related

- [Healthtect Backend](https://github.com/hd-David/healthtect) - Django REST API

## 📄 License

This project is proprietary software for Healthtect healthcare platform.

## 👥 Contributors

- Healthtect Development Team
