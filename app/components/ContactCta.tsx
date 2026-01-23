import { Box, Text } from 'ink'
import BigText from 'ink-big-text'
import Link from 'ink-link'
import * as React from 'react'
import { theme } from '../styles/theme'

export const ContactCta: React.FC = () => {
  return (
    <Box
      justifyContent="space-between"
      alignItems="center"
      padding={4}
      borderStyle="single"
      borderColor={theme.color.primary}
      marginTop={9}
    >
      <Box paddingX={8} justifyContent="space-between" alignItems="center" width="100%">
        <Box flexGrow={1}>
          <BigText text="Let's UDP or TCP." font="simple3d" colors={[theme.color.primary]} />
        </Box>

        <Box
          width={20}
          backgroundColor={theme.color.mutedBackground}
          paddingY={1}
          paddingX={3}
        >
          <Link url="https://luisfuturist.com/contact">
            <Text color={theme.color.primary}>
              Contact Me ↗
            </Text>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
