import type { Buffer as BufferType } from 'node:buffer'
import type { PseudoTtyInfo, ServerChannel, Server as ServerType, Session } from 'ssh2'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import * as pty from 'node-pty'
import ssh2 from 'ssh2'

const { Server } = ssh2

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const INK_APP_PATH = path.join(__dirname, '..', 'app', 'index.js')

interface InkSshSession extends Session {
  ptyInfo?: PseudoTtyInfo
}

new Server(
  {
    hostKeys: [fs.readFileSync('host.key')],
  },
  (client) => {
    client
      .on('authentication', (ctx) => {
        // Accept all authentication requests, no password needed
        // This TUI is public.
        ctx.accept()
      })
      .on('session', (accept, _reject) => {
        const session = accept() as InkSshSession

        let stream: ServerChannel
        let ptyProcess: pty.IPty | null = null
        let hasPty = false
        let cleanedUp = false

        let resizeTimeout: NodeJS.Timeout | null = null

        const resize = () => {
          if (!ptyProcess || !session.ptyInfo)
            return

          if (resizeTimeout)
            clearTimeout(resizeTimeout)

          resizeTimeout = setTimeout(() => {
            ptyProcess!.resize(session.ptyInfo!.cols, session.ptyInfo!.rows)
          }, 50) // 50ms debounce
        }

        const cleanup = (code = 0) => {
          if (cleanedUp)
            return
          cleanedUp = true

          try {
            ptyProcess?.kill()
            stream?.exit(code)
            stream?.end()

            // Remove all listeners to prevent memory leaks
            stream?.removeAllListeners()
            session?.removeAllListeners()
            client?.removeAllListeners()
            resizeTimeout && clearTimeout(resizeTimeout)
          }
          catch {}
        }

        const errorHandler = (error: Error) => {
          console.error(error)
          cleanup()
        }

        session.on('pty', (accept, _reject, info) => {
          accept()
          hasPty = true
          session.ptyInfo = info
        })

        session.on('window-change', (accept, _reject, info) => {
          if (accept) {
            accept()
          }

          if (session.ptyInfo) {
            session.ptyInfo.rows = info.rows
            session.ptyInfo.cols = info.cols
          }
          resize()
        })

        session.on('exec', (accept, _reject, info) => {
          // eslint-disable-next-line no-console
          console.log('exec', info)

          const stream = accept()
          stream.write('This SSH server only supports interactive shells.\r\n')
          stream.write('Please connect without the -t flag or command arguments.\r\n')
          stream.exit(1)
          stream.end()
        })

        session.on('shell', (accept, _reject) => {
          stream = accept()

          if (!hasPty) {
            stream.write('Error: PTY required\r\n')
            stream.exit(1)
            stream.end()
            return
          }

          if (!session.ptyInfo) {
            stream.write('Error: PTY info not available\r\n')
            stream.exit(1)
            stream.end()
            return
          }

          try {
            // Spawn the Ink app as a child process inside a PTY
            // This ensures fullscreen works, no line skipping, and proper cursor positioning
            const termType = (session.ptyInfo as PseudoTtyInfo & { term?: string }).term || 'xterm-256color'

            // Only pass necessary environment variables to avoid leaking sensitive data
            const safeEnvVars = [
              'PATH',
              'HOME',
              'LANG',
              'LC_ALL',
              'LC_CTYPE',
              'NODE_ENV',
            ]
            const filteredEnv: { [key: string]: string } = {}
            for (const key of safeEnvVars) {
              if (process.env[key]) {
                filteredEnv[key] = process.env[key]!
              }
            }

            ptyProcess = pty.spawn('node', [INK_APP_PATH], {
              name: termType,
              cols: session.ptyInfo.cols,
              rows: session.ptyInfo.rows,
              cwd: process.cwd(),
              env: {
                ...filteredEnv,
                TERM: termType,
                FORCE_COLOR: '3',
                COLORTERM: 'truecolor',
              } as { [key: string]: string },
            })

            // Pipe data from PTY to SSH stream
            ptyProcess.onData((data) => {
              stream.write(data)
            })

            // Pipe data from SSH stream to PTY
            stream.on('data', (data: BufferType) => {
              ptyProcess?.write(data.toString())
            })

            // Handle PTY exit
            ptyProcess.onExit(({ exitCode }) => {
              cleanup(exitCode)
            })
          }
          catch (error) {
            console.error('PTY/Ink initialization error:', error)
            cleanup(1)
          }
        })

        client.on('close', cleanup)
        client.on('end', cleanup)
        client.on('error', errorHandler)
      })
  },
)
  .listen(2222, '0.0.0.0', function (this: ServerType) {
    const addr = this.address()
    if (addr && typeof addr !== 'string') {
    // eslint-disable-next-line no-console
      console.log(`Listening... ${addr.address} port ${addr.port}`)
    }
  })
