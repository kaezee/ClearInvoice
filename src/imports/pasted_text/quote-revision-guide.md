# Clear — Corrective Prompt v5
## Revise quote · Delete vs Archive · Tax · Multiple contacts · Quote versioning

---

## 1. Revise quote

### When available
Only on QUOTE · SENT state. Not on Draft, Accepted, or Expired.

### Button placement
In the QUOTE · SENT section, above "Send to client →":

```
"Revise quote →"
Secondary button spec:
  Background:     #F0F0F0
  Border:         1.5px solid #0A0A0A
  Text:           #0A0A0A / DM Sans 14px / 600
  Border-radius:  16px
  Height:         48px
  Width:          full width
  Hover:          #D4D4D4
  Press:          #BEBEBE / scale(0.98)
```

### What happens on tap
- Generates a new quote DRAFT
- Pre-filled with same line items as original sent quote
- New quote number: QUO-002 (increments from last)
- Previous quote (QUO-001) marked as superseded
- Context line updates to: "Revising QUO-001 — send when ready"
  11px / 400 / #7A8099

### Superseded quote display
Previous sent quote collapses to a compact row above the new draft:

```
Row:
  Background:    #F5F6F8
  Border-radius: 8px
  Padding:       10px 14px
  Height:        44px
  Layout:        flex / space-between

  Left:  "QUO-001 · Superseded" 
         12px / 400 / #C4C4C4
  Right: "View →" link
         11px / 500 / #7A8099
         Tap: expands to show full superseded quote (read only)
```

---

## 2. Delete vs Archive — copy and button changes

### Swipe left reveal — add sub-labels

Below each action label on the swipe reveal:

```
Archive action:
  Icon:      archive box / #4B5563 / 20px
  Label:     "Archive" / 11px / 600 / #4B5563
  Sub-label: "Restore anytime" / 9px / 400 / #7A8099

Delete action:
  Icon:      trash / #DC2626 / 20px
  Label:     "Delete" / 11px / 600 / #DC2626
  Sub-label: "Gone forever" / 9px / 400 / #DC2626
```

### Delete confirmation modal — full redesign

Replace current modal (image shows generic "Delete this project?" with two equal buttons):

```
Modal container:
  Background:     #FFFFFF
  Border-radius:  16px
  Padding:        24px 20px 20px
  Max-width:      320px

Icon block (top centre):
  Circle: 52×52px / #FEF2F2 background / border-radius 50%
  Trash icon: 22px / #DC2626 / centred
  Margin-bottom: 16px

Title:
  "Delete [client name]?"
  17px / 600 / #0A0A0A / centred
  Margin-bottom: 8px

Body:
  "This project and all its documents will be 
   permanently deleted. This cannot be undone."
  13px / 400 / #7A8099 / centred / line-height 1.6
  Margin-bottom: 24px

Primary button — "Delete forever":
  Background:     #DC2626
  Text:           #FFFFFF / 14px / 600
  Border:         1.5px solid #DC2626
  Border-radius:  16px
  Height:         48px
  Width:          full width
  Hover:          #B91C1C
  Press:          #991B1B / scale(0.98)
  Margin-bottom:  10px

Secondary button — "Archive instead":
  Background:     #F0F0F0
  Text:           #0A0A0A / 14px / 600
  Border:         1.5px solid #0A0A0A
  Border-radius:  16px
  Height:         48px
  Width:          full width
  Hover:          #D4D4D4
  Margin-bottom:  10px

Cancel link:
  "Cancel"
  13px / 400 / #7A8099 / centred
  Ghost hover: #F0F0F0 pill bg / border-radius 8px
  No border / no fill

× close button top right:
  Light context spec: 16px / #0A0A0A / #F5F6F8 hover
```

### Archive confirmation modal

```
Icon block:
  Circle: 52×52px / #F5F6F8 background
  Archive icon: 22px / #4B5563 / centred

Title: "Archive [client name]?"
Body:  "Hidden from your active list. 
        Restore it anytime from your profile."
13px / 400 / #7A8099 / centred

Single button: "Archive"
  Primary black spec
  Background: #0A0A0A / white text / border-radius 16px / height 48px

Cancel link below: "Cancel" / 13px / #7A8099
```

---

## 3. Tax

### Where it lives
Tax is a per-invoice field. Configured in Invoice setup as a default, overridable per invoice.

### Invoice setup — add tax defaults section
Add to Invoice setup screen after Payment defaults:

```
Section label: "TAX"

Toggle row:
  Label left:  "Add tax to invoices"
  Toggle right: off by default
  When off: fields below hidden
  When on: fields appear

Tax label field (when toggle on):
  Label:       "Tax name"
  Input:       text / placeholder "e.g. VAT, GST, Tax"
  Helper:      "Shown on invoice as: [Tax name] 20%"
               11px / #7A8099 / updates live as user types

Tax rate field:
  Label:       "Rate"
  Input:       numeric / placeholder "0" / suffix "%"
  Width:       120px

Preview row (shows when both filled):
  "Tax name  20%        £1,600"
  12px / #7A8099 / right-aligned amount
  This is what appears on the invoice
```

### Invoice section — tax display

When tax is enabled (from Invoice setup defaults or per-invoice toggle):

```
Appears between last line item and the total divider:

Tax row:
  Layout: flex / space-between
  Label left:  "[Tax name] [rate]%"  e.g. "VAT 20%"
               13px / 400 / #7A8099
  Amount right: calculated tax amount
               13px / 500 / #0A0A0A
  Border-bottom: 1px solid #E2E5EC

Total row (with tax):
  "Total (inc. [Tax name])"  left  /  full amount right
  Same total row spec but label updated

Subtotal row (appears above tax when tax enabled):
  "Subtotal"  left  /  pre-tax amount right
  13px / 400 / #7A8099 / border-bottom 1px solid #E2E5EC
```

### Per-invoice tax toggle

In invoice draft, below line items, above total:

```
Small toggle row:
  Label: "Add tax"
  Toggle: on/off
  When on: shows tax label + rate (pre-filled from defaults)
           Both editable per invoice
  When off: no tax line shown
  
  If no default set in Invoice setup:
    Toggle off, tapping shows:
    "Set up tax in Invoice setup first →"
    11px / #7A8099 / tappable link
```

### Client-facing page — tax display
Same as invoice section. Shows subtotal + tax line + total inc. tax.

---

## 4. Multiple contacts

### The decision
Multiple contacts per project — for when a client company has more than one person involved (e.g. Creative Director + Finance contact).

### Where it lives
In the project details and edit project form. Not a separate screen.

### New project form — contacts section

Replace single "Contact person" field with:

```
"CONTACTS" section label

Primary contact row (always shown):
  "Contact name"    text input
  "Contact email"   email input
  These are the main recipient for quotes and invoices

"+ Add another contact" — ghost text button
  13px / 500 / #7A8099
  Tap: adds a second contact row

Additional contact row (when added):
  "Contact name"    text input
  "Contact email"   email input
  × remove right    (removes this contact row)
  
Max contacts: 3 (primary + 2 additional)
When max reached: hide "+ Add another contact"
Helper: "Max 3 contacts" / 10px / #C4C4C4

Each additional contact row:
  Same field spec as primary
  × remove: 20px / #C4C4C4 / hover #DC2626
```

### Project detail — contacts display

In PROJECT DETAILS card:

```
If 1 contact:
  "Client"    [name row]    right aligned
  "Email"     [email row]   right aligned

If 2+ contacts:
  "Contacts"  section sub-label / 11px / #7A8099
  
  Each contact as a compact row:
    Name: 13px / 500 / #0A0A0A
    Email: 11px / 400 / #7A8099 (below name)
    Divider between contacts: 1px solid #E2E5EC
```

### Invoice/quote — multiple recipients

When invoice or quote is sent with multiple contacts:

```
"Send to client →" action:
  Native share sheet opens with all contact emails
  pre-populated if email is set
  
  Or: copy link — same link works for all contacts
  
Client block on document:
  Shows primary contact name only
  "Additional contacts: [name], [name]" below in muted text
  11px / 400 / #7A8099
```

---

## 5. Quote versioning — status and number indicators

### Quote number format
All quote numbers: QUO-001, QUO-002 format
No date embedded. Ever.

### Status modifiers on section label

```
QUOTE · DRAFT
QUOTE · SENT
QUOTE · REVISED    ← new — when QUO-002 draft exists after QUO-001 sent
QUOTE · ACCEPTED
QUOTE · EXPIRED
```

"REVISED" in C.amberText — signals something needs sending.

### Version history in project detail

When multiple quote versions exist, show a compact version history above the active document:

```
Version history row (collapsed by default):
  "2 versions · QUO-001 superseded"
  11px / 400 / #7A8099
  Tap: expands to show version list

Expanded version list:
  QUO-002  DRAFT (current)      → shown as active document below
  QUO-001  Superseded · Sent 14 Mar   → tap "View →" to see read-only

Each version row:
  Height: 40px
  Number left: 12px / 500 / #0A0A0A
  Status right: 11px / 400 / #7A8099
  "View →" far right (for non-active versions): 11px / #7A8099
  Border-bottom: 1px solid #E2E5EC
```

### Invoice versioning

Same pattern if user edits and resends an invoice:

```
INV-001  Superseded · Sent 6 Mar
INV-001  Current · Sent 14 Mar (resent)
```

Note: Resending does NOT generate a new number — INV-001 stays INV-001.
Only revised quotes generate new numbers (QUO-002).
Invoices keep their number through resends.

### Card modifier text — revised quote state

On project card when QUOTE · REVISED:

```
Modifier text: "Quote revised · not sent"
Colour: C.amberText (#7A5000)
Signals: user has a new draft ready to send
```

---

## Do not change

- Invoice/quote line item visibility rules (covered in separate prompt)
- Status pill colours and spec
- Any other screens not mentioned above
- Token values — use C.* and T.* references throughout