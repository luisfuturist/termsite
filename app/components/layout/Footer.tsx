import { Box } from 'ink'
import * as React from 'react'
import { theme } from '../../styles/theme'

interface FooterProps {
  children?: React.ReactNode
}

export function Footer({ children }: FooterProps) {
  return (
    <Box width="100%" backgroundColor={theme.color.background}>
      {children}
    </Box>
  )
}
