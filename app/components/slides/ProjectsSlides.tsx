import { Box, Newline, Text } from 'ink'
import BigText from 'ink-big-text'
import Link from 'ink-link'
import * as React from 'react'
import { BORDER_B } from '../../lib/ink'
import { theme } from '../../styles/theme'

interface Project {
  id: string
  name: string
  link: string
  linkType: 'WEBSITE' | 'GITHUB'
}

const projects: Project[] = [
  {
    id: '01',
    name: 'NEURALMIND.AI',
    link: 'https://neuralmind.ai',
    linkType: 'WEBSITE',
  },
  {
    id: '02',
    name: 'GAIA',
    link: 'https://9aia.com',
    linkType: 'WEBSITE',
  },
  {
    id: '03',
    name: 'A. GARAGE',
    link: 'https://github.com/agarage',
    linkType: 'GITHUB',
  },
  {
    id: '04',
    name: 'LUIS EMIDIO',
    link: 'https://github.com/luisfuturist',
    linkType: 'GITHUB',
  },
]

interface ProjectsSlideProps {
  step: number
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <Box
      flexDirection="column"
      borderStyle={BORDER_B}
      borderColor={theme.color.primary}
      padding={2}
    >
      <Box flexDirection="column">
        <Box flexDirection="row">
          <Text color={theme.color.primary}>{project.id}</Text>
          <Box flexGrow={1}>
            <BigText
              text={project.name}
              font="simple3d"
              colors={[theme.color.primary, theme.color.foreground]}
            />
          </Box>
        </Box>
        <Box justifyContent="flex-end">
          <Link url={project.link}>
            <Text color={theme.color.primary}>
              [GOTO
              {' '}
              {project.linkType}
              ]
            </Text>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export const ProjectsSlide1: React.FC<ProjectsSlideProps> = () => {
  return (
    <Box flexDirection="column" paddingY={4} justifyContent="center" height="100%">
      <Box flexDirection="row" gap={4}>
        <Box marginBottom={2} width="25%">
          <Text bold color={theme.color.primary}>
            PROJECTS
            <Newline />
            & ORGANIZATIONS
          </Text>
        </Box>
        <Box width="75%" flexDirection="column">
          <ProjectCard project={projects[0]} />
        </Box>
      </Box>
    </Box>
  )
}

export const ProjectsSlide2: React.FC<ProjectsSlideProps> = () => {
  return (
    <Box flexDirection="column" paddingY={4} justifyContent="center" height="100%">
      <Box flexDirection="row" gap={4}>
        <Box marginBottom={2} width="25%">
          <Text bold color={theme.color.primary}>
            PROJECTS
            <Newline />
            & ORGANIZATIONS
          </Text>
        </Box>
        <Box width="75%" flexDirection="column">
          <ProjectCard project={projects[1]} />
        </Box>
      </Box>
    </Box>
  )
}

export const ProjectsSlide3: React.FC<ProjectsSlideProps> = () => {
  return (
    <Box flexDirection="column" paddingY={4} justifyContent="center" height="100%">
      <Box flexDirection="row" gap={4}>
        <Box marginBottom={2} width="25%">
          <Text bold color={theme.color.primary}>
            PROJECTS
            <Newline />
            & ORGANIZATIONS
          </Text>
        </Box>
        <Box width="75%" flexDirection="column">
          <ProjectCard project={projects[2]} />
        </Box>
      </Box>
    </Box>
  )
}

export const ProjectsSlide4: React.FC<ProjectsSlideProps> = () => {
  return (
    <Box flexDirection="column" paddingY={4} justifyContent="center" height="100%">
      <Box flexDirection="row" gap={4}>
        <Box marginBottom={2} width="25%">
          <Text bold color={theme.color.primary}>
            PROJECTS
            <Newline />
            & ORGANIZATIONS
          </Text>
        </Box>
        <Box width="75%" flexDirection="column">
          <ProjectCard project={projects[3]} />
        </Box>
      </Box>
    </Box>
  )
}
