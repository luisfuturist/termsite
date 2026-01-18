import { Box, Text } from 'ink'
import * as React from 'react'
import { useState } from 'react'

type Section = 'home' | 'about' | 'portfolio' | 'contact'

const App: React.FC = () => {
  const [section, _setSection] = useState<Section>('home')

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="single" flexDirection="column" paddingX={1}>
        {/* Header */}
        <Box justifyContent="space-between">
          <Text bold>[●] Luis Emidio</Text>
          <Text>[EN]</Text>
        </Box>
        <Text>Future-oriented Full Stack Developer</Text>

        {/* Navigation */}
        <Box marginTop={1}>
          <Text>
            [H]ome [A]bout [P]ortfolio [C]ontact
          </Text>
        </Box>

        {/* Content */}
        <Box marginTop={1} flexDirection="column">
          <Text color="green">
            Current section:
            {section}
          </Text>
          <Text dimColor>Press 'Q' to quit (not implemented yet)</Text>
        </Box>
      </Box>
    </Box>
  )
}

export default App
