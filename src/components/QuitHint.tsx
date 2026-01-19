import { Box, Text } from 'ink'
import * as React from 'react'

function QuitHint() {
  return (
    <Box paddingY={1} paddingX={2}>
      <Text dimColor>Press [q] to quit</Text>
    </Box>
  )
}

export { QuitHint }
