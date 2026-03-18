# Clear — Edit Project Stage-Aware States Prompt
## For Figma Make — visual design and component states only

Build the Edit Project interaction states for the Project Detail screen. This covers four distinct edit modes depending on the current project status. Build each as a separate component state/variant in Figma Make.

---

## Edit button placement

The edit button lives below the PROJECT DETAILS section card on the project detail screen.

```
"Edit project" — secondary small button
Background:    #F0F0F0
Border:        1.5px solid #0A0A0A
Text:          #0A0A0A / DM Sans 12px / 600
Border-radius: 12px
Height:        36px
Padding:       0 16px
Width:         auto — sits left aligned below the section card
Margin-top:    10px

Hover state:
Background:    #D4D4D4
Border:        1.5px solid #0A0A0A

CLEARED status: do not show the edit button at all
```

---

## Edit mode — shared behaviour across all stages

When edit mode is active:

```
Top bar changes:
  Left:  "Cancel" text link — DM Sans 13px / 400 / #7A8099
  Centre: "Edit project" — DM Sans 15px / 600 / #FFFFFF
  Right: "Save" text — DM Sans 13px / 600 / #FFFFFF
         Disabled state (no changes made): opacity 0.3
         Enabled state (changes made): opacity 1.0

Section card in edit mode:
  Background: #FFFFFF
  Border: 1.5px solid #0A0A0A (stronger border signals active editing)
  Section label: "PROJECT DETAILS" — same style

Editable field row:
  Full row becomes tappable
  Value side becomes an input field
  Input: #FFFFFF bg / 1px solid #E2E5EC bottom border only / 
         no full border / DM Sans 13px / 500 / #0A0A0A
  Cursor: text cursor visible
  
Locked field row (non-editable in this stage):
  Label: #C4C4C4 (lighter than normal)
  Value: #C4C4C4
  Small lock icon: 10px / #C4C4C4 / right of value
  No tap state — visually inert

Category tags in edit mode:
  Existing tags: show × remove button on each tag
  × button: 12px / #6B6B6B / tap to remove tag
  Add tag input: dashed border tag at end of tag row
  Label: "+ Add category" / 11px / 500 / #7A8099
  Max 5 tags — hide add input when 5 reached

Date fields in edit mode:
  Show date picker indicator (calendar icon right of value)
  Value becomes tappable to open date picker
  Calendar icon: 14px / #7A8099

Amount field in edit mode:
  Currency symbol prefix visible (#7A8099)
  Value becomes numeric input
  DM Sans 13px / 500 / #0A0A0A
```

---

## Stage 1 — Quoting (all fields editable)

```
Edit button: visible and active
Edit mode label: "Edit project"

ALL fields editable:
  Client name          → text input
  Client email         → email input
  Contact person       → text input
  Project type         → text input
  Categories           → tag input (add/remove)
  Quoted amount        → numeric input with currency prefix
  Currency             → select dropdown
  Deposit              → text input (percentage or amount)
  Start date           → date picker
  Due date             → date picker
  Notes                → textarea (expands to 3 lines)

No locked fields in Quoting stage.
All field rows show active input state on tap.

Screen variant name: "Project Detail — Edit Mode — Quoting"
```

---

## Stage 2 — In progress (most fields editable)

```
Edit button: visible and active
Edit mode label: "Edit project"

EDITABLE fields:
  Client name          → text input
  Client email         → email input
  Contact person       → text input
  Project type         → text input
  Categories           → tag input (add/remove)
  Quoted amount        → numeric input
                         Helper text below: "Updating this won't 
                         change any sent documents"
                         11px / #7A8099
  Due date             → date picker
  Notes                → textarea

LOCKED fields (display only, greyed):
  Currency             → locked / lock icon
  Deposit              → locked / lock icon
  Start date           → locked / lock icon
                         Tooltip on tap: "Start date can't be 
                         changed once a project has begun"
                         Show as small muted text below the 
                         locked field: 10px / #C4C4C4

Locked field visual spec:
  Label colour:  #C4C4C4
  Value colour:  #C4C4C4
  Lock icon:     10px SVG lock / #C4C4C4 / right-aligned
  Background:    #FAFAFA (very slight grey to signal inactive)
  No tap affordance

Screen variant name: "Project Detail — Edit Mode — In Progress"
```

---

## Stage 3 — Invoiced (limited editing)

```
Edit button: visible and active
Edit mode label: "Edit project"

EDITABLE fields:
  Client name          → text input
  Client email         → email input
  Contact person       → text input
  Project type         → text input
  Categories           → tag input (add/remove)
  Notes                → textarea

LOCKED fields (display only, greyed):
  Quoted amount        → locked / lock icon
                         Muted note below: "Amount is locked 
                         once an invoice is sent"
                         10px / #C4C4C4
  Currency             → locked / lock icon
  Deposit              → locked / lock icon
  Start date           → locked / lock icon
  Due date             → locked / lock icon
                         Muted note below: "Due date is set 
                         on the invoice"
                         10px / #C4C4C4

Notice banner at top of edit mode (Invoiced only):
  Background: #FFFBE6
  Border: 1px solid #FFE24B
  Border-radius: 8px
  Padding: 10px 14px
  Text: "Some fields are locked because an invoice 
         has already been sent."
  Font: DM Sans 12px / 400 / #5C4400

Screen variant name: "Project Detail — Edit Mode — Invoiced"
```

---

## Stage 4 — Cleared (fully read only)

```
Edit button: NOT shown — remove entirely
No edit mode possible
All fields display only at full opacity (no greying)
No lock icons needed — the absence of the edit button communicates read-only

Optional: subtle "Cleared" banner at top of project details section
  Background: #DCFCE7
  Border: 1px solid #4DFF91
  Border-radius: 8px
  Padding: 8px 14px
  Text: "This project is cleared. The record is permanent."
  Font: DM Sans 11px / 500 / #14532D

Screen variant name: "Project Detail — Display — Cleared"
```

---

## Category tag input — edit mode detail

Build this as a reusable component used in Quoting and In Progress edit modes.

```
Tag list (existing tags):
  Each tag: #F0F0F0 fill / 1.5px solid #C4C4C4 / border-radius 16px
  Tag text: DM Sans 11px / 600 / #6B6B6B
  Padding: 4px 8px 4px 12px
  × button: 14px / #9CA3AF / margin-left 4px / tap to remove

Add tag element (appears after existing tags):
  Style: dashed border / #E2E5EC / border-radius 16px
  Label: "+ Add" / 11px / 500 / #7A8099
  Padding: 4px 12px
  On tap: becomes text input inline

When 5 tags exist:
  Hide the "+ Add" element
  Show helper: "Maximum 5 categories" / 10px / #C4C4C4

Tag row wraps to next line if needed — flex wrap
```

---

## Field row states — visual reference

Build these four field row states as variants:

```
State 1 — Default (display):
  Label left: 13px / 400 / #7A8099
  Value right: 13px / 500 / #0A0A0A
  Border-bottom: 1px solid #E2E5EC
  Height: 44px

State 2 — Editable (edit mode, tappable):
  Label left: 13px / 400 / #7A8099 (unchanged)
  Value right: becomes input / 13px / 500 / #0A0A0A
  Border-bottom: 1px solid #0A0A0A (darker when active)
  Height: 44px minimum (expands for textarea)
  Tap state: border-bottom #0A0A0A

State 3 — Locked (edit mode, not editable):
  Label left: 13px / 400 / #C4C4C4
  Value right: 13px / 400 / #C4C4C4
  Lock icon: 10px / #C4C4C4 / right of value
  Background: #FAFAFA
  Border-bottom: 1px solid #F0F0F0
  Height: 44px

State 4 — Active input (field being typed in):
  Label left: 10px / 600 / #0A0A0A / moves above field (floating label)
  Input: full width / border-bottom 1.5px solid #0A0A0A
  Cursor visible
  Height: 52px (expanded to show floating label)
```

---

## Prototype connections to add

```
"Edit project" button tap    → Edit mode variant for that stage
"Save" tap                   → Display mode (same screen)
"Cancel" tap                 → Display mode (discard changes)
Tag × button tap             → tag removed from row
"+ Add" tag tap              → tag input active state
Date field tap               → date picker overlay
```

---

## Screens to build (one per stage)

```
1. Project Detail — Display — Quoting
   (edit button visible, all fields display)

2. Project Detail — Edit Mode — Quoting
   (all fields editable, no locked fields)

3. Project Detail — Display — In Progress
   (edit button visible, all fields display)

4. Project Detail — Edit Mode — In Progress
   (mixed editable/locked fields)

5. Project Detail — Display — Invoiced
   (edit button visible, all fields display)

6. Project Detail — Edit Mode — Invoiced
   (limited editable fields, yellow notice banner)

7. Project Detail — Display — Cleared
   (no edit button, green cleared banner, all display)
```

---

## Do not change

- Invoice section (separate from project details)
- Quote section (separate from project details)
- Status pill
- Top bar black background
- Swipe interactions
- Any other screen