import { Box, Text } from 'ink'
import Link from 'ink-link'
import * as React from 'react'
import { theme } from '../styles/theme'

export const README: React.FC = () => {
  return (
    <Box flexDirection="row" marginTop={6} gap={4}>
      <Box width="50%">
        <Text bold color={theme.color.primary}>
          README
        </Text>
      </Box>

      <Box flexDirection="column" width="50%">
        <Box marginBottom={1}>
          <Text color={theme.color.primary}>
            I will live this technological transformation, and so will you. Together, we will witness the acceleration of intelligence, the merging of imagination with code, and the unfolding of possibilities that will reshape how we think, create, and interact with the world. Every innovation, every discovery, every moment that emerges—we will experience in a future that is already taking form.
          </Text>
        </Box>

        <Box marginBottom={1}>
          <Text color={theme.color.foreground}>
            I'm a technologist with a focus on R&D and a generalist's curiosity. By day, I work with R&D in innovative AI solutions at
            {' '}
            <Text underline>
              <Link url="https://neuralmind.ai">NeuralMind</Link>
            </Text>
            , and in my own time, I lead and develop experimental projects as a founder at
            {' '}
            <Text underline>
              <Link url="https://9aia.com">Gaia</Link>
            </Text>
            . This hands-on experience is supported by a formal undergraduate degree in AI at
            {' '}
            <Text underline>
              <Link url="https://fiap.com.br">FIAP</Link>
            </Text>
            {' '}
            along with continuous self-taught learning. In my free time, I have my creative pursuits, which include hobby gamedev under my organization,
            {' '}
            <Text underline>
              <Link url="https://github.com/agarage">A. Garage</Link>
            </Text>
            . I also have broader fascinations with the future, STEM, and philosophy, and I enjoy sci-fi as a form of leisure.
          </Text>
        </Box>

        <Box>
          <Link url="https://linkedin.com/in/luisfuturist">
            <Text color={theme.color.primary}>
              [VIEW MORE]
            </Text>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
