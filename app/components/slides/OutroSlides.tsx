import { Box, Text } from 'ink'
import BigText from 'ink-big-text'
import * as React from 'react'
import { theme } from '../../styles/theme'

interface OutroSlideProps {
  step: number
}

export const OutroSlide1: React.FC<OutroSlideProps> = () => {
  return (
    <Box flexDirection="column" paddingY={4} justifyContent="center" height="100%">
      <Box justifyContent="center" marginBottom={2}>
        <BigText text="Thank You" font="3d" colors={[theme.color.primary, theme.color.mutedBackground]} />
      </Box>
      <Box justifyContent="center" marginTop={2}>
        <Text color={theme.color.foreground}>
          Press 'Q' to quit
        </Text>
      </Box>
    </Box>
  )
}
