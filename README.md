# termsite

> [!IMPORTANT]
> This project is still a work in progress.

> SSH-accessible Terminal User Interface (TUI) for luisfuturist.com

A personal site that lives in the terminal, built with React Ink and served over SSH. Navigate using keyboard shortcuts, view portfolio projects from GitHub, and interact with a retro-futuristic interface.

## Quick Start

```bash
# Install dependencies
pnpm install

# Generate SSH host key (required for server)
ssh-keygen -t ed25519 -f host.key -N "" -C "termsite-host-key"

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

Deploy by pushing to the `deploy` branch. The application runs in Docker on Oracle Cloud Infrastructure.

### Prerequisites

1. **Infrastructure Setup**: Provision the server using Terraform
   ```bash
   terraform init
   terraform apply
   ```

2. **GitHub Secrets**: Configure these secrets in your repository:
   - `GH_TOKEN` - GitHub token for GHCR access
   - `OCI_HOST` - Server IP address
   - `OCI_SSH_KEY` - SSH private key for server access

3. **Host Key**: The SSH host key is automatically generated on the server during provisioning. See [docs/HOST_KEY_SETUP.md](docs/HOST_KEY_SETUP.md) for details.

### Deployment Process

The GitHub Actions workflow automatically:
1. Builds and pushes Docker image to GHCR
2. Deploys to Oracle VM via SSH
3. Pulls latest image and restarts container

For more details on host key management, see [docs/HOST_KEY_SETUP.md](docs/HOST_KEY_SETUP.md).

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
app/
├── index.tsx          # CLI entry point
├── App.tsx            # Main TUI app
├── components/        # UI components (Hero, Projects, ContactCta, etc.)
└── lib/               # Utilities
server/
└── main.ts            # SSH server
```
