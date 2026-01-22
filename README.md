# termsite

> [!IMPORTANT]
> This project is still a work in progress.

> SSH-accessible Terminal User Interface (TUI) for luisfuturist.com

A personal site that lives in the terminal, built with React Ink and served over SSH. Navigate using keyboard shortcuts, view portfolio projects from GitHub, and interact with a retro-futuristic interface.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run locally
pnpm dev

# Build for production
pnpm build

# Start SSH server (port 2222)
pnpm start:server

# Connect to the SSH server
ssh -p 2222 localhost
```

## Features

- 🎹 **Keyboard-first navigation** - `h` Home | `a` About | `p` Portfolio | `c` Contact | `q` Quit
- 🔌 **SSH server** - Connect from anywhere: `ssh user@host -p 2222`
- 📱 **Responsive TUI** - Adapts to terminal size, fullscreen mode
- 🎨 **React-based** - Built with Ink for component-driven terminal UIs
- 🚀 **GitHub integration** - Dynamically fetches and displays portfolio projects
- 🔐 **Public access** - No authentication required

## Tech Stack

- **UI**: [React](https://react.dev/) + [Ink](https://github.com/vadimdemedes/ink)
- **Server**: [ssh2](https://github.com/mscdex/ssh2) + [node-pty](https://github.com/microsoft/node-pty)
- **Build**: TypeScript + [tsup](https://tsup.egoist.dev/)
- **Infrastructure**: Terraform

## Deployment

Deploy by committing to the `deploy` branch. Infrastructure is managed via Terraform - see `main.tf` for configuration.

## Development

```bash
pnpm dev              # Watch mode with hot reload
pnpm dev:build        # Watch build output
pnpm typecheck        # Run type checking
pnpm lint             # Lint code
pnpm lint:fix         # Auto-fix linting issues
```

## Project Structure

```
src/
├── index.tsx          # CLI entry point
├── server.tsx         # SSH server
├── App.tsx            # Main TUI app
├── components/        # UI components (Hero, Projects, ContactCta, etc.)
└── lib/              # Utilities
```
