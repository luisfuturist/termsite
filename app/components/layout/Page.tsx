import { Box } from 'ink'
import * as React from 'react'
import { theme } from '../../styles/theme'

interface PageProps {
  children: React.ReactNode
}

export function Page({ children }: PageProps) {
  return (
    <Box
      width="100%"
      height="100%"
      flexDirection="column"
      backgroundColor={theme.color.background}
    >
      {children}
    </Box>
  )
}
