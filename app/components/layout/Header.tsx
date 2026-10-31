import { Box } from 'ink'
import * as React from 'react'
import { theme } from '../../styles/theme'

interface HeaderProps {
  children?: React.ReactNode
}

export function Header({ children }: HeaderProps) {
  return (
    <Box width="100%" backgroundColor={theme.color.background} paddingY={1} paddingX={2}>
      {children}
    </Box>
  )
}
