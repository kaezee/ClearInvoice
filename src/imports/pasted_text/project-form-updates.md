# Clear — Corrective Prompt v4
## Services field, rate card sheet, form fixes

Apply these corrections precisely. Do not rebuild from scratch.

---

## 1. Remove categories — replace with Services

This affects New Project form and Edit Project screen.

### Remove entirely:
- "Project type" text input field
- "Categories" field with tag chips and "+ Add" button

### Replace with "Services" section:

```
Section label:  "Services"
                10px / 600 / uppercase / 0.08em tracking / #7A8099

Helper text:    "Select from your rate card or add a custom item."
                11px / 400 / #7A8099 / margin-bottom 12px
```

### Selected services display (when items added):
```
Each item row:
  Height:         44px
  Layout:         flex / space-between / align-items centre
  Name left:      13px / 500 / #0A0A0A
  Price right:    13px / 500 / #0A0A0A
  × remove:       far right / 16px / #C4C4C4
                  tap target 24×24px
  Border-bottom:  1px solid #E2E5EC (last row no border)
  Tap on price:   opens inline numeric input to edit
```

### Empty state (no services added):
```
"No services added yet"
13px / 400 / #C4C4C4 / centred / padding 16px 0
```

### Entry point — single button:
```
"+ Add service"
Ghost text button / 13px / 500 / #7A8099
Padding: 8px 0
Sits below selected services list
Hover: #F0F0F0 pill bg / border-radius 8px
No border, no fill at rest
```

### Validation:
```
At least one service required before Save/Create is enabled
Save/Create button disabled (opacity 0.3) until one service added
```

---

## 2. "Add a service" bottom sheet

Triggered by tapping "+ Add service". Replaces the previous two-button system entirely.

### Sheet structure:
```
Handle bar:     standard / 32×3px / #E2E5EC / centred / margin-bottom 16px
Title:          "Add a service" / 17px / 600 / #0A0A0A / left aligned
Close ×:        top right / light context spec (16px / #0A0A0A / #F5F6F8 hover)
Sheet height:   max 70vh / scrollable
```

### Search input (fixed at top, does not scroll):
```
Background:     #F5F6F8
Border:         1px solid #E2E5EC
Border-radius:  8px
Height:         40px
Padding:        0 12px
Left icon:      magnifier / 14px / #7A8099
Placeholder:    "Search services..." / 13px / #C4C4C4
Auto-focused:   yes — keyboard opens immediately when sheet opens
Margin:         12px 0 (below title, above list)
```

### Rate card list (scrollable):
```
Each row:
  Height:         52px
  Name left:      15px / 500 / #0A0A0A
  Price right:    13px / 500 / #7A8099
  Border-bottom:  1px solid #E2E5EC (last row no border)
  Hover:          #F5F6F8 bg
  Tap:            adds service to project instantly
                  row disappears from sheet (prevents duplicate)
                  sheet stays open for more selections
  No radio buttons — tap row = instant add

Already added items: not shown in list (removed after selection)

All items added state:
  "All your services have been added"
  13px / 400 / #7A8099 / centred / padding 16px 0
```

### Search behaviour:
```
As user types:
  List filters to matching names in real time
  Matching characters: 600 weight / #0A0A0A (bold highlight)
  Non-matching rows: hidden

No results state:
  "No match for "[search term]""
  13px / 400 / #7A8099 / centred

  Below it:
  "+ Add "[search term]" as custom →"
  13px / 500 / #0A0A0A
  Tapping: pre-fills custom service name with search term
           opens custom service inline form (see below)
           clears search input
```

### Divider between rate card and custom:
```
1px solid #E2E5EC
"or" label centred on divider
11px / 400 / #C4C4C4
Margin: 4px 0
```

### Custom service (bottom of sheet):
```
Row label: "+ Custom service"
           13px / 500 / #7A8099
           Ghost button style / hover: #F0F0F0 pill bg

Tapping expands inline form below:
  Two inputs side by side:
    Service name: flex 1 / placeholder "e.g. Illustration"
    Price:        100px / placeholder "0.00" / currency prefix
  
  Below inputs:
    "Save to rate card" checkbox
    11px / 400 / #7A8099
    Unchecked by default
    If checked: item saved to user's rate card in Invoice setup
  
  "Add" button: small primary
    #0A0A0A fill / #FFFFFF text / border-radius 8px / 
    height 36px / padding 0 16px / 12px/600
    Disabled until both name and price filled
    On tap: adds to project, collapses form, stays on sheet

Validation:
  Both service name and price required
  Price must be numeric
  Error: "Please enter a price" — 11px / #DC2626 / below price field
```

### Sheet close:
```
× button top right: closes sheet, keeps all selected services
Swipe down: same
No "Done" button needed — selections are instant
```

---

## 3. Project card — services text

Replace any remaining category text with services text:

```
Shows selected service names comma-separated
"Brand identity, Motion design"
12px / 400 / #7A8099
Max 2 service names shown
If more: "Brand identity, Motion +1 more"
Same line, plain text, no chips
```

---

## 4. Edit project — services field behaviour

In Edit Project screen, services field pre-populated from existing project data.

```
Existing services shown as editable rows (name + price + ×)
"+ Add service" button below — same sheet as above
Removing a service that's on a sent invoice:
  Show inline warning below that row:
  "This item is on a sent invoice. Removing it won't 
   update the invoice."
  11px / #7A5000 / shown immediately on × tap
  Confirm remove: small "Remove anyway" link / 11px / #DC2626
  Cancel: "Keep it" / 11px / #7A8099
```

---

## 5. Project detail screen — remove services from PROJECT DETAILS section

```
Remove "Type" / "Project type" field row from PROJECT DETAILS card
Remove "Categories" field row if still present
Services are shown in the Quote/Invoice section as line items
No need to repeat them in project details
```

---

## 6. New project form — field order after changes

```
1. CLIENT DETAILS section card:
   Client name*
   Client email (optional)
   Contact person (optional)

2. PROJECT section card:
   Services* (new field as specified above)
   Quoted amount + Currency (side by side)
   Deposit (optional)
   Start date
   Due date (with 7 days / 14 days / 30 days / Custom pills)
   Notes (optional)

[Create project →] — primary button / full width / fixed bottom
Disabled until: client name + at least one service filled
```

---

## 7. Invoice setup rate card — no change

Rate card in Invoice setup remains exactly as is.
It is the source of truth for the "Add a service" sheet.
Do not modify it.

---

## Do not change

- Status pills — correct
- Card layout (3 rows) — correct
- Top bar — correct
- Avatar sheet — correct
- All button styles already corrected — keep
- Invoice section in project detail — separate, do not touch
- Quote section in project detail — separate, do not touch
- Client-facing pages — separate, do not touch