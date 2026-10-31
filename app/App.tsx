import type { Section, SlideState } from './lib/slideNavigation'
import { Box, Text, useApp, useInput, useStdout } from 'ink'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Footer, Header, Main, Page, Sidebar } from './components/layout/index'
import { ScreenTooSmall } from './components/ScreenTooSmall'
import { ContactSlide1, ContactSlide2 } from './components/slides/ContactSlides'
import { CountdownSlide1, CountdownSlide2 } from './components/slides/CountdownSlides'
import { IntroSlide1 } from './components/slides/IntroSlides'
import { OutroSlide1 } from './components/slides/OutroSlides'
import { ProjectsSlide1, ProjectsSlide2, ProjectsSlide3, ProjectsSlide4 } from './components/slides/ProjectsSlides'
import { ReadmeSlide1 } from './components/slides/ReadmeSlides'
import { navigateNext, navigatePrevious, navigateToSection } from './lib/slideNavigation'
import { theme } from './styles/theme'

const MIN_WIDTH = 120
const MIN_HEIGHT = 30

// Define sections with their slides
const sections: Section[] = [
  {
    id: 'intro',
    name: 'Intro',
    shortcut: 'i',
    slides: [
      { id: 'intro-1', component: IntroSlide1 },
    ],
  },
  {
    id: 'readme',
    name: 'Readme',
    shortcut: 'r',
    slides: [
      { id: 'readme-1', component: ReadmeSlide1 },
    ],
  },
  {
    id: 'projects',
    name: 'Projects',
    shortcut: 'p',
    slides: [
      { id: 'projects-1', component: ProjectsSlide1 },
      { id: 'projects-2', component: ProjectsSlide2 },
      { id: 'projects-3', component: ProjectsSlide3 },
      { id: 'projects-4', component: ProjectsSlide4 },
    ],
  },
  {
    id: 'countdown',
    name: 'Countdown',
    shortcut: 'c',
    slides: [
      { id: 'countdown-1', component: CountdownSlide1 },
      { id: 'countdown-2', component: CountdownSlide2 },
    ],
  },
  {
    id: 'contact',
    name: 'Contact',
    shortcut: 't',
    slides: [
      { id: 'contact-1', component: ContactSlide1 },
      { id: 'contact-2', component: ContactSlide2 },
    ],
  },
  {
    id: 'outro',
    name: 'Outro',
    shortcut: 'o',
    slides: [
      { id: 'outro-1', component: OutroSlide1 },
    ],
  },
]

const App: React.FC = () => {
  const { stdout } = useStdout()
  const { exit } = useApp()
  const [dimensions, setDimensions] = useState({
    width: stdout?.columns || 0,
    height: stdout?.rows || 0,
  })
  const [slideState, setSlideState] = useState<SlideState>({
    currentSectionIndex: 0,
    currentStepIndex: 0,
  })

  // Handle Terminal Resizing
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: stdout?.columns || 0,
        height: stdout?.rows || 0,
      })
    }
    stdout?.on('resize', handleResize)
    return () => {
      stdout?.off('resize', handleResize)
    }
  }, [stdout])

  // Handle Navigation: Up/Down arrows
  useInput((_input, key) => {
    if (key.upArrow) {
      setSlideState(prev => navigatePrevious(sections, prev))
    }
    if (key.downArrow) {
      setSlideState(prev => navigateNext(sections, prev))
    }
  })

  // Handle Section Navigation Keys
  useInput((input) => {
    const newState = navigateToSection(sections, input)
    if (newState) {
      setSlideState(newState)
    }
  })

  // Handle Escape or 'q' to quit
  useInput((input, key) => {
    if (
      key.escape
      || input === 'q'
      || (key.ctrl && input === 'c')
    ) {
      exit()
    }
  })

  // Check if screen is too small
  const isScreenTooSmall = dimensions.width < MIN_WIDTH || dimensions.height < MIN_HEIGHT

  if (isScreenTooSmall) {
    return (
      <ScreenTooSmall
        width={dimensions.width}
        height={dimensions.height}
        minWidth={MIN_WIDTH}
        minHeight={MIN_HEIGHT}
      />
    )
  }

  // Get current slide component
  const currentSection = sections[slideState.currentSectionIndex]
  const currentSlide = currentSection.slides[slideState.currentStepIndex]
  const CurrentSlideComponent = currentSlide.component

  return (
    <Page>
      <Header>
        <Text bold color={theme.color.primary}>Luis Emidio</Text>
      </Header>

      <Box flexDirection="row" flexGrow={1} height="100%">
        <Sidebar>
          <Box>
            <Text>
              [R] README
            </Text>
          </Box>
          <Box>
            <Text>[P] Projects</Text>
          </Box>
          <Box>
            <Text>[C] Countdown</Text>
          </Box>
          <Box>
            <Text>[T] Contact</Text>
          </Box>
          <Box>
            <Text>[O] Outro</Text>
          </Box>
        </Sidebar>

        <Main>
          <CurrentSlideComponent step={slideState.currentStepIndex} />
        </Main>
      </Box>

      <Footer>
        <Text>Footer</Text>
      </Footer>
    </Page>
  )
}

export default App
