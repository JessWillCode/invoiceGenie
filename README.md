# Invoice Genie 🧞‍♂️

A comprehensive billing and invoice management system built with modern technologies for seamless financial operations.

## 🚀 Tech Stack

### Backend

- **Bun** - Fast JavaScript runtime for backend services
- **TypeScript** - Type-safe development
- **tRPC** - End-to-end typesafe APIs
- **Google Cloud Platform** - Cloud infrastructure
  - **Firestore** - NoSQL database for invoice data
  - **Cloud Tasks** - Job queue for invoice reminders and processing
  - **Cloud Functions** - Serverless compute for background tasks

### Frontend

- **React 18** - Modern UI framework
- **TypeScript** - Type safety across the stack
- **Vite** - Fast development and build tooling
- **Tailwind CSS** - Utility-first styling
- **React Query** - Server state management
- **React Hook Form** - Form handling with validation

## 🏗️ Architecture

```
invoice-genie/
├── packages/
│   ├── backend/          # Bun + tRPC + GCP backend
│   ├── frontend/         # React + TypeScript frontend
│   └── shared/           # Shared types and utilities
├── docs/                 # Documentation
└── scripts/              # Deployment and utility scripts
```

## 🎯 Features

### Core Billing Features

- ✅ Invoice creation and management
- ✅ Client and customer management
- ✅ Payment tracking and status updates
- ✅ Automated invoice reminders
- ✅ PDF generation and email delivery
- ✅ Multi-currency support
- ✅ Tax calculation and reporting

### Technical Features

- ✅ Type-safe API with tRPC
- ✅ Real-time updates with WebSockets
- ✅ Modular component architecture
- ✅ Cloud-native deployment ready
- ✅ Comprehensive error handling
- ✅ Automated testing suite

## 🛠️ Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Node.js](https://nodejs.org/) 18+ (for some tooling)
- Google Cloud Platform account with billing enabled

### Installation

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd invoice-genie
   bun install
   ```

2. **Set up Google Cloud Platform**

   ```bash
   # Install Google Cloud CLI
   # Follow: https://cloud.google.com/sdk/docs/install

   # Authenticate and set project
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID

   # Enable required APIs
   gcloud services enable firestore.googleapis.com
   gcloud services enable cloudtasks.googleapis.com
   gcloud services enable cloudfunctions.googleapis.com
   ```

3. **Configure environment variables**

   ```bash
   cp packages/backend/.env.example packages/backend/.env
   cp packages/frontend/.env.example packages/frontend/.env
   # Edit the .env files with your GCP credentials
   ```

4. **Start development servers**

   ```bash
   bun run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - tRPC Playground: http://localhost:3001/trpc

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Architecture Overview](./docs/architecture.md)
- [Contributing Guidelines](./docs/contributing.md)

## 🧪 Testing

```bash
# Run all tests
bun run test

# Run tests with coverage
bun run test:coverage

# Run specific package tests
bun run --cwd packages/backend test
bun run --cwd packages/frontend test
```

## 🚀 Deployment

### Development

```bash
bun run dev
```

### Production Build

```bash
bun run build
```

### Deploy to GCP

```bash
# Deploy backend services
bun run --cwd packages/backend deploy

# Deploy frontend
bun run --cwd packages/frontend deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Multi-tenant support
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] Integration with payment gateways
- [ ] Advanced automation workflows
- [ ] AI-powered invoice categorization
- [ ] Internationalization (i18n)

---

Built with ❤️ using Bun, tRPC, and Google Cloud Platform
