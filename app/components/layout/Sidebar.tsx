import { Box } from 'ink'
import * as React from 'react'
import { theme } from '../../styles/theme'

interface SidebarProps {
  children?: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <Box width="20%" height="100%" paddingY={1} paddingX={2}>
      <Box
        width="100%"
        borderStyle="single"
        borderColor={theme.color.mutedBackground}
        paddingY={1}
        paddingX={3}
        flexDirection="column"
      >
        {children}
      </Box>
    </Box>
  )
}
