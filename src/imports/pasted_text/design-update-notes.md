# Clear — Figma Make Correction Prompt v2

These are targeted corrections and structural updates to the existing design. Apply precisely — do not rebuild screens from scratch unless specified.

---

## 1. Navigation restructure — BREAKING CHANGE

### Remove
- The three-tab system (Active / Cleared / Archived) is replaced with a two-tab system.
- Remove the filter pill row (All / Ready / In progress / Invoiced / Overdue) entirely from all screens.
- Remove the filter/sliders icon from the top bar right side.

### Replace with

**Top bar — revised:**
```
Left:  "Clear." wordmark (white, violet period)
Right: Avatar circle (32×32px, border-radius 50%, background #7C3AED,
       initials "K" or first letter of user name, white 13px/600)
       + 8px gap +
       "+" button (28×28px, border-radius 7px, background #7C3AED, white icon)
```

**Tab row — two tabs only:**
```
Active  [count badge]     Cleared  [count badge]

Active tab:  white underline indicator 2px when selected
Cleared tab: white underline indicator 2px when selected
Both inactive: rgba(255,255,255,0.45) text
```

**Search bar — NEW, sits below tab row:**
```
Background:    #FFFFFF
Border:        1px solid #E8E8E8
Border-radius: 8px
Height:        40px
Padding:       0 12px
Left icon:     magnifier SVG 16px, #AAAAAA
Placeholder:   "Search projects..." — #AAAAAA / 13px / 400
Margin:        10px 16px (outside the black top bar, on the white/surface area)

Behaviour: searches client name, project type, amount across BOTH tabs simultaneously.
When focused: border becomes 1px solid #7C3AED, subtle violet glow 0 0 0 3px rgba(124,58,237,0.12)
```

**Archived — removed from tabs, moved to avatar bottom sheet (see section 2)**

---

## 2. Avatar bottom sheet — NEW SCREEN/COMPONENT

Tapping the avatar circle opens a bottom sheet from the bottom of the screen.

```
Overlay:        rgba(0,0,0,0.4) behind sheet
Background:     #FFFFFF
Border-radius:  12px 12px 0 0
Padding:        20px 16px 32px
Safe area:      add env(safe-area-inset-bottom) to bottom padding

Handle bar:
  Width: 32px / Height: 3px / Background: #D0D0D0
  Border-radius: 2px / Centered / Margin-bottom: 20px
```

**Sheet content structure:**

```
— Identity block —
Avatar circle: 44×44px / #7C3AED bg / white initials / 14px / 600
Name:          "Krishnachandran R." — 15px / 600 / #0A0A0A
Business:      "Kaezee Designs" — 13px / 400 / #888888
Edit link:     "Edit profile →" — 13px / 500 / #7C3AED
Margin-bottom: 20px
Divider:       1px solid #E8E8E8

— Your setup —
Section label: "Your setup" — 10px / 600 / uppercase / 0.08em tracking / #888888 / padding 12px 0 6px
Row: Branding          → icon + label + chevron
Row: Invoice defaults  → icon + label + chevron

Divider: 1px solid #E8E8E8

— Projects —
Section label: "Projects" — same label style
Row: Archived projects → icon + label + count badge + chevron
     Count badge: small pill, #F4F4F4 bg, #888888 text, "4" — shows archived count

Divider: 1px solid #E8E8E8

— Account —
Section label: "Account" — same label style
Row: Settings   → icon + label + chevron
Row: Help       → icon + label + chevron
Row: Sign out   → icon + label, NO chevron, text color #DC2626 (danger, destructive)
```

**Row spec (each row in the sheet):**
```
Height:         52px
Display:        flex / align-items center / gap 12px
Border-bottom:  1px solid #E8E8E8 (last row in group: none)
Icon:           20×20px / #888888 stroke / simple outline style
Label:          13px / 500 / #0A0A0A
Chevron:        12px / #D0D0D0 / pushed right via flex
Tap state:      background #F4F4F4 (brief, 150ms)
```

**Dismiss:** tap overlay, swipe down, or tap any row (navigates and closes).

---

## 3. Border radius corrections (carry over from v1)

```
Project cards:          border-radius 8px (change from ~16-20px)
FAB "+ New project":    border-radius 8px, auto width, centred
Filter pills:           REMOVED (no longer needed)
Status pills in cards:  keep fully rounded (radius-pill) — correct as is
```

---

## 4. FAB correction (carry over from v1)

```
Width:     auto / padding: 0 32px
Position:  fixed, bottom 24px + env(safe-area-inset-bottom), centered horizontally
Height:    48px
Radius:    8px
```

Not full-width. Not edge-to-edge. Floats centred.

---

## 5. Typography weight on cards (carry over from v1)

```
Client name:    600 weight — primary, dominant
Amount:         500 weight — supporting, should not compete
Project type:   400 weight, #888888 — tertiary
```

---

## 6. Swipe right — full card slides (carry over from v1)

The entire card slides right as one unit. Green background (#DCFCE7) with arrow icon sits behind the card in z-order. Card content moves together — does not split into two panels.

Green reveal area: full height and width of the card, z-index below the card.

---

## 7. Tab indicator consistency (carry over from v1)

Active tab indicator: 2px white underline on ALL tabs. Remove the green underline on Cleared tab.

---

## 8. Card internal spacing

Card padding: 16px on all sides (increase from current ~12px).
Gap between client name row and status pill row: 10px minimum.

---

## 9. Search bar placement detail

Search bar sits OUTSIDE the black top bar — on the white/surface content area, below where the tabs end.
It is not inside the top bar. It is the first element in the scrollable content area, but it does NOT scroll away — it stays sticky just below the top bar.

```
Position: sticky, top: [height of topbar]px
Background: #F4F4F4 (matches surface, no visible boundary)
Padding: 10px 16px
Z-index: above list content
```

---

## 10. Archived projects screen — NEW SCREEN

When user taps "Archived projects" in the avatar sheet, navigate to a new full-screen view:

```
Top bar:
  Back chevron (violet) + "Archived" title + item count in muted text

Content:
  Same project card component as main list
  Status pill variant: "Archived" — background #F3F4F6 / text #6B7280
  Cards are read-only — no swipe right (no status to advance to)
  Swipe left still available: "Restore" (slate bg) + "Delete" (red bg)
  Restore moves project back to Active / In progress

Empty state:
  "No archived projects" / muted / centred
```

---

## 11. What to leave unchanged

- Wordmark "Clear." with violet period — correct
- Black top bar background — correct
- Violet "+" button — correct
- Overdue card yellow tint — correct
- Overdue badge yellow pill — correct
- "X days overdue" text in yellow-text colour — correct
- Swipe left Archive/Delete reveal — correct (colours and icons)
- Cleared tab green pill styling — correct
- Overall card information structure — correct
- Three-section sheet handle + overlay pattern — correct, reuse for avatar sheet