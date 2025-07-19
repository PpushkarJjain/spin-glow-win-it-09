# Framer Motion Animation Implementation Rules

## Core Animation Principles

### Performance First
- **ALWAYS** use `transform` and `opacity` properties for animations (GPU-accelerated)
- **NEVER** animate `width`, `height`, `top`, `left`, or other layout properties directly
- Use `scale`, `translateX`, `translateY`, `translateZ` instead of changing dimensions
- Implement `will-change: transform` for elements that will be animated
- Use `layoutId` for shared element transitions between components

## Core Performance Principles

### Lightweight Animation Mandate
- **ALWAYS** prioritize performance over visual complexity
- **ENSURE** animations enhance smoothness, never hinder it
- **TARGET** 60fps performance on all supported devices
- **MINIMIZE** animation overhead - every animation must justify its performance cost
- **USE** hardware acceleration (transform, opacity) exclusively for smooth performance
- **AVOID** layout-triggering animations that cause jank or stuttering

### Smoothness Enhancement
- Animations should make the app feel **more responsive**, not less
- **ELIMINATE** any animation that creates perceived lag
- **IMPLEMENT** progressive enhancement - app works perfectly without animations
- **ENSURE** animations provide visual continuity and reduce cognitive load

### Premium Animation Standards

#### Timing and Easing
- **Default duration**: 0.3s for micro-interactions, 0.5s for page transitions
- **Easing curves**: Use `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for continuous animations
- **Custom easing**: `cubic-bezier(0.4, 0.0, 0.2, 1)` for Material Design feel
- **Spring animations**: Use `type: "spring"` with `damping: 25, stiffness: 300` for natural feel

#### Animation Hierarchy
1. **Micro-interactions** (0.1-0.2s): Button hovers, input focus, small state changes
2. **Component transitions** (0.3-0.4s): Modal open/close, dropdown expand/collapse
3. **Page transitions** (0.5-0.8s): Route changes, major layout shifts
4. **Loading states** (1-2s): Skeleton screens, progress indicators

### Implementation Guidelines

#### Component Structure
```jsx
// ALWAYS wrap animated components with motion elements
import { motion, AnimatePresence } from 'framer-motion'

// PREFERRED: Use motion.div instead of div for animated elements
const AnimatedComponent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    Content
  </motion.div>
)
```

### Animation Variants Pattern
- ALWAYS use variants for complex animations
- ORGANIZE animations by component state (idle, hover, active, disabled)
- REUSE common animation patterns across components
```jsx
const buttonVariants = {
  idle: { scale: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  hover: { scale: 1.02, boxShadow: "0 4px 8px rgba(0,0,0,0.15)" },
  tap: { scale: 0.98 },
  disabled: { scale: 1, opacity: 0.6 }
}
```


### Layout Animations
- **USE** layout prop for automatic layout animations
- **IMPLEMENT** layoutId for shared element transitions
- **AVOID** layout thrashing by batching DOM changes

### Premium UX Patterns
#### Page Transitions
- **IMPLEMENT** staggered animations for lists and grids
- **USE** AnimatePresence for route transitions
- **ENSURE** exit animations complete before new content enters

#### Loading States
- **CREATE** skeleton screens with subtle pulse animations
- **IMPLEMENT** progressive loading with staggered reveals
- **USE** spring animations for loading spinners

#### Gesture Interactions
- **ENABLE** drag, pan, and swipe gestures where appropriate
- **PROVIDE** visual feedback during gestures
- **IMPLEMENT** momentum and snap-to-grid behaviors

### Code Organization
#### File Structure
```bash
src/
├── components/
│   ├── animations/
│   │   ├── variants.ts          # Reusable animation variants
│   │   ├── transitions.ts       # Common transition configs
│   │   └── gestures.ts         # Gesture handlers
│   └── ui/
│       ├── Button.tsx          # Animated button component
│       └── Modal.tsx           # Animated modal component
```

### Animation Utilities
- CREATE reusable animation hooks
- IMPLEMENT animation state management 
- PROVIDE animation debugging tools in development

### Accessibility Considerations
#### Respect User Preferences
- **CHECK** prefers-reduced-motion media query
- **PROVIDE** option to disable animations
- **ENSURE** animations don't cause seizures or vestibular disorders

```bash
const shouldReduceMotion = useReducedMotion()

const animationProps = shouldReduceMotion 
  ? {} 
  : {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 }
    }
```

### Focus Management
- **MAINTAIN** logical focus order during animations
- **ENSURE** screen readers can follow animated content
- **PROVIDE** skip links for long animations

### Performance Optimization
#### Bundle Size
- **IMPORT** only needed Framer Motion features
- **USE** tree shaking to eliminate unused code
- **CONSIDER** lazy loading for complex animations

### Runtime Performance
- **MONITOR** frame rates during animations
- **USE** transform3d to trigger hardware acceleration
- **BATCH** multiple animations together
- **AVOID** animating during heavy computations

### Testing Guidelines
#### Animation Testing
- **TEST** animations in different browsers and devices
- **VERIFY** performance on low-end devices
- **ENSURE** animations work with reduced motion settings
- **CHECK** animation timing and easing curves

#### User Testing
- **VALIDATE** that animations enhance rather than distract
- **CONFIRM** animations provide clear feedback
- **ENSURE** loading states are informative and engaging

### Error Handling
#### Animation Failures
- **PROVIDE** fallbacks for failed animations
- **LOG** animation errors in development
- **ENSURE** app functionality without animations

#### Performance Degradation
- **DETECT** poor performance and reduce animation complexity
- **IMPLEMENT** progressive enhancement for animations
- **PROVIDE** manual animation controls for debugging

### Quality Checklist**
Before implementing any animation, verify:
- [ ] Animation serves a clear purpose (feedback, guidance, or delight)
- [ ] Performance impact is minimal (60fps target)
- [ ] Accessibility requirements are met
- [ ] Animation timing feels natural and premium
- [ ] Fallbacks exist for reduced motion preferences
- [ ] Code is reusable and maintainable
- [ ] Animation enhances rather than distracts from content

### Premium Animation Mindset
Remember: Premium animations should feel effortless, purposeful, and delightful. Every animation should either:

1. Provide feedback about user actions
2. Guide attention to important elements
3. Create continuity between interface states
4. Add personality without being distracting

**NEVER** animate just because you can. Every animation should make the user experience better, not just more flashy.

This rule file provides comprehensive guidance for implementing premium animations with Framer Motion, covering performance, accessibility, user experience, and code organization. It emphasizes quality over quantity and ensures animations enhance rather than detract from the user experience.

