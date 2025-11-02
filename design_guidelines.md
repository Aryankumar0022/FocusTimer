# FocusFlow PWA - Design Guidelines (Compacted)

## Design Philosophy

**Approach:** Hybrid of Linear + Apple HIG principles for distraction-free productivity

**Core Principles:**
1. Distraction-Free First - purposeful elements only
2. Clarity Over Cleverness - obvious interactions
3. Breathing Room - generous spacing for calm
4. Hierarchy Through Scale - typography/spacing define importance

---

## Typography

### Font Stack
- **UI:** Inter (400, 500, 600, 700) → -apple-system fallback
- **Timer:** JetBrains Mono (700) with `tabular-nums`

### Scale (mobile/desktop)
- Timer Display: 96px/128px, JetBrains Mono 700
- Page Titles: 32px/40px, Inter 700, letter-spacing: -0.025em
- Section Headers: 24px/28px, Inter 600
- Card Titles: 18px/20px, Inter 600
- Body: 15px/16px, Inter 400, line-height: 1.6
- Labels: 13px/14px, Inter 500
- Buttons: 15px, Inter 600, letter-spacing: -0.01em

**Rules:** All-caps only for tiny labels; tabular-nums for time/counters; headings 1.2 line-height, body 1.6

---

## Layout & Spacing

### Spacing Scale (Tailwind)
**Core set:** 2, 4, 6, 8, 12, 16, 24, 32, 48, 64
- Micro: 2-4 (icon-text gaps)
- Components: 6-16 (padding)
- Sections: 24-48 (spacing)
- Page margins: 64 (desktop)

### Containers
```css
Timer View: max-w-2xl mx-auto
History: max-w-5xl mx-auto
Settings: max-w-3xl mx-auto
Modals: max-w-lg mx-auto
```

### Breakpoints & Grid
- **Mobile (<640px):** Single column, p-4 gutters
- **Tablet (640-1024px):** max-w-768px, p-6 gutters
- **Desktop (>1024px):** max-w-1280px, p-8 gutters

### Vertical Rhythm
- Section padding: py-12 (mobile) → py-24 (desktop)
- Cards: space-y-4 (tight), space-y-6 (regular), space-y-8 (loose)
- Forms: space-y-6 consistently

---

## Components

### Timer Display
- Circle diameter: 280px (mobile) → 400px (desktop)
- Progress stroke: 12px, gap: 4px
- State label: 12px uppercase above
- Session title: 20px weight-600 below
- Centered, occupies 60% viewport height

### Buttons

**Primary (Start/Pause):**
- Height: 56px (mobile), 64px (desktop)
- Padding: px-12, rounded-xl (12px)
- Icon + text, 8px gap
- Full-width mobile, auto desktop

**Secondary:**
- Height: 44px, px-6, rounded-lg (8px)

**Icon-only:**
- 40px × 40px, rounded-lg, tooltip on hover

**Preset Buttons:**
- 80px × 80px squares, rounded-2xl
- Duration: 40px weight-700, "min": 12px below
- grid-cols-3 gap-4

### Cards

**Session History:**
- Padding: 20px (mobile), 24px (desktop)
- rounded-2xl, 1px border
- Hover: 4px translate-y lift
- Grid: single-col mobile, 3-col desktop (gap-8)

**Stat Cards:**
- p-6, rounded-xl
- Icon: 48px circle bg, 24px icon
- Value: 32px weight-700 tabular-nums
- Label: 14px weight-500

### Forms

**Text Inputs:**
- Height: 48px, p-4, rounded-lg, 2px border
- Focus: 3px offset outline
- Label: 14px weight-600, mb-2

**Textarea:** min-h-120px, p-4, rounded-xl, resize vertical

**Checkboxes:** 20px, rounded (4px checkbox, 50% radio), 14px check icon, label 15px ml-3

**Toggle Switch:** 48px × 28px pill, 24px handle with 2px inset

### Modals
- max-w-500px, p-8, rounded-3xl
- Header: 24px weight-700, mb-6
- Content: space-y-6
- Footer: flex justify-end gap-3
- Mobile: full-screen, rounded only on desktop

### Distraction Tracking

**"I'm Distracted" Button:**
- Fixed bottom-8, h-16, px-8, pill shape (rounded-full)
- Icon + text + badge counter
- Subtle shadow

**Timeline:** Vertical dots, 13px monospace timestamps, 14px weight-500 labels, 16px icons

### Notifications

**Toasts:**
- max-w-400px, p-4/5, rounded-xl
- 20px icon left, 16px dismiss right
- Position: top-4 right-4 (desktop), bottom-4 (mobile)
- Auto-dismiss: 5s success, manual errors

### Navigation

**Top Bar:**
- h-16, px-4/6/8 (mobile/tablet/desktop)
- Logo: 20px weight-700 left
- Links: 15px weight-500, 8px gap, right
- Hamburger: <768px

**Tabs:** h-12, 2px bottom border, 16px horizontal padding, 15px weight-600

### Settings Panel
- Section header: 18px weight-700, mb-4, border-bottom, pb-3
- Rows: min-h-16, py-4, border-bottom
- Label left (15px weight-600), control right

---

## Page Layouts

### Timer Page
- Centered layout, py-8
- Timer dominates (60% viewport)
- Controls: mt-12 below timer
- Distraction button: fixed bottom when active

### History Page
- Header + Export (right-aligned), mb-8
- Filters/tabs, mb-6
- Cards: 2-col desktop, 1-col mobile, gap-6

### Settings
- Groups: space-y-12
- Rows within: space-y-4
- Footer: Danger zone (red accents)

### Onboarding
- Multi-step: progress dots top
- Icon: 120px, Title: 28px, Description: 16px
- max-w-md mx-auto, py-16, space-y-8
- Full-width primary button bottom

---

## Color System

*(Use your existing color tokens - not specified in original, maintain as-is)*

**Apply:**
- Primary: Main actions, active states
- Secondary: Supporting actions, outlines
- Neutral: Backgrounds, borders, text hierarchy
- Success/Warning/Error: Feedback states

---

## Accessibility (Non-Negotiable)

- **Touch targets:** min 44px × 44px
- **Focus indicators:** 3px outline, 2px offset on all interactive elements
- **Skip link:** Visually hidden, keyboard accessible
- **ARIA labels:** All icon-only buttons
- **Screen reader:** Timer interval announcements
- **Keyboard shortcuts:** Document in settings (Space = Start/Pause)
- **Media queries:** Support `prefers-contrast` and `prefers-reduced-motion`

---

## Animations (Minimal & Purposeful)

- Timer countdown: Smooth 1s transitions
- Progress ring: 300ms ease-in-out
- Button active: scale(0.98)
- Modal entrance: fade + scale, 200ms
- Toasts: slide-in, 250ms ease-out
- **Disable all when `prefers-reduced-motion: reduce`**

---

## Visual Assets

**No images.** Icon-only: Heroicons (outline default, solid for active states)

---

## Implementation Checklist

- [ ] Load Inter (400,500,600,700) + JetBrains Mono (700) from Google Fonts
- [ ] Set `tabular-nums` on timer displays
- [ ] Configure Tailwind spacing scale: 2,4,6,8,12,16,24,32,48,64
- [ ] Apply focus-visible outlines globally
- [ ] Test touch targets on mobile (<44px fails)
- [ ] Implement reduced-motion checks
- [ ] Add skip-to-content link
- [ ] Verify ARIA labels on icon buttons
- [ ] Test keyboard navigation flow