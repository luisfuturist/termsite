import { Box, Text } from 'ink'
import BigText from 'ink-big-text'
import Link from 'ink-link'
import * as React from 'react'
import { BORDER_B, BORDER_T, BORDER_Y } from '../lib/ink'
import { theme } from '../styles/theme'

export const CONTACTME: React.FC = () => {
  return (
    <Box flexDirection="column" padding={4} borderStyle="single" borderColor={theme.color.mutedBackground} marginTop={6}>
      <Box paddingX={2} marginBottom={2}>
        <BigText text="Emidio" font="3d" colors={[theme.color.primary]} />
      </Box>

      <Box paddingX={2} gap={4} marginBottom={4}>
        <Box flexGrow={1}>
          { /* Left side - Description */ }
          <Box width="40%" flexDirection="column">
            <Text color={theme.color.foreground}>
              We still live as standalone individuals, yet the future beckons us to connect. You'll find me on Discord or any social network mentioned here; I'll welcome your message with open code.
            </Text>
          </Box>
        </Box>

        <Box flexDirection="column" width={40} gap={0}>
          <Box borderStyle={BORDER_T} borderColor={theme.color.primary} paddingTop={1}>
            <Text color={theme.color.primary}>[R]EADME</Text>
          </Box>
          <Box borderStyle={BORDER_Y} borderColor={theme.color.primary} paddingY={1}>
            <Text color={theme.color.primary}>[P]ROJECTS</Text>
          </Box>
          <Box borderStyle={BORDER_B} borderColor={theme.color.primary} paddingBottom={1}>
            <Text color={theme.color.primary}>[C]ONTACTME</Text>
          </Box>
        </Box>
      </Box>

      <Box paddingX={2} marginTop={2} gap={2} justifyContent="space-between">
        <Box gap={2}>
          <Link url="https://discord.com">
            <Text color={theme.color.primary}>luisfuturist</Text>
          </Link>
          <Link url="mailto:luisfuturist@gmail.com">
            <Text color={theme.color.primary}>luisfuturist@gmail.com ↗</Text>
          </Link>
        </Box>
        <Box gap={2}>
          <Link url="https://x.com/luisfuturist">
            <Text color={theme.color.primary}>@luisfuturist ↗</Text>
          </Link>
          <Link url="https://linkedin.com/in/luisfuturist">
            <Text color={theme.color.primary}>LinkedIn ↗</Text>
          </Link>
          <Link url="https://github.com/luisfuturist">
            <Text color={theme.color.primary}>GitHub ↗</Text>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
