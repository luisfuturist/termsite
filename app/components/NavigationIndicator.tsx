import type { Section, SlideState } from '../lib/slideNavigation'
import { Box, Text } from 'ink'
import * as React from 'react'
import { theme } from '../styles/theme'

interface NavigationIndicatorProps {
  sections: Section[]
  state: SlideState
}

export const NavigationIndicator: React.FC<NavigationIndicatorProps> = ({ sections, state }) => {
  const currentSection = sections[state.currentSectionIndex]
  const previousSection = state.currentSectionIndex > 0 ? sections[state.currentSectionIndex - 1] : null
  const nextSection = state.currentSectionIndex < sections.length - 1 ? sections[state.currentSectionIndex + 1] : null

  const totalSteps = currentSection.slides.length
  const currentStep = state.currentStepIndex + 1

  return (
    <Box
      position="absolute"
      bottom={1}
      right={3}
      flexDirection="column"
      alignItems="flex-end"
      gap={1}
    >
      {/* Section navigation info */}
      <Box flexDirection="column" alignItems="flex-end" gap={0}>
        {previousSection && (
          <Text color={theme.color.foreground}>
            ←
            {' '}
            {previousSection.name}
          </Text>
        )}
        <Text bold color={theme.color.primary}>
          {currentSection.name}
        </Text>
        {nextSection && (
          <Text color={theme.color.foreground}>
            {nextSection.name}
            {' '}
            →
          </Text>
        )}
      </Box>

      {/* Step indicator boxes */}
      <Box flexDirection="row" gap={1}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index === state.currentStepIndex
          const isPast = index < state.currentStepIndex

          return (
            <Box
              key={index}
              width={2}
              height={1}
              borderStyle="single"
              borderColor={isActive ? theme.color.primary : theme.color.mutedBackground}
              justifyContent="center"
              alignItems="center"
            >
              <Text color={isActive || isPast ? theme.color.primary : theme.color.foreground}>
                {isActive || isPast ? '●' : '○'}
              </Text>
            </Box>
          )
        })}
      </Box>

      {/* Step counter */}
      <Text color={theme.color.foreground}>
        {currentStep}
        /
        {totalSteps}
      </Text>
    </Box>
  )
}
