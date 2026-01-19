import { Box, Text } from 'ink'
import * as React from 'react'
import { theme } from '../styles/theme'

function Logo() {
  return (
    <Text color={theme.color.primary}>
      ⬤
    </Text>
  )
}

function LogoContained() {
  return (
    <Box
      borderStyle="single"
      justifyContent="center"
      alignItems="center"
      borderColor={theme.color.mutedBackground}
      paddingY={0}
      paddingX={1}
    >
      <Logo />
    </Box>
  )
}

export { Logo, LogoContained }
