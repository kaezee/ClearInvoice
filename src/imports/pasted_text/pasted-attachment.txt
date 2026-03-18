# Clear — Project Card Redesign Prompt
## For Figma Make — card list view only

Apply these changes to ALL project cards across the Active tab, Cleared tab, and Archived screen. Do not change the project detail screen — only the card list view.

---

## Card layout — full restructure

Three rows, two columns. This replaces the current layout entirely.

```
Row 1: [Client name]              [Modifier text]
Row 2: [Status pill]
Row 3: [Category text]                 [Amount]
```

### Row 1 — Client name + Modifier
```
Left:   Client name
        DM Sans 15px / 600 / #0A0A0A
        
Right:  Modifier text
        DM Sans 12px / 400
        Colours:
          Default/neutral:  #7A8099
          Viewed:           #00A3B5
          Overdue:          #7A5000
        Right aligned
        Vertically aligned with client name on same baseline
```

### Row 2 — Status pill only
```
Left:   Status pill per existing spec
        No element on the right side of this row
```

### Row 3 — Category text + Amount
```
Left:   Category text (plain text, NOT pills)
        DM Sans 12px / 400 / #7A8099
        Multiple categories: comma separated on one line
        "Motion rebrand, Logo, Strategy"
        If text too long: truncate with ellipsis
        "Motion rebrand, Logo, Stra..."

Right:  Amount
        DM Sans 18px / 600 / #0A0A0A
        Right aligned
        Vertically aligned with category text on same baseline
        Currency symbol same size and weight as amount
```

### Spacing
```
Vertical gap between rows:  8px
Card padding:                16px all sides
```

---

## Category display — plain text not pills

Remove all category tag pills from the card list view.

```
REMOVE:   Grey pill tags (Motion rebrand) (Logo) (+2)
REPLACE:  Plain comma-separated text string
          "Motion rebrand, Logo, Strategy"
          DM Sans 12px / 400 / #7A8099

Rules:
  Max display length: truncate with ellipsis if exceeds card width
  Single category:    "Motion rebrand"
  Multiple:           "Motion rebrand, Logo"
  No pills, no borders, no backgrounds
  No +N overflow chip — just truncate with ellipsis
```

Note: Category pills STAY as pills inside the project detail screen. This change is card list view only.

---

## Overdue card — remove separate badge

```
REMOVE:   "Overdue" yellow pill badge (top right of card)
KEEP:     3px solid #FFE24B left border on card
KEEP:     Amber modifier text "Not viewed · 17d overdue" 
          or "Viewed · 17d overdue" — #7A5000
          This sits top right in Row 1 as the modifier text
```

The yellow left border + amber modifier text together communicate overdue clearly. No separate badge needed.

---

## Amount — increased size

```
Current:  15px / 500
Updated:  18px / 600 / #0A0A0A

The amount is the anchor of the card.
It should feel like the most substantial number.
Currency symbol matches: 18px / 600
```

---

## Modifier text — moved to top right

```
Current position:  bottom right, below amount
New position:      top right, Row 1, same row as client name

This means time-sensitive information (viewed, overdue, sent)
is seen immediately when scanning the list.
The amount anchors the bottom of the card.
```

---

## Cleared tab cards — additional rules

```
No swipe actions on Cleared cards — read only
No overdue state possible on Cleared cards
Modifier text for Cleared: "Paid [date]" — #1A7A3A (dark green)
Amount: same 18px/600/#0A0A0A
Status pill: Cleared (#4DFF91) — same spec
```

---

## Card padding and spacing

```
Card background:      #FFFFFF
Card border:          1px solid #E2E5EC
Card border-radius:   8px
Card padding:         16px all sides
Gap between cards:    10px
Row gap:              8px between each of the 3 rows
```

---

## Complete card examples

### Quoting card (default):
```
Row 1: "Notion"                    "Sent · not viewed" (#7A8099)
Row 2: [Quoting pill — #FFE24B]
Row 3: "Motion rebrand"                         "$5,500"
```

### In progress card:
```
Row 1: "Arc Browser"               "Due 30 Mar" (#7A8099)
Row 2: [In progress pill — #FF659C]
Row 3: "App design"                             "$7,800"
```

### Invoiced card — viewed, not overdue:
```
Row 1: "Figma"                     "Viewed 2h ago" (#00A3B5)
Row 2: [Invoiced pill — #65F7FF]
Row 3: "UX audit, UI design"                    "$2,600"
```

### Invoiced card — overdue (left border #FFE24B, 3px):
```
Row 1: "Liveblocks"        "Not viewed · 17d overdue" (#7A5000)
Row 2: [Invoiced pill — #65F7FF]
Row 3: "UX audit"                               "£4,200"
```

### Cleared card:
```
Row 1: "Linear"                    "Paid 12 Mar" (#1A7A3A)
Row 2: [Cleared pill — #4DFF91]
Row 3: "Motion design"                          "$3,600"
```

---

## Do not change

- Status pill colours, stroke, border-radius, font — correct as is
- Card border radius (8px) — keep
- Swipe right interaction — keep
- Swipe left Archive/Delete on Active cards — keep
  (white background, coloured icons/labels only)
- Top bar, search bar, tab navigation — keep
- FAB "+ New project" — keep
- Any other screen outside the card list view