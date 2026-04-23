# Portfolio Spec - Ravi Sai Vigneswara

## Concept & Vision
A premium, high-tech portfolio that feels like stepping into a command center for the future of web development. The design merges **liquid glass aesthetics** with **cyberpunk-inspired UI elements**, creating an immersive experience that showcases technical mastery while maintaining elegant simplicity. Every interaction feels intentional, responsive, and premium—designed to impress even the most discerning tech recruiters.

## Design Language

### Aesthetic Direction
**"Neural Interface"** - Inspired by futuristic command centers, with translucent glass panels floating over subtle grid backgrounds, glowing accent borders, and smooth morphing transitions. Think Minority Report meets Apple's design philosophy.

### Color Palette
- **Primary**: `#6366f1` (Indigo) - Main brand color
- **Secondary**: `#8b5cf6` (Violet) - Accent gradients
- **Accent**: `#06b6d4` (Cyan) - Interactive highlights
- **Glass Light**: `rgba(255, 255, 255, 0.1)` - Glass panels light
- **Glass Dark**: `rgba(15, 23, 42, 0.6)` - Glass panels dark
- **Background Light**: `#f8fafc` - Light mode
- **Background Dark**: `#0a0a0f` - Dark mode (deep space black)
- **Text Light**: `#1e293b` - Light mode text
- **Text Dark**: `#f1f5f9` - Dark mode text

### Typography
- **Headings**: Inter (700, 800) - Clean, futuristic
- **Body**: Inter (400, 500) - Highly readable
- **Mono/Code**: JetBrains Mono - Technical credibility
- **Scale**: 12px / 14px / 16px / 20px / 24px / 32px / 48px / 64px / 96px

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
- Container max-width: 1400px
- Section padding: 96px vertical, 24px horizontal

### Motion Philosophy
- **Entrance animations**: Fade up + scale (0.95 → 1) with 600ms ease-out, staggered 100ms
- **Hover states**: Scale 1.02-1.05 with 200ms spring physics
- **Page transitions**: Smooth crossfade with slight y-axis movement
- **Micro-interactions**: Subtle glow pulses, border shimmer on focus
- **Scroll animations**: Parallax backgrounds, reveal on intersection
- **Spring config**: stiffness: 100, damping: 15 for natural feel

### Visual Assets
- Custom SVG icons with gradient fills
- Animated gradient mesh backgrounds
- Glass morphism cards with subtle noise texture
- Glowing orb/particle effects in hero
- Grid pattern overlays with low opacity

## Layout & Structure

### Navigation
- Fixed glassmorphism navbar with blur backdrop
- Logo with subtle glow effect on hover
- Nav links with underline animation
- Theme toggle (sun/moon with morph animation)
- CTA button with gradient border animation

### Hero Section
- Full viewport height with centered content
- Animated typing effect for role titles
- Floating glass cards with skills
- Particle/gradient orb background animation
- Scroll indicator with bounce animation

### About Section
- Split layout: Image/avatar area + bio content
- Stats cards with count-up animation
- Glass card with personal story
- Subtle parallax on scroll

### Skills Section
- Interactive skill cards with hover reveals
- Categorized: Frontend, AI/ML, Tools, Design
- Progress indicators with animated fills
- Icon + label + description format

### Projects Section
- Large featured project cards
- Hover reveals project details
- Tech stack tags
- Live demo + GitHub links
- Filter/category tabs

### Experience Timeline
- Vertical timeline with glass nodes
- Scroll-triggered reveals
- Company logos + role details
- Skill tags per role

### Contact Section
- Glass contact form
- Social links with hover animations
- Availability status indicator
- CTA with gradient animation

### Footer
- Minimal with signature animation
- Quick links
- Copyright with current year

## Features & Interactions

### Theme Toggle
- Smooth 400ms transition on all color properties
- Icon morphs between sun/moon
- Persists in localStorage
- System preference detection on first load

### Scroll Animations
- Intersection Observer triggers
- Elements fade up + in from 30px below
- Staggered delays for grouped elements
- Once-only animation (doesn't repeat on scroll up)

### Card Interactions
- Hover: Scale 1.03, elevated shadow, border glow
- Click: Slight press effect (scale 0.98)
- Focus: Visible glow ring for accessibility

### Navigation
- Scroll spy highlights active section
- Smooth scroll to sections
- Mobile hamburger menu with slide animation

### Form Interactions
- Floating labels that animate on focus
- Real-time validation feedback
- Submit button loading state
- Success/error toast notifications

### Cursor Effects (Desktop)
- Custom cursor follower with spring physics
- Cursor changes on interactive elements
- Subtle trail effect

## Component Inventory

### GlassCard
- Background: `rgba(255,255,255,0.05)` with backdrop-blur
- Border: 1px solid `rgba(255,255,255,0.1)`
- Border-radius: 16px
- States: default, hover (glow + scale), active (slight press)

### Button
- Primary: Gradient background (indigo → violet)
- Secondary: Glass with gradient border
- Ghost: Transparent with hover fill
- States: default, hover, active, disabled, loading

### SkillBadge
- Icon + text in glass container
- Hover reveals skill level tooltip
- Animated on scroll-into-view

### ProjectCard
- Large glass panel with image preview
- Overlay with details on hover
- Tech stack pills
- Action buttons (demo, source)

### TimelineNode
- Glowing dot on vertical line
- Expandable content panel
- Date badge
- Connection line animation

### NavLink
- Text with animated underline
- Active state highlight
- Hover color transition

### ThemeToggle
- Circular button with icon
- Rotation animation on toggle
- Smooth color transition

### Input
- Glass background
- Floating label
- Focus ring animation
- Error state with shake

## Technical Approach

### Stack
- React 18 + TypeScript
- Vite for build
- Tailwind CSS for styling
- Framer Motion for animations
- React Intersection Observer for scroll triggers
- Lucide React for icons

### Architecture
- Single page application
- Component-based structure
- Custom hooks for theme, scroll position
- CSS custom properties for theming
- Semantic HTML throughout

### Performance
- Lazy load images
- Debounced scroll handlers
- Will-change hints for animated elements
- Optimized re-renders with useMemo/useCallback

### Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- Reduced motion media query support
- Sufficient color contrast
- Focus visible states

### Hostability
- Static export ready
- Single index.html output
- No server dependencies
- GitHub Pages compatible
