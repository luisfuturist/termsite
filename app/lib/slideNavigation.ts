import type * as React from 'react'

export interface Slide {
  id: string
  component: React.FC<{ step: number }>
}

export interface Section {
  id: string
  name: string
  shortcut: string
  slides: Slide[]
}

export interface SlideState {
  currentSectionIndex: number
  currentStepIndex: number
}

export function getTotalSlides(sections: Section[]): number {
  return sections.reduce((total, section) => total + section.slides.length, 0)
}

export function getCurrentSlideIndex(sections: Section[], state: SlideState): number {
  let index = 0
  for (let i = 0; i < state.currentSectionIndex; i++) {
    index += sections[i].slides.length
  }
  return index + state.currentStepIndex
}

export function navigateNext(sections: Section[], state: SlideState): SlideState {
  const currentSection = sections[state.currentSectionIndex]

  // Move to next step in current section
  if (state.currentStepIndex < currentSection.slides.length - 1) {
    return {
      ...state,
      currentStepIndex: state.currentStepIndex + 1,
    }
  }

  // Move to first step of next section
  if (state.currentSectionIndex < sections.length - 1) {
    return {
      currentSectionIndex: state.currentSectionIndex + 1,
      currentStepIndex: 0,
    }
  }

  // Already at the end
  return state
}

export function navigatePrevious(sections: Section[], state: SlideState): SlideState {
  // Move to previous step in current section
  if (state.currentStepIndex > 0) {
    return {
      ...state,
      currentStepIndex: state.currentStepIndex - 1,
    }
  }

  // Move to last step of previous section
  if (state.currentSectionIndex > 0) {
    const previousSection = sections[state.currentSectionIndex - 1]
    return {
      currentSectionIndex: state.currentSectionIndex - 1,
      currentStepIndex: previousSection.slides.length - 1,
    }
  }

  // Already at the beginning
  return state
}

export function navigateToSection(sections: Section[], sectionKey: string): SlideState | null {
  const sectionIndex = sections.findIndex(s => s.shortcut.toLowerCase() === sectionKey.toLowerCase())
  if (sectionIndex === -1) {
    return null
  }

  return {
    currentSectionIndex: sectionIndex,
    currentStepIndex: 0,
  }
}
