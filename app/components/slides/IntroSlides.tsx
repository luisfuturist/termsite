import { Box, Text } from 'ink'
import BigText from 'ink-big-text'
import * as React from 'react'
import { theme } from '../../styles/theme'

interface IntroSlideProps {
  step: number
}

export const IntroSlide1: React.FC<IntroSlideProps> = () => {
  return (
    <Box paddingX={4} paddingY={2} flexDirection="column" justifyContent="space-between" alignItems="center" height="100%" position="relative">
      <Box flexGrow={1} />

      <Box justifyContent="center" marginBottom={2} flexGrow={1}>
        <BigText text="Future" font="3d" colors={[theme.color.primary, theme.color.mutedBackground]} />
      </Box>

      <Box flexDirection="row">
        <Box width="50%">
          <Text color={theme.color.primary}>
            Today: AI and Machine Learning, Blockchain, Cloud Computing, 5G Networks, IoT Devices, Renewable Energy Tech, Cybersecurity Tools, Quantum Computing, Biotech, Electric Vehicles, AR/VR, Edge Computing, Data Analytics, Robotics, Fintech Platforms
          </Text>
        </Box>
        <Box width="50%">
          <Text color={theme.color.primary}>
            Tomorrow: AGI, Fusion Energy, BCIs, Nanotech, Space Colonization Tech, Sustainable Materials, Advanced Genomics, Metaverse Infrastructure, Autonomous Everything, Climate Engineering, Holographic Displays, Personalized Medicine, Orbital Manufacturing, Neurotech Enhancements, Global AI Governance
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
