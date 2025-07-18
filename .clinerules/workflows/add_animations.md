# Framer Motion Animation Implementation Workflow for Spin & Win App

You are implementing Framer Motion animations for a Spin & Win web application. This workflow will guide you through adding smooth, engaging animations to pages, buttons, icons, and pop-ups.

---

## 🧰 Prerequisites Check

Before starting, verify the following:

1. **Check if Framer Motion is installed**:

   ```bash
   npm list framer-motion
   ```

   If not installed, add Framer Motion:

   ```bash
   npm install framer-motion
   ```

2. **Examine the current app structure**:

   ```xml
   <search_files>
     <path>src</path>
     <regex>(page|button|icon|popup|modal)</regex>
     <file_pattern>*.(js|jsx|ts|tsx)</file_pattern>
   </search_files>
   ```

---

## ✅ Step 1: Analyze Current App Structure

Identify all pages in the app:

```xml
<search_files>
  <path>src</path>
  <regex>(Page|Screen|View)</regex>
  <file_pattern>*.(js|jsx|ts|tsx)</file_pattern>
</search_files>
```

Locate button components:

```xml
<search_files>
  <path>src</path>
  <regex>(Button|Btn)</regex>
  <file_pattern>*.(js|jsx|ts|tsx)</file_pattern>
</search_files>
```

Find icon components:

```xml
<search_files>
  <path>src</path>
  <regex>(Icon|Svg)</regex>
  <file_pattern>*.(js|jsx|ts|tsx)</file_pattern>
</search_files>
```

Identify pop-ups and modals:

```xml
<search_files>
  <path>src</path>
  <regex>(Modal|Popup|Dialog)</regex>
  <file_pattern>*.(js|jsx|ts|tsx)</file_pattern>
</search_files>
```

---

## 🎛 Step 2: Create Animation Utilities

Create a centralized animation configuration file:

```xml
<write_to_file>
  <path>src/animations/motionVariants.js</path>
  <content>
// Framer Motion animation variants for Spin & Win app

export const pageVariants = {
  initial: { opacity: 0, x: "-100vw" },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: "100vw" }
};

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

export const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
    transition: { duration: 0.3, yoyo: Infinity }
  },
  tap: { scale: 0.95 }
};

export const spinButtonVariants = {
  idle: { rotate: 0, scale: 1 },
  spinning: {
    rotate: 360,
    scale: 1.1,
    transition: {
      rotate: { duration: 2, ease: "easeInOut", repeat: Infinity },
      scale: { duration: 0.3 }
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 15px 25px rgba(255,215,0,0.4)",
    transition: { duration: 0.3 }
  }
};

export const iconVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "backOut" }
  },
  bounce: {
  y: [0, -10, 0],
  transition: {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "mirror"
  }
}

export const popupVariants = {
  hidden: { opacity: 0, scale: 0.8, y: -50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "backOut" }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -50,
    transition: { duration: 0.3 }
  }
};

export const wheelVariants = {
  idle: { rotate: 0 },
  spinning: {
    rotate: 1440,
    transition: { duration: 3, ease: "easeOut" }
  }
};

export const prizeVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.8, ease: "backOut", delay: 0.2 }
  }
};

export const confettiVariants = {
  hidden: { opacity: 0, y: -100, rotate: 0 },
  visible: {
    opacity: 1,
    y: 100,
    rotate: 360,
    transition: { duration: 2, ease: "easeOut" }
  }
};
  </content>
</write_to_file>
```

---

## 📄 Step 3: Implement Page Animations

For each page component, wrap with `motion.div` and add page transitions:

```xml
<ask_followup_question>
  <question>I need to see your current page components to implement the animations. Can you show me the main page files or tell me the names of your key pages (like HomePage, GamePage, ResultsPage, etc.)?</question>
  <options>["Show me the main page files", "List the page component names", "I'll provide the file paths"]</options>
</ask_followup_question>
```

---

## 🔘 Step 4: Animate Buttons

```tsx
import { motion } from 'framer-motion';
import { buttonVariants, spinButtonVariants } from '../animations/motionVariants';

const AnimatedButton = ({ children, isSpinButton = false, onClick, ...props }) => {
  const variants = isSpinButton ? spinButtonVariants : buttonVariants;
  
  return (
    <motion.button
      variants={variants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};
```

---

## 🎨 Step 5: Animate Icons

```tsx
import { motion } from 'framer-motion';
import { iconVariants } from '../animations/motionVariants';

const AnimatedIcon = ({ children, shouldBounce = false, delay = 0 }) => {
  return (
    <motion.div
      variants={iconVariants}
      initial="hidden"
      animate={shouldBounce ? "bounce" : "visible"}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};
```

---

## 💬 Step 6: Implement Pop-up Animations

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { popupVariants } from '../animations/motionVariants';

const AnimatedPopup = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="popup-content"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

---

## 🌀 Step 7: Implement Spin Wheel Animation

```tsx
import { motion } from 'framer-motion';
import { wheelVariants } from '../animations/motionVariants';

const SpinWheel = ({ isSpinning, onSpinComplete }) => {
  return (
    <motion.div
      className="spin-wheel"
      variants={wheelVariants}
      animate={isSpinning ? "spinning" : "idle"}
      onAnimationComplete={onSpinComplete}
    >
      {/* Wheel content */}
    </motion.div>
  );
};
```

---

## 🏆 Step 8: Add Prize Reveal Animation

```tsx
import { motion } from 'framer-motion';
import { prizeVariants, confettiVariants } from '../animations/motionVariants';

const PrizeReveal = ({ prize, isVisible }) => {
  return (
    <motion.div
      variants={prizeVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="prize-reveal"
    >
      <h2>Congratulations!</h2>
      <p>You won: {prize}</p>
      
      <motion.div
        variants={confettiVariants}
        initial="hidden"
        animate="visible"
        className="confetti"
      >
        🎉
      </motion.div>
    </motion.div>
  );
};
```

---

## 🛠 Step 9: Update Existing Components

```xml
<ask_followup_question>
  <question>Which component would you like me to start animating first? I can help you implement the animations step by step.</question>
  <options>["Start with the main spin wheel", "Begin with page transitions", "Animate buttons first", "Start with pop-ups/modals"]</options>
</ask_followup_question>
```

---

## 🔄 Step 10: Add Loading Animations

```tsx
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <motion.div
      className="loading-spinner"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      ⭐
    </motion.div>
  );
};
```

---

## 📚 Step 11: Implement Stagger Animations

```tsx
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delayChildren: 0.3, staggerChildren: 0.2 }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const PrizeList = ({ prizes }) => {
  return (
    <motion.ul
      className="prize-list"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {prizes.map((prize, index) => (
        <motion.li key={index} variants={item}>
          {prize}
        </motion.li>
      ))}
    </motion.ul>
  );
};
```

---

## 🧪 Step 12: Testing and Optimization

* ✅ Page transitions
* ✅ Button interactions
* ✅ Icon animations
* ✅ Pop-up appearances
* ✅ Spin wheel functionality

**Performance Optimization:**

```tsx
const optimizedMotionDiv = {
  style: { willChange: 'transform' }
};
```

**Reduced Motion Support:**

```tsx
import { useReducedMotion } from 'framer-motion';

const shouldReduceMotion = useReducedMotion();
const transition = shouldReduceMotion ? { duration: 0 } : { duration: 0.5 };
```

---

## 🚀 Step 13: Final Integration

* Update your main `App` component to include `AnimatePresence` for route transitions
* Add CSS classes for styling animated components
* Test the complete user flow with all animations

---

## ✅ Completion Checklist

* [x] Framer Motion installed and configured
* [x] Animation variants created
* [x] Page transitions implemented
* [x] Button animations added
* [x] Icon animations working
* [x] Pop-up animations functional
* [x] Spin wheel animation complete
* [x] Prize reveal animation working
* [x] Loading states animated
* [x] Performance optimized
* [x] Accessibility considered
* [x] All animations tested

---
