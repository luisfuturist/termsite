import { Box } from 'ink'
import * as React from 'react'
import { theme } from '../../styles/theme'

interface MainProps {
  children?: React.ReactNode
}

export function Main({ children }: MainProps) {
  return (
    <Box width="100%" height="100%" backgroundColor={theme.color.background} paddingY={1} paddingX={2}>
      <Box width="100%" borderStyle="single" borderColor={theme.color.mutedBackground}>
        {children}
      </Box>
    </Box>
  )
}
