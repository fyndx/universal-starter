# Universal Starter (Expo + Elysia)

A full-stack universal starter template with Bun workspaces featuring:

- **Frontend**: Universal Expo app (iOS, Android, Web)
- **Backend**: Elysia server with Bun runtime

## Stack

### Frontend

- [Expo Router](https://docs.expo.dev/routing/introduction/) - File-based routing
- [NativeWind](https://www.nativewind.dev/) - Tailwind CSS for React Native
- [Better Auth](https://github.com/Better-Auth) - Authentication
- [Legend State](https://legendapp.com/open-source/state/) - State management
- [react-native-reusables](https://github.com/reusables) - Accessible UI components

### Backend

- [Elysia](https://elysiajs.com/) - TypeScript HTTP framework
- [Bun](https://bun.sh/) - JavaScript runtime & toolchain

## Project Structure

```
.
├── apps/
│   ├── expo/           # Universal Expo app
│   └── server/         # Elysia backend
├── packages/           # Shared packages
└── package.json        # Workspace root
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0
- [Node.js](https://nodejs.org/) >= 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

```bash
# Clone the repo
git clone https://github.com/fyndx/universal-starter.git

# Install dependencies
bun install

# Start development
bun dev
```

### Development Commands

```bash
# Start both frontend and backend
bun dev

# Start frontend only
bun workspace expo dev

# Start backend only
bun workspace server dev

# Build for production
bun build
```

### Mobile Development

```bash
# iOS
bun workspace expo ios

# Android
bun workspace expo android
```

# Monorepo Inspiration

1. https://github.com/nktnet1/rt-stack

## License

MIT
