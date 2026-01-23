import { Box, Text } from 'ink'
import Link from 'ink-link'
import * as React from 'react'
import { theme } from '../styles/theme'
import { LogoContained } from './Logo'
import { QuitHint } from './QuitHint'

function Header() {
  return (
    <Box justifyContent="space-between" paddingY={1} gap={2} width="100%">
      <LogoContained />
      <HeaderNavigation />
      <QuitHint />
    </Box>
  )
}

function HeaderNavigation() {
  return (
    <Box gap={6} borderStyle="single" borderColor={theme.color.mutedBackground} paddingY={0} paddingX={6}>
      <Text color={theme.color.primary}>[H]ome</Text>
      <Text color={theme.color.primary}>[R]EADME</Text>
      <Text color={theme.color.primary}>[P]ROJECTS</Text>
      <Link url="https://x.com/luisfuturist">
        <Text color={theme.color.primary}>X ↗</Text>
      </Link>
      <Link url="https://linkedin.com/in/luisfuturist">
        <Text color={theme.color.primary}>LinkedIn ↗</Text>
      </Link>
      <Text color={theme.color.primary}>[C]ONTACT ME</Text>
    </Box>
  )
}

export { Header, HeaderNavigation }
