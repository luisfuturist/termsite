import type { ScrollViewRef } from 'ink-scroll-view'
import process from 'node:process'
import { Box, useInput, useStdout } from 'ink'
import { ScrollView } from 'ink-scroll-view'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { CONTACTME } from './components/CONTACTME'
import { CountdownToSingularity } from './components/CountdownToSingularity'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { README } from './components/README'
import { ScreenTooSmall } from './components/ScreenTooSmall'

const MIN_WIDTH = 120
const MIN_HEIGHT = 30

// Approximate section positions (in lines)
const SECTION_POSITIONS = {
  hero: 0,
  readme: 27, // Hero is ~12 lines
  projects: 48, // Hero + README is ~30 lines
  contactme: 171, // After Projects + CountdownToSingularity + ContactCta
}

const App: React.FC = () => {
  const scrollRef = useRef<ScrollViewRef>(null)
  const { stdout } = useStdout()
  const [dimensions, setDimensions] = useState({
    width: stdout?.columns || 0,
    height: stdout?.rows || 0,
  })

  // 1. Handle Terminal Resizing due to manual window change
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: stdout?.columns || 0,
        height: stdout?.rows || 0,
      })
      scrollRef.current?.remeasure()
    }
    stdout?.on('resize', handleResize)
    return () => {
      stdout?.off('resize', handleResize)
    }
  }, [stdout])

  // 2. Handle Keyboard Input
  useInput((_input, key) => {
    if (key.upArrow) {
      scrollRef.current?.scrollBy(-1) // Scroll up 1 line
    }
    if (key.downArrow) {
      scrollRef.current?.scrollBy(1) // Scroll down 1 line
    }
    if (key.pageUp) {
      // Scroll up by viewport height
      const height = scrollRef.current?.getViewportHeight() || 1
      scrollRef.current?.scrollBy(-height)
    }
    if (key.pageDown) {
      const height = scrollRef.current?.getViewportHeight() || 1
      scrollRef.current?.scrollBy(height)
    }
  })

  // 3. Handle Navigation Keys
  useInput((input) => {
    if (input === 'h' || input === 'H') {
      // Scroll to Hero (top)
      scrollRef.current?.scrollTo(SECTION_POSITIONS.hero)
    }
    if (input === 'r' || input === 'R') {
      // Scroll to README
      scrollRef.current?.scrollTo(SECTION_POSITIONS.readme)
    }
    if (input === 'p' || input === 'P') {
      // Scroll to Projects
      scrollRef.current?.scrollTo(SECTION_POSITIONS.projects)
    }
    if (input === 'c' || input === 'C') {
      // Scroll to CONTACTME
      scrollRef.current?.scrollTo(SECTION_POSITIONS.contactme)
    }
  })

  // 4. Handle Escape or 'q' to quit
  useInput((input, key) => {
    if (key.escape || input === 'q')
      process.exit()
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

  return (
    <Box
      width="100%"
      height="100%"
      position="relative"
    >
      <Box flexDirection="column" paddingX={3} paddingTop={6}>
        <ScrollView ref={scrollRef}>
          <Hero />
          <README />
          <Projects />
          <CountdownToSingularity />
          {/* <ContactCta /> */}
          <CONTACTME />
        </ScrollView>
      </Box>

      <Box position="absolute" paddingX={3} width="100%">
        <Header />
      </Box>
    </Box>
  )
}

export default App
