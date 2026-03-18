# Clear — Services Field Final Prompt
## Replaces all previous services field prompts

Apply to both New Project form and Edit Project screen.

---

## Services section structure

Two zones within the Services section of the form card.

### Section label
```
"SERVICES"
10px / 600 / uppercase / 0.08em tracking / #7A8099
margin-bottom 12px
```

---

## Zone 1 — Selected services (top)

Always visible. Shows what has been added to this project.

### Empty state
```
"No services added yet"
13px / 400 / #C4C4C4 / centred / padding 12px 0
```

### Populated state — each selected service
```
Each row:
  Height:         44px
  Layout:         flex / space-between / align-items centre
  Name left:      13px / 600 / #0A0A0A
  Price right:    13px / 500 / #0A0A0A
                  Tappable — tap to edit price inline
                  On tap: becomes numeric input
                  On blur: saves new price, returns to display
  × remove:       far right / 16px / #C4C4C4 / 24×24px tap target
                  Hover: #FEF2F2 circle bg / icon #DC2626
  Border-bottom:  1px solid #E2E5EC (last row no border)
  Background:     #FFFFFF
```

### Total row (visible when 1+ services added)
```
Appears after last service row
Border-top:     1.5px solid #0A0A0A
Padding-top:    10px
Margin-top:     6px
"Total" left:   12px / 500 / #7A8099
Amount right:   16px / 600 / #0A0A0A
                Auto-calculates as services are added/removed
```

---

## Divider between zones

```
Margin: 14px 0 10px
Layout: flex / align-items centre / gap 8px

Left line:   flex 1 / 1px solid #E2E5EC
Label:       "Listed services" / 10px / 500 / #C4C4C4
Right line:  flex 1 / 1px solid #E2E5EC
```

---

## Zone 2 — Listed services (rate card)

Scrollable list of all rate card items. Scales to any number of services.

### Search input (fixed at top of Zone 2)
```
Background:     #F5F6F8
Border:         1px solid #E2E5EC
Border-radius:  8px
Height:         36px
Padding:        0 12px 0 32px
Left icon:      magnifier / 14px / #7A8099 / absolute positioned
Placeholder:    "Search your services..." / 13px / #C4C4C4
Font:           DM Sans 13px / 400 / #0A0A0A
Margin-bottom:  8px

Focus state:
  Border: 1px solid #0A0A0A
  No glow, no shadow — just border darkens

Filters list in real time as user types
```

### Rate card list
```
Container:
  Max-height:     240px
  Overflow-y:     scroll
  Border:         1px solid #E2E5EC
  Border-radius:  8px

Each row:
  Height:         48px
  Padding:        0 14px
  Name left:      13px / 500 / #0A0A0A
  Price right:    13px / 400 / #7A8099
  Border-bottom:  1px solid #E2E5EC (last row no border)
  Background:     #FFFFFF
  Cursor:         pointer
  
  Hover state:
    Background: #F5F6F8
    Transition: 150ms ease-in-out
  
  Press state:
    Background: #F0F0F0
    Scale: 0.99
  
  Tap: instantly adds to Zone 1 / row removed from Zone 2

Already added rows:
  Do not show in Zone 2 — remove from list when added to Zone 1
  Reappear in Zone 2 if removed from Zone 1

All items added:
  Show inside container:
  "All your services have been added"
  13px / 400 / #C4C4C4 / centred / padding 16px
```

### Search — no results state
```
Hide the rate card list container
Show:
  "No match for "[search term]""
  13px / 400 / #C4C4C4 / centred / margin-bottom 6px

  "+ Add "[search term]" as custom →"
  13px / 500 / #0A0A0A / centred
  Ghost button hover: #F0F0F0 pill bg / border-radius 8px
  Tap: pre-fills custom service name with search term
       clears search input
       expands custom service inline form (see below)
```

---

## Custom service

Always shown below Zone 2. Never inside the rate card list.

### Entry point
```
"+ Custom service"
Type:           Ghost text button (light surface spec)
Font:           DM Sans 13px / 500 / #7A8099
Padding:        8px 0
Margin-top:     8px
Hover:          #F0F0F0 pill bg / border-radius 8px / padding 8px 12px
Press:          rgba(0,0,0,0.06) pill bg
No underline at any state
Tap: expands inline form below
```

### Custom service inline form (expands on tap)
```
Container:
  Background:     #F5F6F8
  Border-radius:  8px
  Padding:        12px
  Margin-top:     8px

Two inputs side by side (row 1):
  Service name input:
    Flex: 1
    Height: 36px
    Background: #FFFFFF
    Border: 1px solid #E2E5EC
    Border-radius: 8px
    Padding: 0 10px
    Font: DM Sans 13px / 400 / #0A0A0A
    Placeholder: "e.g. Illustration" / #C4C4C4
    Focus: border 1px solid #0A0A0A
  
  Price input:
    Width: 90px
    Height: 36px
    Background: #FFFFFF
    Border: 1px solid #E2E5EC
    Border-radius: 8px
    Padding: 0 10px
    Font: DM Sans 13px / 400 / #0A0A0A
    Placeholder: "0.00" / #C4C4C4
    Keyboard type: numeric
    Currency symbol prefix: #7A8099 / inside field left
    Focus: border 1px solid #0A0A0A

  Gap between inputs: 8px

Actions row (row 2, below inputs):
  Left side: "Save to rate card" checkbox
    Checkbox: 14×14px / border 1px solid #E2E5EC
    Checked: #0A0A0A fill / white checkmark
    Label: "Save to rate card" / 11px / 400 / #7A8099
    Unchecked by default
    If checked: saves item to Invoice setup rate card on Add

  Right side: "Add" button — MUST use correct button spec:
    Background:     #0A0A0A
    Color:          #FFFFFF
    Border:         1.5px solid #0A0A0A
    Border-radius:  8px   ← small button variant (not 16px)
    Height:         32px  ← small button variant
    Padding:        0 14px
    Font:           DM Sans 12px / 600
    
    Hover:          background #2A2A2A / border #2A2A2A
    Press:          background #3A3A3A / scale(0.98)
    
    Disabled state (name or price empty):
      Opacity: 0.3
      Cursor: default
      No hover effect
    
    On tap (enabled):
      Adds service to Zone 1
      Collapses the inline form
      Clears both input fields
      If "Save to rate card" checked: adds to rate card

  "Cancel" link — right of checkbox, left of Add button:
    Actually sits below Add as a separate line OR
    can be a text link next to checkbox
    Font: 12px / 400 / #7A8099
    Ghost button hover: #F0F0F0 pill bg / border-radius 8px
    Tap: collapses form, clears inputs, no action taken
```

---

## Validation rules

```
Zone 1 must have at least 1 service before:
  Save (Edit project) enables
  Create project → button enables

Both inputs required before "Add" button enables in custom form:
  Service name: not empty
  Price: numeric value greater than 0

Price editing inline (Zone 1):
  Any numeric value accepted
  Empty or zero: revert to previous price on blur
```

---

## Edit project — additional behaviour

```
Pre-populated:
  Zone 1 shows existing project services on load
  Zone 2 shows remaining rate card items (excluding already added)

Removing a service that is on a sent quote or invoice:
  Show warning below that row in Zone 1:
  "On a sent document — removing won't update it."
  11px / 400 / #7A5000
  
  Two inline actions:
  "Remove anyway"  11px / 500 / #DC2626 / ghost hover #FEF2F2
  "Keep it"        11px / 500 / #7A8099 / ghost hover #F0F0F0
```

---

## Figma Make prototype connections

```
Rate card row tap      → row moves to Zone 1 / removed from Zone 2
Zone 1 × tap           → service removed / reappears in Zone 2
Zone 1 price tap       → price becomes editable input
Search input           → filters Zone 2 list in real time
No results state       → "+ Add as custom →" pre-fills custom form
"+ Custom service" tap → expands inline form
"Add" button tap       → adds to Zone 1 / collapses form
"Cancel" tap           → collapses form / no changes
Total row              → auto-updates when Zone 1 changes
```

---

## Do not change

- Zone 1 / Zone 2 two-zone concept — correct
- Search functionality — correct  
- Auto-calculating total — correct
- Rate card in Invoice setup — source of truth, no changes
- Any other form fields
- Any other screens