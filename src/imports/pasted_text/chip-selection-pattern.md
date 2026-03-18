# Clear — Services Field: Chip Selection Pattern
## Replaces bottom sheet approach entirely

Apply this to both New Project form and Edit Project screen.

---

## Core concept

Rate card items are shown directly in the form as tappable chips.
No bottom sheet. No modal. No navigation.
Tap to select. Tap again to deselect.
Everything visible at once.

---

## Services section — full spec

### Section label
```
"SERVICES"
10px / 600 / uppercase / 0.08em tracking / #7A8099
margin-bottom 8px
```

### Helper text
```
"Tap to add from your rate card"
11px / 400 / #7A8099
margin-bottom 12px
```

---

## Chip display — two states

### Unselected chip (available to add):
```
Background:    #FFFFFF
Border:        1.5px solid #E2E5EC
Border-radius: 16px
Padding:       6px 14px
Font:          DM Sans 12px / 500 / #0A0A0A
Display:       service name only (no price shown)

Hover:         border-color #0A0A0A
               background #F5F6F8
Press:         scale(0.97)
```

### Selected chip (added to project):
```
Background:    #0A0A0A
Border:        1.5px solid #0A0A0A
Border-radius: 16px
Padding:       6px 14px 6px 10px
Font:          DM Sans 12px / 600 / #FFFFFF
Display:       service name + × remove icon right
               × icon: 12px / #FFFFFF / opacity 0.7 / margin-left 6px

Hover:         background #2A2A2A
Press:         scale(0.97)
Tap ×:         deselects chip, returns to unselected state
```

### Chip layout:
```
Display:       flex wrap
Gap:           8px horizontal / 8px vertical
Chips wrap naturally to next line
```

---

## Under 6 rate card items — show all inline

All chips visible directly in the form.
No sheet, no "see more" button.

```
Example (4 items):
[Brand identity] [Web design] [UX audit] [Motion design]

After selecting Brand identity and Motion design:
[● Brand identity ×] [Web design] [UX audit] [● Motion design ×]
```

---

## 6+ rate card items — show first 5 + overflow

Show first 5 chips inline.
If user has more than 5 rate card items, show a "+ N more" chip.

```
First 5 chips: shown inline as normal
Overflow chip: "+ 3 more"
               Background: #F5F6F8
               Border: 1.5px solid #E2E5EC
               Border-radius: 16px
               Padding: 6px 14px
               Font: 12px / 500 / #7A8099
               Tap: expands to show all remaining chips inline
                    overflow chip disappears
                    "Show less" link appears below chips
                    11px / #7A8099 / tap to collapse back
```

---

## Custom service

Always shown below the chip grid as a text button.

```
"+ Custom service"
13px / 500 / #7A8099
Ghost button / hover: #F0F0F0 pill bg / border-radius 8px
Padding: 6px 0
Margin-top: 8px (below chip grid)
```

### Tapping "+ Custom service" expands inline form:

```
Appears below the chip grid, above any other fields
Background: #F5F6F8
Border-radius: 8px
Padding: 12px

Two inputs side by side:
  Service name:  flex 1 / placeholder "e.g. Illustration"
                 standard input spec
  Price:         100px / placeholder "0.00"
                 currency symbol prefix / numeric input

Below inputs (full width):
  "Save to rate card" checkbox row
  Checkbox 16px + label "Save to my rate card"
  11px / 400 / #7A8099
  Unchecked by default

Action row (below checkbox):
  "Add" button: small primary
    #0A0A0A / #FFFFFF / border-radius 8px / height 32px / 
    padding 0 14px / 12px/600
    Right aligned
  "Cancel" link: 12px / #7A8099 / left of Add button
    Tap: collapses the inline form

On "Add":
  Creates a selected chip with the custom service name
  Chip style: same as selected rate card chip (#0A0A0A fill)
  But with a subtle "custom" indicator:
    Small dot or asterisk before the name: "● Custom name ×"
    Or just treat identically — no indicator needed for v1
  If "Save to rate card" checked: adds to rate card in Invoice setup
  Collapses the inline form
```

---

## Selected services — price display

When a service is selected it shows as a filled black chip on the chip row.

Below the chip grid, selected services also show as an editable list:

```
Selected services list (appears below chips when at least 1 selected):
Divider: 1px solid #E2E5EC / margin 12px 0

Each row:
  Height:         44px
  Name left:      13px / 500 / #0A0A0A
  Price right:    13px / 500 / #0A0A0A (tappable to edit)
  Border-bottom:  1px solid #E2E5EC

Tap on price: becomes numeric input inline
              On blur: saves new price
              Updated price applies to this project only
              Does not update the rate card

Purpose: user can confirm or adjust prices per project
         without going back to Invoice setup
```

---

## Empty state (no rate card set up)

If user has no rate card items yet:

```
Chip area shows:
  "No services in your rate card yet."
  13px / 400 / #C4C4C4 / centred

  "Set up rate card →" link
  13px / 500 / #0A0A0A
  Navigates to Invoice setup → Rate card section
  centred / margin-top 4px

"+ Custom service" still available below
```

---

## Validation

```
At least one service (from rate card or custom) required
before Save / Create project button enables.

Save/Create: disabled (opacity 0.3) until one service added
```

---

## Edit project — additional behaviour

```
Existing services pre-populated as selected chips
User can:
  Tap selected chip × to remove
  Tap unselected chip to add
  Tap "+ Custom service" to add custom item
  Tap price in the list below to edit

Removing a service that is on a sent invoice:
  Chip tap × shows inline warning below the selected list:
  "This item is on a sent invoice.
   Removing it won't update the sent invoice."
  11px / #7A5000

  Two actions appear:
  "Remove anyway" — 11px / 500 / #DC2626
  "Keep it"       — 11px / 500 / #7A8099
```

---

## Do not change

- Rate card in Invoice setup — source of truth, no changes
- Invoice line items in project detail — separate system
- Quote line items in project detail — separate system
- Any other form fields
- Any other screens