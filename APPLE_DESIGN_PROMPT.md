# Apple-Style ML Dashboard Design Prompt Template

## Overview
This prompt template captures the complete design system and implementation process used to transform a standard ML/data dashboard into a premium Apple-inspired experience. Use this as a comprehensive guide for similar projects.

---

## MASTER PROMPT

```
Transform [YOUR_APP_NAME] into a premium Apple-style web application with the following specifications:

### DESIGN PHILOSOPHY
- Clean, minimalist aesthetic inspired by Apple's design language
- Large white space, subtle gradients, elegant typography
- Focus on content hierarchy and visual breathing room
- Every element should feel intentional and polished

### COLOR SYSTEM
Primary Palette:
- Background: #F5F5F7 (light gray)
- Surface: #FFFFFF (pure white)
- Text Primary: #1D1D1F (near black)
- Text Secondary: #86868B (medium gray)
- Accent: #0071E3 (Apple blue)
- Accent Hover: #0077ED
- Success: #34C759 (green)
- Warning: #FF9500 (orange)
- Danger: #FF3B30 (red)
- Border: rgba(0, 0, 0, 0.08)
- Shadow: rgba(0, 0, 0, 0.04)

Dark/Hero Background:
- Gradient: linear-gradient(180deg, #000000 0%, #1D1D1F 50%, #2D2D2F 100%)
- Overlay: radial-gradient(ellipse at 50% 0%, rgba(0, 113, 227, 0.15) 0%, transparent 70%)

### TYPOGRAPHY
Font Stack: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif

Hierarchy:
- Hero H1: clamp(2.5rem, 6vw, 4.5rem), weight 700, letter-spacing -0.03em
- Section H2: clamp(2rem, 4vw, 3rem), weight 700, letter-spacing -0.03em
- Card H2: 1.5rem, weight 600, letter-spacing -0.02em
- Body: 1rem (16px), weight 400, line-height 1.47059
- Small/Caption: 0.875rem, weight 500
- KPI Value: 3.5rem, weight 700, letter-spacing -0.04em

### SPACING SYSTEM
- Section Padding: 120px vertical (80px on mobile)
- Container Max-Width: 1200px
- Card Border Radius: 24px (20px on mobile)
- Button Border Radius: 980px (pill shape)
- Card Padding: 2.5rem (1.75rem on mobile)
- Grid Gap: 1.5rem

### COMPONENTS

#### 1. Navigation Bar
- Position: fixed, top: 0, full width, z-index: 1000
- Height: 52px
- Default: transparent background
- Scrolled (after 50px): rgba(255,255,255,0.8) with backdrop-filter: blur(20px) saturate(180%)
- Border-bottom on scroll: 1px solid rgba(0,0,0,0.08)
- Links: pill-shaped hover states, active state filled with accent color
- Transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1)

#### 2. Hero Section
- Full-width dark gradient background
- Centered content with max-width 800px
- Large typography with fade-in-up animation
- Subtitle with 0.7 opacity
- Padding: 160px top, 100px bottom
- Decorative radial gradient overlay

#### 3. Glassmorphism Cards (KPI/Highlight)
- Background: rgba(255, 255, 255, 0.72)
- Backdrop-filter: blur(20px) saturate(180%)
- Border: 1px solid rgba(255, 255, 255, 0.5)
- Border-radius: 24px
- Box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08)
- Top highlight: 1px gradient line (white, transparent)
- Hover: translateY(-4px) scale(1.01), enhanced shadow

#### 4. Standard Cards
- Background: white
- Border-radius: 24px
- Box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04)
- Border: 1px solid rgba(0, 0, 0, 0.08)
- Hover: translateY(-2px), enhanced shadow
- Transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1)

#### 5. Feature Cards (Product-style)
- Same base as standard cards
- Top accent line: 4px gradient (blue to purple)
- Hover: scale(1.02) translateY(-4px)
- Icon container: 56px, gradient background, rounded-16px
- Accent line animates from scaleX(0) to scaleX(1) on hover

#### 6. Buttons
- Primary: #0071E3 background, white text, pill shape
- Padding: 0.875rem 1.75rem
- Hover: #0077ED, translateY(-1px), shadow
- Active: translateY(0)
- Secondary: transparent, blue border, blue text

#### 7. Badges
- Pill shape, padding: 0.5rem 1rem
- Success: rgba(52,199,89,0.1) bg, #34C759 text
- Warning: rgba(255,149,0,0.1) bg, #FF9500 text
- Danger: rgba(255,59,48,0.1) bg, #FF3B30 text
- Pulse animation for "best" badges: box-shadow ripple

#### 8. Progress Bars
- Track: 8px height, #F2F2F7 background, rounded
- Fill: gradient (blue to purple), animated width
- Label: flex space-between above bar

#### 9. Form Inputs
- Border: 1.5px solid rgba(0,0,0,0.08)
- Border-radius: 12px
- Padding: 0.875rem 1rem
- Focus: border-color #0071E3, box-shadow 0 0 0 4px rgba(0,113,227,0.1)
- Transition: all 0.4s ease

#### 10. Tables
- Full width, border-collapse separate
- Header: #F2F2F7 background, uppercase, 0.875rem
- Row hover: rgba(0,113,227,0.04)
- Border-radius: 24px, overflow hidden
- Box-shadow: 0 4px 24px rgba(0,0,0,0.04)

#### 11. Charts
- Container: white card with shadow
- Canvas: responsive, high DPI support
- Bar animations: staggered delay, ease-out cubic
- Gradient fills: blue to purple
- Labels: #86868B, 12px

### ANIMATIONS

#### Scroll-Triggered (Intersection Observer)
```javascript
// Observer config
{ rootMargin: '0px 0px -100px 0px', threshold: 0.1 }

// Animation classes
.animate-on-scroll {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
}

// Stagger delays
.animate-delay-1 { transition-delay: 0.1s; }
.animate-delay-2 { transition-delay: 0.2s; }
.animate-delay-3 { transition-delay: 0.3s; }
```

#### Hero Fade-In-Up
```css
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
// Duration: 1s, easing: cubic-bezier(0.4, 0, 0.2, 1)
// Stagger: title first, subtitle 0.2s delay
```

#### Counter Animation
```javascript
// Animate from 0 to target value
// Duration: 1500ms
// Easing: ease-out cubic (1 - Math.pow(1 - progress, 3))
// Use requestAnimationFrame
```

#### Chart Bar Animation
```javascript
// Staggered by index * 150ms
// Duration: 1000ms per bar
// Easing: ease-out cubic
// Animate height from 0 to target
```

#### Progress Bar Animation
```javascript
// Triggered when scrolled into view
// Width transitions from 0% to target%
// Duration: 1500ms
// Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

#### Insights List Stagger
```javascript
// Each item: opacity 0, translateX(-20px)
// Stagger: index * 150ms
// Transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1)
```

### ACCESSIBILITY REQUIREMENTS
- ARIA labels on all interactive elements
- Semantic HTML5 structure (nav, main, section, article)
- Role attributes: navigation, banner, contentinfo, img
- Focus states: visible outline on all interactive elements
- prefers-reduced-motion: disable all animations
- prefers-contrast: high: increase border opacity, text contrast
- Keyboard navigation support
- aria-live for dynamic content updates

### RESPONSIVE BREAKPOINTS
Mobile (< 768px):
- Section padding: 80px
- Card radius: 20px
- Navigation: compact links
- Grid: single column
- Hero padding: 120px top, 80px bottom
- KPI values: 2.5rem

### PAGE STRUCTURE TEMPLATE
Each page should follow:
1. Fixed Navigation (transparent → solid on scroll)
2. Hero Section (dark gradient, centered, animated)
3. Main Content (max-width 1200px, centered)
   - Sections with alternating white/gray backgrounds
   - Cards with scroll-triggered animations
4. Footer (minimal, centered, subtle gradient)

### STREAMLIT EMBEDDING COMPATIBILITY
- All CSS in <style> tags
- All JS in <script> tags
- No external dependencies (except optional Chart.js)
- Self-contained HTML string
- Use st.components.v1.html(component, height=800, scrolling=True)

### IMPLEMENTATION CHECKLIST
For each page:
- [ ] Remove all emojis
- [ ] Add ARIA labels and roles
- [ ] Implement sticky navigation
- [ ] Create hero section with gradient
- [ ] Add glassmorphism cards where appropriate
- [ ] Apply scroll-triggered animations
- [ ] Ensure responsive design
- [ ] Test hover effects
- [ ] Verify accessibility
- [ ] Check contrast ratios
```

---

## STEP-BY-STEP IMPLEMENTATION PROCESS

### Phase 1: Foundation (CSS)
1. Define CSS variables for the entire color system
2. Create base reset and typography styles
3. Build navigation component with scroll states
4. Create card variants (glass, standard, feature)
5. Style all form elements
6. Add animation keyframes
7. Implement responsive breakpoints
8. Add accessibility media queries

### Phase 2: Interactions (JavaScript)
1. Initialize navigation scroll listener
2. Create Intersection Observer for scroll animations
3. Implement counter animation function
4. Add chart rendering with animations
5. Create progress bar animation
6. Add smooth scroll behavior
7. Handle window resize for charts
8. Initialize insights list animations

### Phase 3: Pages (HTML)
For each page:
1. Update navigation with new classes and ARIA labels
2. Create hero section with gradient background
3. Restructure content into semantic sections
4. Replace old cards with new card components
5. Add animate-on-scroll classes to elements
6. Update all text (remove emojis, improve copy)
7. Add proper heading hierarchy
8. Implement footer

### Phase 4: Testing
1. Test all page navigation links
2. Verify scroll animations trigger correctly
3. Check responsive behavior on mobile
4. Test hover states and transitions
5. Verify accessibility with keyboard navigation
6. Check contrast ratios
7. Test form interactions
8. Verify chart rendering and animations

---

## DESIGN PRINCIPLES SUMMARY

1. **Whitespace is Premium**: Use generous padding and margins. Let content breathe.
2. **Subtle Depth**: Use soft shadows and glassmorphism instead of heavy borders.
3. **Motion with Purpose**: Every animation should guide attention or provide feedback.
4. **Typography Hierarchy**: Clear size and weight distinctions create visual flow.
5. **Consistent Radius**: Use 24px for cards, 980px for buttons, 12px for inputs.
6. **Gradient Accents**: Use blue-to-purple gradients for highlights and KPIs.
7. **Interactive Feedback**: Every clickable element should have a hover state.
8. **Accessibility First**: Design for all users from the start.

---

## EXAMPLE USAGE

To apply this design system to a new ML dashboard:

1. Copy the CSS variables and base styles
2. Implement the navigation and hero patterns
3. Use the card components for your specific content
4. Adapt the chart animations for your data visualizations
5. Apply scroll animations to your sections
6. Test and refine based on your specific content needs

The key is consistency: use the same spacing, colors, and animation patterns throughout for a cohesive Apple-style experience.
