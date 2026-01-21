import type { PseudoTtyInfo, ServerChannel, Server as ServerType, Session } from 'ssh2'
import fs from 'node:fs'
import process from 'node:process'
import { withFullScreen } from 'fullscreen-ink'
import * as React from 'react'
import ssh2 from 'ssh2'
import App from './App'

const { Server } = ssh2

interface InkSshSession extends Session {
  ptyInfo?: PseudoTtyInfo
}

interface InkStream extends ServerChannel {
  isTTY: boolean
  isRaw: boolean
  columns: number
  rows: number
  setRawMode: (mode: boolean) => void
  ref: () => void
  unref: () => void
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
      .on('session', (accept) => {
        const session = accept() as InkSshSession

        let app: ReturnType<typeof withFullScreen> | null = null
        let stream: InkStream
        let hasPty = false
        let cleanedUp = false

        // Preserve original TERM for restoration after session
        const originalTerm = process.env.TERM

        let resizeTimeout: NodeJS.Timeout | null = null

        const resize = () => {
          if (!stream || !session.ptyInfo)
            return

          if (resizeTimeout)
            clearTimeout(resizeTimeout)

          resizeTimeout = setTimeout(() => {
            stream.columns = session.ptyInfo!.cols
            stream.rows = session.ptyInfo!.rows
            stream.emit('resize')
          }, 50) // 50ms debounce
        }

        const enterFullScreen = () => {
          try {
            // Enable alternate screen buffer, clear screen, hide cursor
            stream?.write('\x1B[?1049h\x1B[H\x1B[2J\x1B[?25l')
          }
          catch {}
        }

        const exitFullScreen = () => {
          try {
            // Show cursor, disable alternate screen buffer
            stream?.write('\x1B[?25h\x1B[?1049l')
          }
          catch {}
        }

        const cleanup = (code = 0) => {
          if (cleanedUp)
            return
          cleanedUp = true

          try {
            app?.instance.unmount()
            exitFullScreen()
            stream?.exit(code)
            stream?.end()

            // Remove all listeners to prevent memory leaks
            stream?.removeAllListeners()
            session?.removeAllListeners()
            client?.removeAllListeners()
            resizeTimeout && clearTimeout(resizeTimeout)

            // Restore original TERM environment variable
            if (originalTerm !== undefined) {
              process.env.TERM = originalTerm
            }
            else {
              delete process.env.TERM
            }
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
          // Set TERM environment variable for Ink components and Node TTY utilities
          const termType = (info as PseudoTtyInfo & { term?: string }).term
          if (termType) {
            process.env.TERM = termType
          }
        })

        session.on('window-change', (accept, _reject, info) => {
          if (session.ptyInfo) {
            session.ptyInfo.rows = info.rows
            session.ptyInfo.cols = info.cols
          }
          resize()
          accept()
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

        const wrapStream = (stream: InkStream) => {
          const originalWrite = stream.write.bind(stream)
          stream.write = (chunk: string | Buffer, encoding?: any, cb?: any) => {
            if (typeof chunk === 'string') {
              chunk = chunk.replace(/\n/g, '\r\n')
            }
            return originalWrite(chunk, encoding, cb)
          }
          return stream
        }

        session.on('shell', (accept) => {
          stream = accept() as InkStream
          stream = wrapStream(stream)

          if (!hasPty) {
            stream.write('Error: PTY required\r\n')
            stream.exit(1)
            stream.end()
            return
          }

          stream.isTTY = true
          stream.setRawMode = (_mode: boolean) => stream
          stream.isRaw = true
          stream.ref = () => stream
          stream.unref = () => stream

          // Set initial dimensions from ptyInfo
          if (session.ptyInfo) {
            stream.columns = session.ptyInfo.cols
            stream.rows = session.ptyInfo.rows
          }

          try {
            // Enter fullscreen mode with alternate screen buffer
            // Switch to alternate buffer, move cursor to top-left, clear screen, hide cursor
            enterFullScreen()

            // Flush the stream to ensure cursor position is correct before Ink starts
            stream.write('', () => {
              try {
                app = withFullScreen(
                  <App />,
                  {
                    stdin: stream as unknown as NodeJS.ReadStream,
                    stdout: stream as unknown as NodeJS.WriteStream,
                    columns: stream.columns,
                    rows: stream.rows,
                    exitOnCtrlC: false,
                  },
                )
                app.start()

                // Ensure cleanup is always called, even on Promise rejection
                app.waitUntilExit()
                  .then(() => cleanup())
                  .catch((error) => {
                    console.error('Ink runtime error:', error)
                    cleanup(1)
                  })
              }
              catch (error) {
                console.error('Ink initialization error:', error)
                exitFullScreen()
                cleanup(1)
              }
            })
          }
          catch (error) {
            console.error('Ink initialization error:', error)
            exitFullScreen()
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
