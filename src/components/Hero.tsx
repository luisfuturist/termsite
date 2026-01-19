import { Box, Text } from 'ink'
import BigText from 'ink-big-text'
import * as React from 'react'
import { theme } from '../styles/theme'

export const Hero: React.FC = () => {
  return (
    <Box flexDirection="column" paddingY={1} marginTop={2}>
      <Box flexDirection="row" marginBottom={1} gap={4}>
        <Box width="50%">
          <Text color={theme.color.foreground}>
            Today: AI and Machine Learning, Blockchain, Cloud Computing, 5G Networks, IoT Devices, Renewable Energy Tech, Cybersecurity Tools, Quantum Computing, Biotech, Electric Vehicles, AR/VR, Edge Computing, Data Analytics, Robotics, Fintech Platforms
          </Text>
        </Box>
        <Box width="50%">
          <Text color={theme.color.foreground}>
            Tomorrow: AGI, Fusion Energy, BCIs, Nanotech, Space Colonization Tech, Sustainable Materials, Advanced Genomics, Metaverse Infrastructure, Autonomous Everything, Climate Engineering, Holographic Displays, Personalized Medicine, Orbital Manufacturing, Neurotech Enhancements, Global AI Governance
          </Text>
        </Box>
      </Box>

      <Box justifyContent="center">
        <BigText text="Future" font="3d" colors={[theme.color.primary, theme.color.mutedBackground]} />
      </Box>
    </Box>
  )
}
