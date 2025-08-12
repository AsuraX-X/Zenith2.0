# Zenith - De Bliss Restaurant

A modern full-stack restaurant application built with React, TypeScript, and Node.js. Features include online ordering, table reservations, user authentication, and comprehensive admin management.

## 🚀 Features

- **Customer Portal**: Browse menu, place orders, make reservations
- **Authentication**: Secure user registration and login
- **Admin Dashboard**: Manage menu items, orders, reservations, and user roles
- **Rider System**: Delivery tracking and management
- **Responsive Design**: Mobile-first approach with modern UI

## 🛠 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- React Icons for iconography

**Backend:**
- Node.js + Express
- MongoDB with Mongoose ODM
- JWT Authentication
- BCrypt for password hashing

## 📁 Project Structure

```
Zenith/
├── app/
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # React entry point
│   ├── admin/               # Admin dashboard components
│   │   ├── AdminMenuItems.tsx
│   │   ├── AdminOrders.tsx
│   │   ├── AdminReservations.tsx
│   │   ├── AdminSideBar.tsx
│   │   └── CreateRole.tsx
│   ├── auth/                # Authentication components
│   ├── backend/             # Node.js backend
│   ├── components/          # Reusable UI components
│   ├── routes/              # Page components
│   ├── services/            # API services
│   ├── stores/              # State management
│   └── assets/              # Static assets
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies and scripts
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
   
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   
   Create a `.env` file in the `app/backend/` directory with your MongoDB connection string.

## 🚀 Development

**Start both frontend and backend:**

On Windows (PowerShell):
```powershell
./start-dev.ps1
```

**Or run separately:**

Frontend (Vite dev server):
```bash
pnpm dev
```

Backend (Node.js server):
```bash
cd app/backend
node index.js
```

The frontend will be available at `http://localhost:5173` and the backend API at the configured port.

## 🏗️ Building for Production

```bash
# Build the frontend
pnpm build

# Preview the production build
pnpm preview
```

## 📱 Key Components

- **[About Page](app/routes/About.tsx)**: Restaurant story and statistics featuring "De Bliss" branding
- **[Authentication](app/auth/Auth.tsx)**: User login and registration system
- **[Admin Dashboard](app/admin/)**: Complete restaurant management interface
- **[Backend API](app/backend/index.js)**: RESTful API with MongoDB integration

## 🔒 User Roles

The application supports three user roles:
- **User**: Browse menu, place orders, make reservations
- **Admin**: Full access to dashboard and management features  
- **Rider**: Delivery management and tracking

## 🎨 Styling

The application uses a dark theme with:
- Primary background: `#0e1113`
- Accent color: `#ff1200` (red)
- Modern gradients and animations
- Responsive design patterns

## 📋 Available Scripts

Check [package.json](package.json) for all available scripts:
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**De Bliss Restaurant** - Serving love in every dish with 10K+ happy customers and 50+ signature
