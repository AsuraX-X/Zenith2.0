# Zenith - De Bliss Restaurant

A modern full-stack restaurant application built with React, TypeScript, and Node.js. Features include online ordering, table reservations, user authentication, comprehensive admin management, and automated delivery tracking.

## 🚀 Features

- **Customer Portal**: Browse menu, place orders, make reservations with real-time validation
- **Enhanced Authentication**: Secure user registration, login, and password reset with email verification
- **Admin Dashboard**: Manage menu items, orders, reservations, and user roles
- **Rider System**: Delivery tracking and management with automated status updates
- **Responsive Design**: Mobile-first approach with optimized touch interfaces
- **Automated Cleanup**: Background jobs for cleaning expired reservations and orders
- **Form Validation**: Comprehensive input validation including Ghanaian phone numbers
- **Password Security**: Visibility toggles and secure reset flow

## 🛠 Tech Stack

**Frontend:**

- React 18 + TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- React Icons for consistent iconography
- Zustand for state management

**Backend:**

- Node.js + Express
- MongoDB with Mongoose ODM
- JWT Authentication
- BCrypt for password hashing
- Node-cron for automated cleanup jobs
- Email verification system

## 📁 Project Structure

```
Zenith/
├── frontend/
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # React entry point
│   ├── admin/               # Admin dashboard components
│   │   ├── AdminPanel.tsx   # Main admin interface
│   │   ├── AdminOrders.tsx  # Order management
│   │   └── RiderDashboard.tsx # Delivery tracking
│   ├── auth/                # Authentication components
│   │   ├── Login.tsx        # User login with password visibility
│   │   ├── Register.tsx     # User registration
│   │   ├── ForgotPassword.tsx # Email verification flow
│   │   └── ResetPassword.tsx # Password reset with validation
│   ├── components/          # Reusable UI components
│   │   ├── cart/           # Shopping cart components
│   │   ├── general/        # Header, footer, common components
│   │   ├── home/           # Homepage sections
│   │   ├── menu/           # Menu display and food cards
│   │   └── order/          # Order management components
│   ├── Context/            # React context providers
│   │   ├── AuthContext.tsx # Authentication state
│   │   ├── CartContext.tsx # Shopping cart state
│   │   ├── PopUpContext.tsx # Modal management
│   │   └── UserContext.tsx # User data management
│   ├── routes/             # Page components
│   │   ├── Home.tsx        # Homepage
│   │   ├── Menu.tsx        # Menu page
│   │   ├── Cart.tsx        # Shopping cart
│   │   └── Orders.tsx      # Order history
│   ├── services/           # API services
│   │   └── api.ts          # API client functions
│   └── assets/             # Static assets
│       ├── fonts/          # Custom fonts
│       └── images/         # Images and graphics
├── backend/                # Node.js backend
│   ├── index.js           # Main server file with API endpoints
│   ├── models/            # MongoDB models
│   │   ├── Order.js       # Order schema
│   │   └── RiderFinishedDelivery.js # Delivery tracking
│   └── package.json       # Backend dependencies
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
├── package.json           # Root dependencies and scripts
└── pnpm-workspace.yaml    # PNPM workspace configuration
```

## 🔧 Prerequisites

- Node.js 18+
- PNPM package manager
- MongoDB database

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
   EMAIL_SERVICE=your_email_service_config
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
- **Reservations**: Table booking with comprehensive validation
- **Order Tracking**: Real-time order status updates

### Backend Features

- **[API Server](backend/index.js)**: RESTful API with comprehensive endpoints
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

## 🔒 User Roles

The application supports three user roles:

- **User**: Browse menu, place orders, make reservations
- **Admin**: Full access to dashboard and management features
- **Rider**: Delivery management and tracking

## 🎨 Design & Styling

The application features a modern design system with:

- **Responsive Design**: Mobile-first approach with optimized touch interfaces
- **Consistent Icons**: React Icons library for unified iconography
- **Smooth Animations**: Framer Motion for enhanced user interactions
- **Modern UI**: Clean layouts with proper spacing and typography
- **Accessibility**: Proper focus states and keyboard navigation
- **Color Scheme**: Carefully chosen colors with good contrast ratios

## 📋 Available Scripts

Check [package.json](package.json) for all available scripts:

- `pnpm dev` - Start frontend development server
- `pnpm build` - Build frontend for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🗄️ Database Schema

### Key Models:

- **Users**: Authentication and profile data
- **Orders**: Order management with status tracking
- **Reservations**: Table booking with automated cleanup
- **Menu Items**: Food catalog with categories
- **Riders**: Delivery personnel management

## 🔄 API Endpoints

### Authentication

- `POST /api/login` - User authentication
- `POST /api/register` - User registration
- `POST /api/forgot-password` - Send reset code
- `POST /api/reset-password` - Reset password with code

### Orders & Reservations

- `GET /api/orders` - Fetch user orders
- `POST /api/cancel-order` - Cancel user order
- `POST /api/reservations` - Create reservation
- `DELETE /api/reservations/:id` - Cancel reservation

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

- Create an issue on GitHub
- Check the documentation in `/docs`
- Review the API endpoints above

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**De Bliss Restaurant** - Serving love in every dish with 10K+ happy customers and 50+ signature dishes. Experience the perfect blend of traditional flavors and modern technology.
