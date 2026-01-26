# termsite

> [!IMPORTANT]
> This project is still a work in progress.

> SSH-accessible Terminal User Interface (TUI) for luisfuturist.com

A personal site that lives in the terminal, built with React Ink and served over SSH. Navigate using keyboard shortcuts and interact with a retro-futuristic interface.

## Quick Start

```bash
# Clone the repository and cd into it
git clone https://github.com/luisfuturist/termsite.git
cd termsite

# Install dependencies
pnpm install

# Generate SSH host key (required for server)
ssh-keygen -t ed25519 -f host.key -N "" -C "termsite-host-key"

# Run locally
pnpm dev

# Build for production
pnpm build

# Start SSH server (port 2222)
pnpm start

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
- **Infrastructure**: Terraform + Docker + Oracle Cloud Infrastructure

## Development

```bash
pnpm dev              # Watch mode with hot reload
pnpm typecheck        # Run type checking
pnpm lint             # Lint code
pnpm lint:fix         # Auto-fix linting issues
```

## Infrastructure

### Initial Setup

1. **Configure Terraform** (first time only)

   ```bash
   # Create terraform.tfvars with your OCI credentials
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   ```

2. **Provision infrastructure**

   ```bash
   terraform init
   terraform apply
   ```

3. **Wait for cloud-init** (installs Docker, ~5 minutes)

   ```bash
   ssh ubuntu@$(terraform output -raw public_ip)
   cloud-init status --wait
   ```

### Destroying

```bash
terraform destroy
```

## Releasing

1. **Setup .env file**

   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

2. **Release**

   ```bash
   pnpm release
   ```

   **Note:** Ensure your image is public on GHCR.

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
