# termsite - luisfuturist.com TUI Specification

## Overview

SSH-served TUI version of luisfuturist.com using React Ink. Keyboard-first navigation, minimal design, English only.

## Core Data

```yaml
profile:
  name: Luis Emidio
  alias: luisfuturist
  tagline: Future-oriented Full Stack Developer
  language: en

sections:
  - home: landing + intro
  - about: who/mission/skills
  - portfolio: github repos + projects
  - contact: socials/email/discord
```

## Navigation

**Keys:**

- `h` Home | `a` About | `p` Portfolio | `c` Contact
- `q` Quit/Back
- `↑↓` or `j/k` Scroll items
- `Enter` Open selected link

**State:** Current section, fetched data cache

## UI Layout

```
┌─────────────────────────────────────────────┐
│ [●] Luis Emidio                             │
│ Future-oriented Full Stack Developer        │
├─────────────────────────────────────────────┤
│ [H]ome [A]bout [P]ortfolio [C]ontact        │
├─────────────────────────────────────────────┤
│                                             │
│ > Section Content Here                      │
│                                             │
│   • Bullet point                            │
│   • Another item                            │
│   → External link                           │
│                                             │
└─────────────────────────────────────────────┘
 Press 'Q' to quit
```

## Sections

### Home

- Name (stylized: "[●] Luis Emidio")
- Tagline
- Brief intro quote

### About

- **Who I am:** Description
- **My mission:** Purpose statement
- **Skills:** Bulleted list (fast learner, problem solver, etc.)

### Portfolio

- GitHub link: github.com/luisfuturist
- Recent repos (lazy load via GitHub API)
- Fallback: "Under construction" if API fails

### Contact

- **GitHub:** luisfuturist
- **Email:** (display + copyable)
- **Discord:** luisfuturist
- Other socials as available

## Styling (Ink Components)

- **Header:** Bold, underline for name
- **Active nav:** Inverse/highlighted
- **Links:** Dimmed + arrow prefix (→)
- **Sections:** Box borders, dividers
- **Lists:** Bullets (•) for items
- **Loading:** Spinner component

## Technical

### Stack

- React Ink (TUI framework)
- ssh2 (SSH server)
- octokit (GitHub API)

### Features

- Lazy data fetching (Portfolio section only)
- Loading indicators
- Error boundaries + fallback messages
- Terminal size adaptation (min 80x24)
- No color mode fallback

### MVP Checklist

1. ✓ Static sections (Home, About, Contact)
2. ✓ Keyboard navigation
3. ✓ GitHub API integration (Portfolio)
4. ✓ SSH server setup
5. ✓ Error handling

## Edge Cases

- **No network:** Show cached/static data
- **Small terminal:** Wrap text, paginate
- **API rate limit:** Display message + retry
- **No color support:** ASCII-only styling
