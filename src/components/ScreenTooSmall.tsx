import { Box, Text } from 'ink'
import * as React from 'react'
import { theme } from '../styles/theme'
import { QuitHint } from './QuitHint'

interface ScreenTooSmallProps {
  width: number
  height: number
  minWidth: number
  minHeight: number
}

export const ScreenTooSmall: React.FC<ScreenTooSmallProps> = ({ width, height, minWidth, minHeight }) => {
  return (
    <Box
      width="100%"
      height="100%"
      paddingX={3}
      flexDirection="column"
    >
      <ScreenTooSmallHeader />

      <Box justifyContent="center" alignItems="center" height="100%">
        <ScreenTooSmallCard width={width} height={height} minWidth={minWidth} minHeight={minHeight} />
      </Box>
    </Box>
  )
}

function ScreenTooSmallHeader() {
  return (
    <Box justifyContent="space-between" paddingY={1} gap={2} width="100%">
      <Box />
      <QuitHint />
    </Box>
  )
}

interface ScreenTooSmallCardProps {
  width: number
  height: number
  minWidth: number
  minHeight: number
}

function ScreenTooSmallCard({ width, height, minWidth, minHeight }: ScreenTooSmallCardProps) {
  return (
    <Box flexDirection="column" alignItems="center" borderStyle="round" borderColor={theme.color.primary} paddingX={4} paddingY={2}>
      <Text bold color={theme.color.destructive}>
        SCREEN TOO SMALL
      </Text>

      <Box marginTop={1} flexDirection="column" alignItems="center">
        <Text color={theme.color.foreground}>
          This TUI requires a larger terminal window.
        </Text>
      </Box>

      <Box marginTop={2} flexDirection="column" alignItems="center">
        <Text color={theme.color.foreground}>
          Current size:
          {' '}
          {width}
          ×
          {height}
        </Text>
        <Text color={theme.color.foreground}>
          Minimum required:
          {' '}
          {minWidth}
          ×
          {minHeight}
        </Text>
      </Box>

      <Box marginTop={2}>
        <Text dimColor>
          Please resize your terminal and try again.
        </Text>
      </Box>
    </Box>
  )
}
