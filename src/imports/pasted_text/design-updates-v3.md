# Clear — Corrective Prompt v3
## Button interaction states, form corrections, visual system updates

Apply these corrections precisely to the existing design. Do not rebuild from scratch.

---

## 1. Button interaction states — full system replacement

Replace ALL existing button hover/interaction states with the following. The core principle: **everything darkens on hover, nothing inverts.**

### Primary button
```
Default:  background #0A0A0A / color #FFFFFF / border 1.5px solid #0A0A0A
Hover:    background #2A2A2A / color #FFFFFF / border 1.5px solid #2A2A2A
Active:   background #3A3A3A / color #FFFFFF / border 1.5px solid #3A3A3A / scale(0.98)
Disabled: background #0A0A0A / color #FFFFFF / opacity 0.3 / cursor not-allowed
Focus:    background #0A0A0A / color #FFFFFF / outline 2px solid #0A0A0A / outline-offset 3px
Transition: all 150ms ease-in-out (background-color, color, border-color, transform)
```

### Secondary button
```
Default:  background #F0F0F0 / color #0A0A0A / border 1.5px solid #0A0A0A
Hover:    background #D4D4D4 / color #0A0A0A / border 1.5px solid #0A0A0A
Active:   background #BEBEBE / color #0A0A0A / scale(0.98)
Disabled: background #F0F0F0 / color #0A0A0A / opacity 0.3 / cursor not-allowed
Focus:    outline 2px solid #0A0A0A / outline-offset 3px
```

### Destructive button
```
Default:  background #F0F0F0 / color #DC2626 / border 1.5px solid #0A0A0A
Hover:    background #DC2626 / color #FFFFFF / border 1.5px solid #DC2626
Active:   background #B91C1C / color #FFFFFF / border 1.5px solid #B91C1C / scale(0.98)
Disabled: opacity 0.3 / cursor not-allowed
Focus:    outline 2px solid #DC2626 / outline-offset 3px
```
Note: Destructive is the only button where hover reveals a colour fill. This is intentional — the red fill on hover signals danger before committing.

### Accent — Cyan (Mark as invoiced)
```
Default:  background #65F7FF / color #0A0A0A / border 1.5px solid #0A0A0A
Hover:    background #00C2CC / color #0A0A0A / border 1.5px solid #0A0A0A
Active:   background #009BA3 / color #0A0A0A / scale(0.98)
Disabled: opacity 0.3 / cursor not-allowed
```

### Accent — Yellow (Send quote)
```
Default:  background #FFE24B / color #0A0A0A / border 1.5px solid #0A0A0A
Hover:    background #F5CB00 / color #0A0A0A / border 1.5px solid #0A0A0A
Active:   background #D4AE00 / color #0A0A0A / scale(0.98)
Disabled: opacity 0.3 / cursor not-allowed
```

### Accent — Green (Mark as cleared)
```
Default:  background #4DFF91 / color #0A0A0A / border 1.5px solid #0A0A0A
Hover:    background #00D15A / color #0A0A0A / border 1.5px solid #0A0A0A
Active:   background #00A847 / color #0A0A0A / scale(0.98)
Disabled: opacity 0.3 / cursor not-allowed
```

### Accent — Magenta (In progress contexts)
```
Default:  background #FF659C / color #0A0A0A / border 1.5px solid #0A0A0A
Hover:    background #E8005A / color #FFFFFF / border 1.5px solid #E8005A
Active:   background #C40049 / color #FFFFFF / scale(0.98)
Disabled: opacity 0.3 / cursor not-allowed
```
Note: Magenta is the one CMY accent where hover switches text to white — because the darkened hover (#E8005A) is deep enough that black text fails contrast.

### FAB (floating action button)
Same spec as primary button. Apply identical interaction states.

### Small button variant
Same interaction states as above per variant type.
Height 36px / padding 0 16px / border-radius 12px / font 12px / 700.

---

## 2. New project form — corrections and additions

### Header
Remove "New project" text from the top bar centre.
Top bar should be: "×" close left / "Save" right only.
"Save" right: disabled state rgba(255,255,255,0.3) / enabled state #FFFFFF / 13px / 600.
No centre title needed — the form context is self-evident.

### Save / Create project button
Change from ghost/greyed appearance to full primary button style.
Background #0A0A0A / color #FFFFFF / border-radius 16px / height 48px / full width.
Disabled state: opacity 0.3 (not a ghost — still looks like a button).
Label: "Create project" when required fields are empty / "Save project" when editing existing.

### Add client email field
Insert below "Client name" field:

```
Label:        "Client email"
Type:         email input
Placeholder:  "e.g. hello@acmecorp.com"
Required:     No (optional)
Helper text:  "Used to pre-fill share sheet when sending quotes and invoices"
              11px / #7A8099 / below field
```

### Add categories field
Insert below "Project type" field:

```
Label:        "Categories"
Type:         Tag input (type and press enter/comma to add)
Placeholder:  "e.g. Brand identity, Motion..."
Max tags:     5
Required:     No (optional)
Chip style:   #F0F0F0 fill / 1.5px solid #C4C4C4 / #6B6B6B text / border-radius 16px
              11px / 600 / padding 4px 12px
Autocomplete: Pulls from user's previously used categories
Helper text:  "Max 5 · tap to remove"
              11px / #7A8099
```

### Due date — replace "Net" terminology
Change pill labels from "Net 7 / Net 14 / Net 30" to plain English:

```
"7 days"  /  "14 days"  /  "30 days"  /  "Custom"
```

Add helper text below the pill selector:
"Days after invoice is sent"
11px / #7A8099

### Add deposit field
Insert below "Quoted amount / Currency" row:

```
Label:        "Deposit"
Type:         percentage or amount toggle input
Placeholder:  "e.g. 50%"
Required:     No (optional)
Helper text:  "Shown on quote if applicable"
              11px / #7A8099
```

### Add contact person field
Insert below "Client email":

```
Label:        "Contact person"
Type:         text input
Placeholder:  "e.g. Sarah Johnson"
Required:     No (optional)
Helper text:  "If client is a company"
              11px / #7A8099
```

### Revised field order (top to bottom)
```
1. Client name*
2. Client email (optional)
3. Contact person (optional)
4. Project type*
5. Categories (optional, tag input)
6. Quoted amount + Currency (side by side)
7. Deposit (optional)
8. Start date
9. Due date (with plain English quick-pick pills)
10. Notes (optional)
[Create project button — full width, fixed bottom]
```

---

## 3. Invoice defaults screen — corrections

### Screen title
Keep "Invoice defaults" — correct and functional.

### Top bar right action
Change "Branding" shortcut link from muted grey text to a proper secondary button (small variant):
Background #F0F0F0 / #0A0A0A text / border 1.5px solid #0A0A0A / border-radius 12px / height 32px / padding 0 12px / 11px / 600.

### Section label corrections
Replace "Invoice fields" or similar with: "Your invoice details"
Section label style: 10px / 600 / uppercase / 0.08em tracking / #7A8099.

### Add business information section
Add a new section card at the TOP of the screen, above all existing sections:

```
Section label: "Your business"

Fields (field row style — label left, value right, editable inline):
  Your name          text / "e.g. Krishnachandran R."
  Business name      text / "e.g. Kaezee Designs"
  Email              email / "e.g. hello@kaezee.com"
  Address line 1     text / optional
  Address line 2     text / optional
  City               text / optional
  Postcode           text / optional
  Phone              text / optional

Helper text below section:
"This information appears on every invoice and quote you send."
11px / #7A8099
```

### Add invoice numbering section
Add a new section card after "Your business":

```
Section label: "Numbering"

Fields:
  Invoice prefix     text input / default "INV" / placeholder "INV"
                     Preview: "INV-001" shown inline in #7A8099 as user types
  Quote prefix       text input / default "QUO" / placeholder "QUO"
                     Preview: "QUO-001" shown inline
  Starting number    number input / default "1"
                     Helper: "Your next invoice will be [prefix]-[number]"
```

### Default due terms — replace Net terminology
Change "Net 7 / Net 14 / Net 30 / Custom" to:
"7 days / 14 days / 30 days / Custom"

Add helper text: "Days after invoice is sent" / 11px / #7A8099.

### Add quote defaults section
Add a new section card after payment defaults:

```
Section label: "Quote defaults"

Fields:
  Quote expiry       pill selector: "7 days / 14 days / 30 days / Custom"
                     Helper: "Days until quote expires"
  Default quote note textarea
                     Default value: "To proceed, reply to confirm and work begins immediately."
                     Helper: "Shown at the bottom of every quote you send"
```

### Revised section order (top to bottom)
```
1. Your business (NEW)
2. Numbering (NEW)
3. Rate card (existing)
4. Custom fields (existing)
5. Payment defaults (existing, Net → plain English)
6. Quote defaults (NEW)
[Save changes button — full width, primary, fixed bottom]
```

---

## 4. Category tags — final locked spec

Apply across all screens where category tags appear (project cards, project detail, new project form):

```
Background:    #F0F0F0
Border:        1.5px solid #C4C4C4
Border-radius: 16px
Padding:       4px 12px
Font:          11px / 600 / #6B6B6B
Max visible on card: 3
Overflow chip: "+N" — same style, #7A8099 text
```

Tags are NEVER coloured. Colour is reserved exclusively for status pills.

---

## 5. Status pill — confirm final spec

No changes to status pills. Confirming locked values:

```
All pills:
  Height:        27px (cards) / 32px (larger contexts)
  Border-radius: 16px
  Border:        1.5px solid #0A0A0A
  Font:          DM Sans / 12px / 700 / #0A0A0A
  Padding:       0 12px
  No dot icons. Text only.

Quoting     → #FFE24B
In progress → #FF659C
Invoiced    → #65F7FF
Cleared     → #4DFF91
Archived    → #E8E8E8
```

---

## 6. Swipe left actions — correct fill

Replace dark slate and red fills with neutral white. Colour moves to icon and label only:

```
Both action areas:
  Background:    #FFFFFF
  Border:        1px solid #E2E5EC (top, bottom, between actions)

Archive action:
  Icon + label:  #4B5563

Delete action:
  Icon + label:  #DC2626

Icon:  20px / outlined style
Label: 11px / 600
Min-width per action: 72px
```

---

## 7. Input field interaction states

Apply to all text inputs, textareas, selects, and date pickers:

```
Default:  background #FFFFFF / border 1px solid #E2E5EC / border-radius 8px / height 44px
Hover:    border 1px solid #C4C4C4
Focus:    border 1.5px solid #0A0A0A / no glow, no shadow — just the border darkens
Error:    border 1.5px solid #DC2626
Disabled: background #F5F6F8 / border 1px solid #E2E5EC / color #7A8099 / cursor not-allowed
Placeholder: color #C4C4C4
Label:    10px / 600 / uppercase / 0.08em tracking / #7A8099 / margin-bottom 6px
Helper:   11px / 400 / #7A8099 / margin-top 4px
Error msg: 11px / 400 / #DC2626 / margin-top 4px
```

---

## 8. Do not change

- Wordmark "Clear." with cyan period — correct
- Top bar black background — correct
- Surface colour #F5F6F8 — correct
- Card background #FFFFFF / border #E2E5EC — correct
- Status pill colours and spec — correct
- Pipeline stages (Quoting / In progress / Invoiced / Cleared) — correct
- Avatar bottom sheet structure — correct
- Swipe right status advance interaction — correct
- FAB positioning (centred, auto-width, fixed bottom) — correct
- DM Sans typeface — correct
- All typography scale values — correct
- Two-tab navigation (Active / Cleared) — correct
- Search bar sticky below top bar — correct