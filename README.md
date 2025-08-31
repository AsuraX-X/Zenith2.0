# Zenith - De Bliss Restaurant

A modern full-stack restaurant application built with React, TypeScript, and Node.js. Features include online ordering, table reservations, user authentication, comprehensive admin management, and automated delivery tracking.

🌐 **Live Website**: [deblissfh.me](https://deblissfh.me)

## 🚀 Features

- **Customer Portal**: Browse menu, place orders, make reservations with real-time validation
- **Enhanced Authentication**: Secure user registration, login, and password reset with email verification
- **Admin Dashboard**: Manage menu items, orders, reservations, and user roles
- **Rider System**: Delivery tracking and management with automated status updates
- **Responsive Design**: Mobile-first approach with optimized touch interfaces
- **Automated Cleanup**: Background jobs for cleaning expired reservations and orders
- **Form Validation**: Comprehensive input validation including Ghanaian phone numbers
- **Password Security**: Visibility toggles and secure reset flow
- **Email Notifications**: Automated order confirmations and status updates

## 🛠 Tech Stack

**Frontend:**

- React 18 + TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- React Icons for consistent iconography
- React Helmet for SEO

**Backend:**

- Node.js + Express
- MongoDB with Mongoose ODM
- JWT Authentication
- BCrypt for password hashing
- Node-cron for automated cleanup jobs
- Nodemailer for email notifications
- Email verification system

## 📁 Project Structure

```
Zenith/
├── frontend/               # React TypeScript frontend
│   ├── admin/             # Admin dashboard components
│   ├── auth/              # Authentication components
│   ├── components/        # Reusable UI components
│   │   ├── admin/         # Admin-specific components
│   │   ├── cart/          # Shopping cart components
│   │   ├── general/       # Header, footer, common components
│   │   ├── home/          # Homepage sections
│   │   ├── menu/          # Menu display and food cards
│   │   ├── order/         # Order management components
│   │   ├── reservation/   # Reservation components
│   │   └── Rider/         # Rider dashboard components
│   ├── routes/            # Page components
│   ├── stores/            # Zustand state management
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and external services
│   ├── config/            # Configuration files
│   ├── Interfaces/        # TypeScript interfaces
│   ├── assets/            # Static assets (fonts, images)
│   └── public/            # Public assets
├── backend/               # Node.js Express backend
│   ├── models/            # MongoDB schemas
│   └── utils/             # Utility functions
├── package.json           # Root dependencies and scripts
├── pnpm-workspace.yaml    # PNPM workspace configuration
├── eslint.config.js       # ESLint configuration
└── start-dev.ps1          # Development startup script
```

## 🔧 Prerequisites

- Node.js 18+
- PNPM package manager
- MongoDB database
- Gmail account for email services

## ⚙️ Environment Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Zenith
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Variables**

   Create a `.env` file in the `backend/` directory:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   ```

## 🚀 Development

**Start the development environment:**

Frontend (Vite dev server):

```bash
pnpm dev
```

Backend (Node.js server):

```bash
cd backend
node index.js
```

Or use the PowerShell script:

```bash
./start-dev.ps1
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:3000`.

## 🏗️ Building for Production

```bash
# Build the frontend
pnpm build

# Preview the production build
pnpm preview
```

## 📱 Key Components & Features

### Authentication System

- **[Login](frontend/auth/Login.tsx)**: Enhanced login with password visibility toggle
- **[Registration](frontend/auth/Register.tsx)**: User registration with form validation
- **[Password Reset](frontend/auth/ForgotPassword.tsx)**: Email verification flow with mobile optimization
- **[Reset Password](frontend/auth/ResetPassword.tsx)**: Secure password reset with email pre-fill

### Admin Management

- **[Admin Panel](frontend/admin/AdminPanel.tsx)**: Complete restaurant management interface
- **[Order Management](frontend/admin/AdminOrders.tsx)**: Real-time order tracking and management
- **[Rider Dashboard](frontend/admin/RiderDashboard.tsx)**: Delivery tracking and rider assignment

### Customer Features

- **Menu System**: Interactive food cards with detailed popups
- **Shopping Cart**: Full cart management with delivery/pickup options
- **Reservations**: Table booking with comprehensive validation using [`CurrentReservations`](frontend/routes/CurrentReservations.tsx)
- **Order Tracking**: Real-time order status updates

### Backend Features

- **[API Server](backend/index.js)**: RESTful API with comprehensive endpoints
- **[Email Service](backend/utils/sendEmail.js)**: Automated notifications using Nodemailer
- **Automated Cleanup**: Cron jobs for cleaning expired data
- **Order Cancellation**: User-initiated order cancellation system
- **Email Verification**: Secure password reset with email codes

## 🔧 Recent Improvements

- ✅ **Mobile Optimization**: Enhanced responsive design for all auth components
- ✅ **Password Security**: Added visibility toggles across all password inputs
- ✅ **Form Validation**: Comprehensive validation including Ghanaian phone numbers
- ✅ **UX Enhancement**: Streamlined password reset flow without duplicate email entry
- ✅ **Automated Cleanup**: Background jobs for database maintenance
- ✅ **Order Management**: User cancellation functionality with proper API routing
- ✅ **Email Notifications**: Welcome emails, order confirmations, and delivery updates
- ✅ **Dark Theme**: Custom dark theme with proper input styling

## 🔒 User Roles

The application supports three user roles:

- **User**: Browse menu, place orders, make reservations
- **Admin**: Full access to dashboard and management features
- **Rider**: Delivery management and tracking

## 🎨 Design & Styling

The application features a modern design system with:

- **Dark Theme**: Custom dark theme in [`app.css`](frontend/app.css) with #0e1113 background
- **Brand Colors**: Primary red (#ff2100) for accents and branding
- **Custom Fonts**: Quicksand font family for consistent typography
- **Responsive Design**: Mobile-first approach with optimized touch interfaces
- **Consistent Icons**: React Icons library for unified iconography
- **Smooth Animations**: Framer Motion for enhanced user interactions
- **Accessibility**: Proper focus states and keyboard navigation

## 📋 Available Scripts

Check [package.json](package.json) for all available scripts:

- `pnpm dev` - Start frontend development server
- `pnpm build` - Build frontend for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🗄️ Database Schema

### Key Models:

- **Users**: Authentication and profile data with password reset tokens
- **Orders**: Order management with status tracking (confirmed, preparing, ready, out-for-delivery, delivered)
- **Reservations**: Table booking with automated cleanup
- **Menu Items**: Food catalog with categories and pricing
- **Accompaniments**: Side dishes and extras
- **Riders**: Delivery personnel management

## 🔄 API Endpoints

### Authentication

- `POST /signup` - User registration with welcome email
- `POST /login` - User authentication with case-insensitive login
- `POST /forgot-password` - Send 6-digit reset code via email
- `POST /reset-password` - Reset password with verification code
- `POST /check-username` - Check username availability

### Orders & Menu

- `GET /menu` - Fetch menu items
- `POST /orders` - Create new order
- `GET /user/orders` - Fetch user orders
- `POST /user/cancel-order` - Cancel user order
- `POST /user/mark-finished` - Mark order as received

### Reservations

- `POST /reservations` - Create reservation
- `GET /user/reservations` - Fetch user reservations
- `DELETE /reservations/:id` - Cancel reservation

### Admin Endpoints

- `POST /admin/create-user` - Create new user account
- `POST /admin/update-price` - Update menu item pricing
- `POST /admin/update-order-status` - Update order status with email notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper testing
4. Ensure all linting passes (`pnpm lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🐛 Known Issues & Future Enhancements

- [ ] Real-time notifications for order status updates
- [ ] Integration with payment gateways
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Push notifications for mobile devices

## 📞 Support

For support and questions:

- **Website**: [deblissfh.me](https://deblissfh.me)
- **Email**: debliss2024@gmail.com
- **Phone**: +233 25 628 6634
- **Location**: Ecobank, Madina
- Create an issue on GitHub

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**De Bliss Food Hub** - Serving love in every dish with 10K+ happy customers and 50+ signature dishes. Experience the perfect blend of traditional Ghanaian flavors and modern technology.

**Hours:**

- Mon-Fri: 8:00 AM - 10:00 PM
- Sat-Sun: 8:00 AM - 9:00 PM
