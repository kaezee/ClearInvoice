# Clear — Figma Make Master Prompt (Final)

This is the complete, consolidated design specification for Clear. Build all screens, components, and interactions from this document. Do not reference any previous prompt versions — this supersedes everything.

---

## Product overview

Clear is a mobile-first freelance project-to-payment tracker. The flow: create project during quoting stage → generate a quote → client approves → work begins → work done → generate invoice → send link → get paid → mark cleared.

Six screens + one modal system:
1. Landing
2. Project list (home)
3. Project detail + embedded quote/invoice
4. New project form
5. Branding settings
6. Invoice defaults (rate card + custom fields)
+ Avatar bottom sheet (navigation modal)

---

## Design principles

- Not a SaaS tool. Not corporate. A tool with personality used by real freelancers.
- White does the heavy lifting. Black structures it. CMY makes it memorable.
- Colour is semantic — every colour means something specific. Never decorative.
- Mobile thumb zone: primary actions always bottom 20% of screen.
- Not super rounded, not sharp. Considered radius throughout.
- Text breathes. Nothing cramped. Generous line-height.

---

## 60:30:10 colour rule

```
60% — #FFFFFF White
      All cards, screen surfaces, form fields, modal backgrounds
      The dominant neutral everything sits on

30% — #0A0A0A Near-black
      Top bar, all body text, button fills (primary), strokes, icons
      The structural layer that grounds the UI

10% — CMY status colours
      Status pills, one accent CTA per screen maximum
      Never used as backgrounds, never decorative
```

---

## Colour system

```
/* Base */
--white:          #FFFFFF   cards, surfaces
--black:          #0A0A0A   text, top bar, primary buttons, strokes
--surface:        #F5F6F8   app background (cool off-white, slight blue undertone)
--stroke:         #E2E5EC   card borders, dividers, input borders
--muted:          #7A8099   secondary text (cool blue-grey, passes AA on white)
--danger:         #DC2626   destructive action text only

/* CMY status palette — all with 1.5px #0A0A0A stroke */
--quoting:        #FFE24B   Quoting stage
--in-progress:    #FF659C   In progress stage  
--invoiced:       #65F7FF   Invoiced stage
--cleared:        #4DFF91   Cleared stage
--archived:       #E8E8E8   Archived (neutral)
```

**WCAG contrast:**
- `#0A0A0A` on `#FFFFFF`: 19.6:1 ✓ AAA
- `#7A8099` on `#FFFFFF`: 4.6:1 ✓ AA
- `#0A0A0A` on all CMY fills: all pass AA ✓
- White on `#0A0A0A`: 19.6:1 ✓ AAA

---

## Typography — DM Sans

Import from Google Fonts: `https://fonts.google.com/specimen/DM+Sans`
Not Inter. Not Roboto. Not Space Grotesk. DM Sans only.

```
Wordmark:        28px / 700 / tracking -0.03em
Screen title:    18px / 600 / tracking -0.01em
Card client name: 15px / 600 / tracking 0
Card amount:     15px / 500 / tracking 0
Body / values:   13px / 400 / line-height 1.6
Secondary text:  13px / 400 / #7A8099 / line-height 1.6
Section labels:  10px / 600 / uppercase / tracking 0.08em / #7A8099
Pills / tags:    12px / 700 (pills) / 11px / 500 (category tags)
Button text:     14px / 700 / tracking -0.01em
Small button:    12px / 700
Hint / caption:  11px / 400 / #7A8099
```

Minimum text size anywhere in UI: 11px.

---

## Spacing system

```
4px / 8px / 12px / 16px / 20px / 24px / 32px / 40px / 48px
Screen horizontal padding: 16px
Card internal padding: 16px
Gap between cards: 10px
Section gap: 20px
```

---

## Border radius

```
4px   → small chips, inline tags
8px   → inputs, section cards, small buttons
12px  → bottom sheets, large modals
16px  → status pills, main buttons, project cards
      (matches the pill radius from the locked SVG specs: rx ~7.5 on 27px height,
       scaled up proportionally for 48px button height = ~16px)
```

---

## Status pills — final locked spec

Derived directly from provided SVG files. These values are exact and final.

```
All pills:
  Height:          27px (in cards) / 32px (standalone/larger contexts)
  Border-radius:   16px (proportional to height — chunky, sticker-like)
  Border:          1.5px solid #0A0A0A
  Font:            DM Sans / 12px / 700 / #0A0A0A
  No dot icons. Text only.
  Padding:         0 12px

Quoting     → fill #FFE24B
In progress → fill #FF659C
Invoiced    → fill #65F7FF
Cleared     → fill #4DFF91
Archived    → fill #E8E8E8
```

---

## Button system

### Primary (30% — black fill)
```
Background:    #0A0A0A
Text:          #FFFFFF / 14px / 700
Border:        1.5px solid #0A0A0A
Border-radius: 16px
Height:        48px
Padding:       0 24px

Hover:  background #2A2A2A
Active: scale(0.98)
Focus:  2px #0A0A0A ring / 2px offset
Disabled: opacity 0.35

Used for: "+ New project" FAB, "Save", "Generate invoice", "Generate quote"
```

### Secondary (60% — white fill)
```
Background:    #FFFFFF
Text:          #0A0A0A / 14px / 700
Border:        1.5px solid #0A0A0A
Border-radius: 16px
Height:        48px
Padding:       0 24px

Used for: "Cancel", "Edit", "Duplicate", "Resend"
```

### Destructive
```
Background:    #FFFFFF
Text:          #DC2626 / 14px / 700
Border:        1.5px solid #0A0A0A
Border-radius: 16px
Height:        48px

Used for: "Delete project", "Remove" — text colour only signals danger
```

### Accent CTA (10% — CMY, one per screen max)
```
Same dimensions as primary.
Border: 1.5px solid #0A0A0A
Text: #0A0A0A / 14px / 700

"Send quote"        → fill #FFE24B (Quoting screen only)
"Mark as invoiced"  → fill #65F7FF (In progress screen only)
"Mark as cleared"   → fill #4DFF91 (Invoiced screen only)

Rule: Never two CMY buttons on the same screen.
Rule: CMY button colour always matches the destination status colour.
```

### Small variant
```
Height:        36px
Padding:       0 16px
Border-radius: 12px
Font:          12px / 700
Same fill rules as above.
Used for inline actions inside cards and sheets.
```

### FAB (floating action button)
```
Same as primary button.
Width: auto (natural content width)
Padding: 0 32px
Position: fixed, bottom 24px + env(safe-area-inset-bottom), centred horizontally
Not full-width. Floats centred.
```

---

## Component library

### Project card

```
Background:     #FFFFFF
Border:         1px solid #E2E5EC
Border-radius:  16px
Padding:        16px
Gap between:    10px

Layout (left / right split):

LEFT COLUMN (flex-direction: column, gap 6px):
  Client name      → 15px / 600 / #0A0A0A
  Status pill      → per pill spec above
  Category tags    → flex row, gap 5px, wrap, max 3 visible + "+N" overflow

RIGHT COLUMN (align-items: flex-end, gap 4px):
  Amount           → 15px / 500 / #0A0A0A
  Modifier text    → 11px / 500 / context-dependent colour (see modifiers)

Overdue variant:
  border-left: 3px solid #FFE24B
  All other borders remain 1px solid #E2E5EC
  No yellow background tint — card stays #FFFFFF
```

### Category tags

```
Background:     #FFFFFF
Border:         1px solid #E2E5EC
Border-radius:  6px
Padding:        3px 9px
Font:           11px / 500 / #0A0A0A

Maximum 3 tags visible on card.
Overflow chip: "+N" → background #F5F6F8 / border #E2E5EC / text #7A8099
Tags are neutral — NEVER coloured. Colour is reserved for status pills only.
Free-text entry, max 5 stored per project.
```

### Invoice/quote modifier text (right column of card)

```
Quoting · sent · awaiting response:
  "Quote sent" → #7A8099

Invoiced · sent · not viewed:
  "Sent · awaiting" → #7A8099

Invoiced · viewed · not overdue:
  "Viewed 2h ago" → #00A3B5 (dark cyan, readable on white)

Invoiced · not viewed · overdue:
  "Not viewed · Xd overdue" → #7A5000

Invoiced · viewed · overdue:
  "Viewed · Xd overdue" → #7A5000

Cleared:
  "Paid 12 Mar" → #1A7A3A (dark green, readable on white)
```

### Top bar

```
Background:   #0A0A0A
Padding:      14px 16px 0
Min-height:   52px + env(safe-area-inset-top)

Left:  Wordmark "Clear." — DM Sans / 22px / 700 / #FFFFFF
       The period is #65F7FF (cyan)

Right: Avatar circle — 32×32px / border-radius 50%
       Background #FFE24B / initials text #0A0A0A / 13px / 700
       1px solid #0A0A0A border

Tab row (inside top bar, below wordmark row):
  Two tabs: "Active [N]" and "Cleared [N]"
  Tab text: 13px / 500
  Inactive: rgba(255,255,255,0.45)
  Active: #FFFFFF
  Active indicator: 2px solid #FFFFFF underline, bottom of tab
  Count badge: 10px / rounded pill / rgba(255,255,255,0.15) bg

Search bar (below tab row, outside black area):
  On #F5F6F8 surface, sticky below top bar
  Background: #FFFFFF
  Border: 1px solid #E2E5EC
  Border-radius: 8px
  Height: 40px
  Padding: 0 12px
  Left: magnifier icon 16px / #7A8099
  Placeholder: "Search projects..." / #7A8099 / 13px
  Focus: border 1px solid #0A0A0A
  Sticky positioning — does not scroll away with list
  Margin: 10px 16px
```

---

## Pipeline — 4 stages

```
Quoting     → #FFE24B  Work not started. Quote being prepared/sent.
In progress → #FF659C  Quote approved. Work happening.
Invoiced    → #65F7FF  Work complete. Invoice sent. Awaiting payment.
Cleared     → #4DFF91  Payment received. Done.
+ Archived  → #E8E8E8  Abandoned/cancelled. Read-only.
```

**Swipe right — advance status:**
- Threshold: 60px
- Behind card: destination status colour fills the reveal area
- Arrow icon centred in reveal area
- Card slides as one unit — no split panels
- On release past threshold: status pill animates (scale 0.8→1.0, 150ms)
- Not available on Cleared (final state)
- Cannot swipe backwards — use bottom sheet

**Swipe left — destructive actions:**
- Reveals: Archive (dark slate #4B5563) + Delete (red #DC2626)
- Each action: icon 20px + label 12px / centred
- Min width per action: 72px

---

## Screen specifications

### Screen 1 — Landing

```
Full screen background: #0A0A0A

Top: Wordmark "Clear." — 28px / 700 / #FFFFFF, period in #65F7FF
     Top padding: 64px + safe area

Centre block (vertically centred):
  Eyebrow:  "For freelancers who hate chasing invoices"
            13px / 400 / rgba(255,255,255,0.5) / margin-bottom 16px
  Headline: "Project in.\nPayment cleared."
            32px / 700 / #FFFFFF / line-height 1.1 / tracking -0.03em
  Sub:      "Track projects, send quotes, get paid."
            15px / 400 / rgba(255,255,255,0.5) / margin-top 12px
  Gap: 40px
  CTA: Primary button full-width "Get started — it's free"
       #0A0A0A bg with #FFFFFF border (inverted on dark bg)
       Actually use: #FFFFFF fill / #0A0A0A text / #FFFFFF border

Bottom:
  "No account needed to start"
  11px / 400 / rgba(255,255,255,0.3) / centred / margin-bottom 40px
```

### Screen 2 — Project list

```
Top bar: per spec above (wordmark + avatar + tabs + search)

Content area (background #F5F6F8):
  Search bar (sticky)
  Project card list — 16px horizontal padding, 10px gap

FAB: "+ New project" — primary button, centred, fixed bottom

Empty state:
  Simple geometric document shape illustration (two overlapping rects)
  "#7A8099 / centred"
  "No projects yet" — 15px / 500 / #7A8099
  "Add your first project to get started" — 13px / #7A8099
  Primary button "Add first project" below
  Margin top: auto (vertically centred in remaining space)
```

### Screen 3 — Project detail

```
Top bar (black):
  Back chevron left (white, 44×44px tap target)
  Client name centred — 15px / 600 / #FFFFFF
  Status pill right (current status, per pill spec)

Scroll area (background #F5F6F8, padding 12px 16px 100px):

  1. Swipe hint banner (shown until first swipe):
     Background: destination status colour (next stage)
     Border: 1px solid #0A0A0A
     Border-radius: 8px / Padding: 10px 14px
     "→ Swipe right to move to [next status]"
     11px / 600 / #0A0A0A
     Dismiss on first swipe, never show again for this project

  2. Project details section card:
     Section label: "Project"
     Fields: Client, Type/Categories, Quoted amount, Currency,
             Start date, Notes
     All field rows: key left (#7A8099 / 13px) / value right (#0A0A0A / 13px / 500)
     Edit icon (pencil 12px) next to section label — enables inline editing

  3. Quote section (visible in Quoting stage):
     Locked state: dashed border card, lock icon, "Set up your quote"
     Unlocked: same structure as invoice section below
     Header: "Quote #003" — black strip
     Expiry date displayed prominently
     "Accept this quote" button visible on client-facing view

  4. Invoice section (visible from Invoiced stage onwards):
     LOCKED (Quoting / In progress):
       Dashed border: 1.5px dashed #E2E5EC
       Background: #FFFFFF / border-radius 16px / padding 24px
       Lock icon 32px centred / grey
       "Invoice unlocked when work is complete" — 12px / #7A8099
       
     UNLOCKED (Invoiced / Cleared):
       Border: 1.5px solid #0A0A0A
       Border-radius: 16px / overflow hidden
       
       Header strip:
         Background: #0A0A0A / padding 10px 16px
         Left: "Invoice" — 13px / 600 / #FFFFFF
         Right: "#INV-008" — 11px / 400 / #65F7FF / monospace
       
       Body (background #FFFFFF / padding 14px 16px):
         Client name: 13px / 600 / #0A0A0A
         Due date: 11px / #7A8099 / margin-bottom 12px
         
         Line items (each row):
           Description left: 13px / #0A0A0A
           Amount right: 13px / 600 / #0A0A0A
           Editable fields: underline 1px dashed #0A0A0A, same text colour
           Border-bottom: 1px solid #E2E5EC
         
         "+ Add line item" row:
           13px / 500 / #7A8099 / padding 8px 0
         
         Total row:
           Border-top: 2px solid #0A0A0A / margin-top 8px / padding-top 10px
           "Total" left: 13px / 700 / #0A0A0A
           Amount right: 18px / 700 / #0A0A0A
         
         Notes (editable):
           11px / #7A8099, dashed underline when editable
         
         Edit hint (first view):
           "Tap underlined fields to edit" — 11px / #7A8099
           Pencil icon 10px left of text

Fixed bottom button:
  Quoting stage:    Accent CTA "Send quote" — #FFE24B fill
  In progress:      Primary "Generate invoice" — #0A0A0A fill
  Invoiced:         Accent CTA "Mark as cleared" — #4DFF91 fill
  + Secondary "Resend invoice" above it — #FFFFFF fill
  Cleared:          No action button. Read-only state.
```

### Screen 4 — New project form

```
Top bar (black):
  "×" close left (white, 44×44px)
  "New project" title centred
  "Save" right — disabled state: rgba(255,255,255,0.3)
                 enabled state: #FFFFFF / 13px / 600

Form (background #F5F6F8, padding 16px, gap 16px between fields):

  Client name*     text input / required
  
  Project type*    text input / required
                   On focus: rate card suggestions appear below as tappable rows
                   Each suggestion: service name left / price right / 44px height
                   Selecting populates both field and quoted amount
  
  Categories       multi-select chip input
                   User types and adds, max 5
                   Existing chips show with × to remove
                   Neutral chip style: #FFFFFF / #E2E5EC border / 8px radius
  
  Quoted amount    currency input / optional (shows "TBC" if empty)
                   Currency symbol prefix (detected from locale)
  
  Currency         compact select / GBP, USD, EUR, INR at top
  
  Start date       date picker / defaults today
  
  Due date         date picker / optional
                   Quick pills above: "Net 7" "Net 14" "Net 30"
  
  Notes            textarea / 3 rows / optional / placeholder "Any details..."

* required
All labels visible above fields — never placeholder-only.
```

### Screen 5 — Branding (accessed via avatar sheet)

```
Top bar: back chevron / "Branding"
Background: #F5F6F8

Section cards (background #FFFFFF / border #E2E5EC / radius 16px / padding 16px):

  1. Your logo:
     Dashed upload box: 1.5px dashed #E2E5EC / radius 12px / padding 20px / centred
     Image icon 32px / #E2E5EC
     "Upload logo" — 13px / 600 / #0A0A0A
     "PNG or SVG · shown on all invoices and quotes" — 11px / #7A8099
     If uploaded: thumbnail 48×48px radius 8px + "Replace" 13px / #7A8099

  2. Brand colour:
     6 swatches: #FF659C #FFE24B #65F7FF #4DFF91 #0A0A0A #7C3AED
     Each: 28×28px / radius 8px / 1.5px solid #0A0A0A
     Active: additional 2px offset ring in #0A0A0A
     + Hex input: monospace / 80px / validates on blur
     Live preview: small invoice thumbnail updates in real time

  3. Invoice style (3 template thumbnails):
     Equal thirds / 8px gap
     Active: 1.5px solid #0A0A0A border
     Inactive: 1px solid #E2E5EC
     
     Classic:  Black header strip
     Branded:  Header takes brand colour
     Minimal:  No fill header, thick rule only
     
     Label: 10px / 600 / centred / #7A8099
```

### Screen 6 — Invoice defaults (accessed via avatar sheet)

```
Top bar: back chevron / "Invoice defaults"
Background: #F5F6F8

Section cards:

  1. Rate card:
     Each item: service name left (13px / 500) / price right (13px / 600) / × delete
     × delete: 20×20px tap target / #E2E5EC colour
     Swipe left on row to reveal delete (red)
     "+ Add service" row: plus circle (#F5F6F8 bg / #0A0A0A +) + label

  2. Custom fields:
     Same row structure as rate card
     Examples: VAT number, Bank details, Payment terms
     "+ Add custom field" row at bottom
     On add: bottom sheet with "Field name" + "Value" inputs + primary "Add" button

  3. Payment defaults:
     Default due terms: pill selector "Net 7 / Net 14 / Net 30 / Custom"
     Active pill: #0A0A0A fill / #FFFFFF text
     Inactive pill: #FFFFFF / #E2E5EC border / #0A0A0A text
     Default currency: compact select
     Default notes: textarea (bank details, payment instructions)

Save button: Primary / full width / bottom of scroll (not fixed)
```

### Avatar bottom sheet

```
Trigger: tap avatar circle in top bar
Overlay: rgba(0,0,0,0.4)
Sheet: #FFFFFF / radius 12px 12px 0 0 / padding 20px 16px 32px

Handle: 32×3px / #E2E5EC / radius 2px / centred / margin-bottom 20px

Identity block:
  Avatar: 44×44px / radius 50% / #FFE24B bg / #0A0A0A initials / 14px / 700
  Name: "Kaezee Designs" — 15px / 600 / #0A0A0A
  Sub: email or tagline — 13px / #7A8099
  "Edit profile →" — 13px / 600 / #0A0A0A / margin-bottom 20px
  Divider: 1px solid #E2E5EC

Sections (each with 10px / 600 / uppercase / #7A8099 section label):

  Your setup:
    Row: Branding
    Row: Invoice defaults

  Projects:
    Row: Archived projects → count badge (#F5F6F8 bg / #7A8099 text)

  Account:
    Row: Settings
    Row: Help
    Row: Sign out → label colour #DC2626, no chevron

Row spec:
  Height: 52px / flex / align-items center / gap 12px
  Icon: 20×20px / #7A8099 outline
  Label: 13px / 500 / #0A0A0A (danger rows: #DC2626)
  Chevron: 12px / #E2E5EC / pushed right
  Border-bottom: 1px solid #E2E5EC (last in group: none)
  Tap: background #F5F6F8 briefly (150ms)
```

### Status change bottom sheet

```
Same sheet structure as avatar sheet.
Title: "[Client name] — move to..." / 13px / 500 / #7A8099

Option rows (4 options):
  Height: 52px / flex / align-items center / gap 12px
  Left: radio circle 18px
    Inactive: #FFFFFF fill / 1.5px solid #E2E5EC
    Active: #0A0A0A fill / 1.5px solid #0A0A0A
  Centre: status pill (display only, per pill spec)
  Border-bottom: 1px solid #E2E5EC

Active row background: very subtle #F5F6F8

aria-role="dialog" / aria-modal="true" / focus trap active
```

---

## Interaction specifications

### Swipe right (status advance)
- Threshold: 60px drag
- Under threshold: spring snap back (200ms ease-out)
- Reveal: destination stage colour fills behind card
- Card slides as single unit, never splits
- Over threshold: pill transitions (scale 0.8→1.0, colour fade, 150ms)
- Cleared status: swipe disabled, card inert

### Bottom sheet animations
- Open: slide up 280ms cubic-bezier(0.16,1,0.3,1)
- Close: slide down 220ms ease-in
- Overlay: fade in 200ms

### Invoice unlock transition
- When status moves to Invoiced: locked state fades out (200ms)
- Unlocked state fades in (300ms, 100ms delay)
- Border animates from dashed to solid

### Inline invoice editing
- Tap editable field (dashed underline): border appears, keyboard raises
- On blur: returns to display mode
- Auto-saves — no save button for invoice field edits

---

## WCAG 2.1 AA compliance

**Perceivable:**
- Colour never the only signal — status pills always have text labels
- Overdue: left border accent + "Xd overdue" text (two signals)
- No text below 11px
- All images have alt text / aria-labels

**Operable:**
- All tap targets minimum 44×44px
- Swipe gestures have fallback: long-press → bottom sheet
- Focus order follows visual order
- All interactive elements keyboard reachable
- Focus ring: 2px solid #0A0A0A / 2px offset on all focusable elements
- No content flashes >3 times/second

**Understandable:**
- Labels always visible above inputs (never placeholder-only)
- Error messages specific: "Client name is required" not "Required"
- Status changes announced via aria-live="polite"
- Bottom sheets: role="dialog" + aria-label

**Robust:**
- Semantic HTML: nav, main, section, button, input, label
- form inputs always have associated label elements
- Status pills: role="status" / aria-label="Status: [value]"
- Project list: role="list" / each card role="listitem"
- Invoice region: role="region" / aria-label="Invoice"

---

## Layout — mobile base

```
Base frame:       390×844px (iPhone 14)
Top bar:          52px fixed + env(safe-area-inset-top)
Search bar:       60px sticky (below top bar)
Scroll area:      fills remaining height
                  horizontal padding 16px
                  top padding 12px
                  bottom padding 80px (FAB clearance)
FAB:              48px height
                  bottom: calc(24px + env(safe-area-inset-bottom))
                  horizontally centred, auto width

Bottom sheets:    width 100% / max-height 70vh / overflow-y auto if needed
```

---

## Figma Make build instructions

### Step 1 — Design tokens
Define all the following as Figma variables before building any components:
- All colour values (base + CMY + semantic)
- All typography scales
- All spacing values
- All border radius values

### Step 2 — Components (build in this order)
1. Status pill (5 variants × default/hover/focus states)
2. Category tag (default + overflow chip)
3. Project card (default, overdue, swipe-right revealing, swipe-left revealing)
4. Button (primary, secondary, destructive, accent × 4 CMY variants, small, FAB)
5. Text input (default, focus, error, disabled)
6. Section card + field row
7. Top bar (home variant, detail variant)
8. Search bar
9. Bottom sheet (status change, avatar navigation)
10. Add field row
11. Rate card item

### Step 3 — Screens (build in this order)
1. Landing
2. Project list — Active tab (populated)
3. Project list — Cleared tab
4. Project list — empty state
5. Project detail — Quoting stage
6. Project detail — In progress stage
7. Project detail — Invoiced stage (invoice unlocked)
8. Project detail — with status bottom sheet open
9. New project form
10. Branding settings
11. Invoice defaults
12. Avatar bottom sheet open state

### Step 4 — Prototype connections
- Project card tap → project detail screen
- Status pill tap → status bottom sheet
- Bottom sheet option → status updates on card, sheet closes
- "+" FAB → new project form
- Avatar → avatar bottom sheet
- Branding row → branding screen
- Invoice defaults row → invoice defaults screen
- Archived row → archived list screen
- Back chevron → project list
- "Send quote" → confirmation state (button label changes)
- "Mark as cleared" → project moves to Cleared tab

---

## Handoff note for Lovable

**Stack:** React + Tailwind CSS + Supabase
**Viewport:** Mobile-first, max-width 430px, centred on desktop with #F5F6F8 background
**Font:** DM Sans from Google Fonts
**Backend:** Supabase (auth, projects table, invoices table, rate_card table, view tracking via edge function + realtime)
**PDF:** jsPDF serverless function on Vercel (separate implementation, not in this scope)
**Storage:** Supabase Storage for logo uploads

All design tokens map directly to Tailwind config. This document is the single source of truth.