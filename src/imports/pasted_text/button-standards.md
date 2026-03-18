# Clear — Ghost & Text Button Standardisation Prompt
## For Figma Make — all ghost, link, and text buttons

---

## Universal rules — apply to every ghost/text button

```
Never underline at any state (resting, hover, press)
Never change text colour on hover
Never change text opacity on hover
Never collapse to text height — minimum height always enforced
Background pill is the only hover signal
Cursor: pointer on all interactive text buttons
```

---

## Two button types

### Link button (navigates somewhere)
Has → arrow. Signals the user is going to another screen.

```
Examples:
  "Sign in →"
  "Edit profile →"
  "View invoice →"
  "Go to projects →"
```

### Ghost button (performs in-place action)
No arrow. Action happens without navigating.

```
Examples:
  "Skip for now"
  "Go back"
  "Cancel"
  "Edit project"
  "None of these"
  "Not yet"
```

---

## Size specifications — minimum height enforced

### Nav text buttons (top bar — dark bg)
```
Min height:    44px tap target
Padding:       10px 12px
Border-radius: 8px
Font:          DM Sans 13px / 500
```

### Inline text buttons (light surfaces)
```
Min height:    36px
Padding:       8px 12px
Border-radius: 8px
Font:          DM Sans 13px / 500
```

### Modal/sheet text links (Go back, Cancel, Not yet)
```
Min height:    36px
Padding:       8px 12px
Border-radius: 8px
Font:          DM Sans 13px / 400
```

---

## Hover states — dark surface (black bg)

Applies to: Save, Cancel (top bar), Sign in →, Skip for now,
Already have an account?, Go to projects →, any text button on black

```
Resting:
  Background: transparent
  No underline
  No border
  Text: as specified per button

Hover:
  Background: rgba(255,255,255,0.12) 
  Border-radius: 8px
  Text: unchanged — same colour, same opacity
  No underline

Press:
  Background: rgba(255,255,255,0.18)
  Text: unchanged

Disabled (Save when no changes):
  Text: #FFFFFF / opacity 0.3
  No hover state
  Cursor: default not pointer
```

---

## Hover states — light surface (white/grey bg)

Applies to: Edit profile →, Edit project, Go back, Cancel (modals),
Skip, None of these, Not yet, any text button on white

```
Resting:
  Background: transparent
  No underline
  No border
  Text: as specified per button

Hover:
  Background: #F0F0F0
  Border-radius: 8px
  Text: unchanged — same colour, same opacity
  No underline

Press:
  Background: rgba(0,0,0,0.06)
  Text: unchanged
```

---

## Individual button corrections

### "Save" — top bar, dark bg
```
Resting:   #FFFFFF / 13px / 600 / transparent bg
Hover:     rgba(255,255,255,0.12) pill bg / text unchanged
Press:     rgba(255,255,255,0.18) pill bg
Disabled:  #FFFFFF / opacity 0.3 / no hover / cursor default
Min height: 44px / padding 10px 12px / border-radius 8px
No underline at any state
```

### "Cancel" — top bar, dark bg
```
Resting:   rgba(255,255,255,0.45) / 13px / 500 / transparent bg
Hover:     rgba(255,255,255,0.12) pill bg / text unchanged
Press:     rgba(255,255,255,0.18) pill bg
Min height: 44px / padding 10px 12px / border-radius 8px
No underline at any state
```

### "Sign in →" — landing + onboarding O2, dark bg
```
Type:      Link button (→ arrow, navigates to sign in screen)
Resting:   rgba(255,255,255,0.5) / 13px / 500 / transparent bg
Hover:     rgba(255,255,255,0.12) pill bg / text unchanged
Press:     rgba(255,255,255,0.18) pill bg
Min height: 36px / padding 8px 12px / border-radius 8px
No underline at any state
Arrow → same colour and opacity as text
```

### "Already have an account? Sign in →" — landing, dark bg
```
"Already have an account?" — rgba(255,255,255,0.3) / not tappable / inline text
"Sign in →" — rgba(255,255,255,0.5) / tappable / link button treatment above
Both on same line, no line break between them
Only "Sign in →" portion has hover state
```

### "Skip for now" — onboarding O2, dark bg
```
Type:      Ghost button (no arrow, skips to next screen)
Resting:   rgba(255,255,255,0.4) / 13px / 400 / transparent bg
Hover:     rgba(255,255,255,0.12) pill bg / text unchanged
Press:     rgba(255,255,255,0.18) pill bg
Min height: 36px / padding 8px 12px / border-radius 8px
No underline, no cyan tint at any state
```

### "Edit profile →" — Profile sheet, light bg
```
Type:      Link button (→ arrow, navigates to edit profile screen)
Resting:   #0A0A0A / 13px / 500 / transparent bg
Hover:     #F0F0F0 pill bg / text unchanged
Press:     rgba(0,0,0,0.06) pill bg
Min height: 36px / padding 8px 12px / border-radius 8px
No underline at any state
```

### "Edit project" — inside project detail card, light bg
```
Type:      Ghost button (no arrow, triggers edit mode)
Resting:   #7A8099 / 13px / 500 / centred / transparent bg
Hover:     #F0F0F0 pill bg / text stays #7A8099 / text unchanged
Press:     rgba(0,0,0,0.06) pill bg
Min height: 36px / padding 8px 16px / border-radius 8px
No underline at any state
Intentionally muted — secondary action, do not darken on hover
```

### "Go back" — confirmation modal, light bg
```
Type:      Ghost button (returns to step 1 of modal)
Resting:   #7A8099 / 13px / 400 / centred / transparent bg
Hover:     #F0F0F0 pill bg / text unchanged
Press:     rgba(0,0,0,0.06) pill bg
Min height: 36px / padding 8px 12px / border-radius 8px
No underline at any state
```

### "Cancel" — modals and sheets, light bg
```
Type:      Ghost button
Resting:   #7A8099 / 13px / 400 / centred / transparent bg
Hover:     #F0F0F0 pill bg / text unchanged
Press:     rgba(0,0,0,0.06) pill bg
Min height: 36px / padding 8px 12px / border-radius 8px
No underline at any state
```

### "Not yet" — cleared confirmation modal, light bg
```
Type:      Ghost button
Same spec as "Cancel" above
```

### "None of these" — project type dropdown, light bg
```
Type:      Ghost button (dismisses dropdown, focuses input)
Resting:   #7A8099 / 13px / 500 / transparent bg
Hover:     #F0F0F0 pill bg / text unchanged
Press:     rgba(0,0,0,0.06) pill bg
Min height: 44px (matches other dropdown rows) / padding 0 16px
No underline at any state
On tap: dismisses dropdown, focuses project type text input
```

### "Go to projects →" — onboarding O5, dark bg
```
Type:      Link button (→ arrow, navigates to project list)
Same spec as "Sign in →" above but label differs
Resting:   #FFFFFF / 14px / 600 (this is the primary CTA on O5)
```

---

## Transition

All ghost/text buttons:
```
transition: background-color 150ms ease-in-out
Properties: background-color only
No transform on ghost/text buttons (scale only on filled buttons)
```

---

## Do not change

- All filled buttons (primary, secondary, accent, destructive) — separate spec
- All icon buttons (close ×, chevrons ‹) — separate spec
- Any button that already has correct hover behaviour
- Font sizes and weights specified per button above
- Text colours specified per button above