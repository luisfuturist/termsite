import { Box, Text } from 'ink'
import BigText from 'ink-big-text'
import Link from 'ink-link'
import * as React from 'react'
import { BORDER_T } from '../lib/ink'
import { theme } from '../styles/theme'

export const CountdownToSingularity: React.FC = () => {
  return (
    <Box flexDirection="column" paddingX={4} paddingTop={4} borderStyle="single" borderColor={theme.color.mutedBackground} marginTop={9}>
      <Box justifyContent="space-between" paddingX={2} marginBottom={2}>
        <Text bold color={theme.color.primary}>
          Countdown to Singularity
        </Text>
        <Link url="https://en.wikipedia.org/wiki/Technological_singularity">
          <Text color={theme.color.primary}>↗ [READ MORE]</Text>
        </Link>
      </Box>

      <Box paddingX={2} gap={4}>
        { /* Left side - Description */ }
        <Box width="40%" flexDirection="column">
          <Text color={theme.color.foreground}>
            Much like a black hole's gravitational pull, which grows exponentially stronger near its event horizon, the Technological Singularity describes a future where AI surpasses human intelligence, triggering rapid, uncontrollable progress. This self-improving AI creates a feedback loop, compressing vast advancements into moments, reshaping reality beyond prediction or comprehension, akin to crossing an inescapable cosmic threshold.
          </Text>
        </Box>
      </Box>

      <Box width="90%" flexDirection="row" paddingRight={8}>
        {/* Timeline markers */}
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
  )
}
