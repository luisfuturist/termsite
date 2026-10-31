import { Box, Text } from 'ink'
import BigText from 'ink-big-text'
import Link from 'ink-link'
import * as React from 'react'
import { BORDER_T } from '../../lib/ink'
import { theme } from '../../styles/theme'

interface CountdownSlideProps {
  step: number
}

export const CountdownSlide1: React.FC<CountdownSlideProps> = () => {
  return (
    <Box flexDirection="column" paddingY={4} justifyContent="center" height="100%">
      <Box flexDirection="column" paddingX={4} borderStyle="single" borderColor={theme.color.mutedBackground}>
        <Box justifyContent="space-between" paddingX={2} marginBottom={2}>
          <Text bold color={theme.color.primary}>
            Countdown to Singularity
          </Text>
          <Link url="https://en.wikipedia.org/wiki/Technological_singularity">
            <Text color={theme.color.primary}>↗ [READ MORE]</Text>
          </Link>
        </Box>
        <Box paddingX={2} gap={4}>
          <Box width="40%" flexDirection="column">
            <Text color={theme.color.foreground}>
              Much like a black hole's gravitational pull, which grows exponentially stronger near its event horizon, the Technological Singularity describes a future where AI surpasses human intelligence, triggering rapid, uncontrollable progress.
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export const CountdownSlide2: React.FC<CountdownSlideProps> = () => {
  return (
    <Box flexDirection="column" paddingY={4} justifyContent="center" height="100%">
      <Box flexDirection="column" paddingX={4} borderStyle="single" borderColor={theme.color.mutedBackground}>
        <Box justifyContent="space-between" paddingX={2} marginBottom={2}>
          <Text bold color={theme.color.primary}>
            Countdown to Singularity
          </Text>
          <Link url="https://en.wikipedia.org/wiki/Technological_singularity">
            <Text color={theme.color.primary}>↗ [READ MORE]</Text>
          </Link>
        </Box>
        <Box width="90%" flexDirection="row" paddingRight={8}>
          <Box
            flexDirection="row"
            gap={1}
            marginBottom={2}
            width="100%"
          >
            <Box
              width="100%"
              borderStyle={BORDER_T}
              borderColor={theme.color.primary}
              marginTop={9}
            >
              <Text color={theme.color.primary}>Singularity</Text>
            </Box>
            <Box
              width="100%"
              borderStyle={BORDER_T}
              borderColor={theme.color.primary}
              marginTop={6}
            >
              <Text color={theme.color.primary}>2030</Text>
            </Box>
            <Box
              width="100%"
              borderStyle={BORDER_T}
              borderColor={theme.color.primary}
              marginTop={3}
              flexDirection="row"
              justifyContent="space-between"
            >
              <Text color={theme.color.primary}>2027</Text>
              <BigText
                text="45"
                font="3d"
                colors={[theme.color.primary, theme.color.mutedBackground]}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
