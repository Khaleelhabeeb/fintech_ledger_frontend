# Fintech Ledger Frontend

A modern, responsive financial ledger application built with Vue 3, TypeScript, and Tailwind CSS.

## Features

- **Multi-Currency Accounts** - Manage accounts in USD, EUR, GBP, and JPY
- **Balance Tracking** - Real-time balance updates with version history
- **Transactions** - Deposit and withdraw funds with detailed transaction history
- **Visual Analytics** - Interactive charts showing balance trends over time
- **Secure Authentication** - JWT-based authentication with protected routes
- **Fully Responsive** - Optimized for mobile, tablet, and desktop devices
- **Modern UI** - Clean, intuitive interface with smooth animations

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd fintech_ledger
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Demo Credentials

```
Email: demo@ledger.com
Password: Demo123!
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
fintech_ledger/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable Vue components
│   │   ├── charts/      # Chart components
│   │   ├── common/      # Common UI components
│   │   ├── layout/      # Layout components
│   │   └── transactions/ # Transaction-specific components
│   ├── layouts/         # Page layouts
│   ├── pages/           # Page components
│   │   └── auth/        # Authentication pages
│   ├── router/          # Vue Router configuration
│   ├── services/        # API services
│   ├── stores/          # Pinia stores
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.vue          # Root component
│   └── main.ts          # Application entry point
├── public/              # Public static files
└── index.html           # HTML template
```

## Key Features

### Dashboard
- View current balance across all accounts
- Interactive balance history chart
- Recent transaction list
- Quick deposit/withdraw actions

### Accounts
- Multi-currency account management
- Switch between accounts seamlessly
- View account details and balances

### Transactions
- Complete transaction history
- Filter by type, date range
- Pagination support
- Detailed transaction information

### Version History
- Track all balance changes
- View historical versions
- See who made changes and when

### Settings
- Manage profile information
- Set default account
- Change password

## Responsive Design

The application is fully responsive with optimized layouts for:
- **Mobile** (< 768px) - Touch-friendly interface with drawer navigation
- **Tablet** (768px - 1023px) - Balanced layout with optimized spacing
- **Desktop** (≥ 1024px) - Full-featured layout with sidebar navigation


## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the repository.
