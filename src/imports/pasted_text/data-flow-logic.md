# Clear — Logic, Connections & Data Flow
## For Figma Make prototype verification and Cursor implementation

This document defines what is connected to what, what updates when something changes, and what is locked under which conditions. Use this to verify prototype logic in Figma Make and as the implementation spec for Cursor.

---

## Source of truth hierarchy

```
Rate card (Invoice setup)
  ↓ feeds into
New Project form (service selection + default prices)
  ↓ creates
Project record (services + quoted amount)
  ↓ feeds into
Quote document (line items + total)
  ↓ if approved, feeds into
Invoice document (line items + total)
  ↓ if paid, creates
Cleared record (final amount + paid date)
```

Each level can be edited independently — but only within the rules below.

---

## Rate card → Project form

### What connects:
Rate card items in Invoice setup appear as selectable chips in the Services field of New Project and Edit Project forms.

### Rules:
```
Adding a new service to rate card:
  → Appears as a chip in Services field on next project creation
  → Does NOT retroactively update existing projects

Editing a rate card item price:
  → Updates the default price shown in the chip
  → Does NOT update any existing project's service prices
  → Each project stores its own price at time of creation

Deleting a rate card item:
  → Removes chip from future project forms
  → Does NOT affect existing projects that used that service
  → Existing projects keep their own copy of the service + price
```

---

## Services field → Project record

### What connects:
Selected services in the form become the project's line items.
These line items feed directly into the quote and invoice.

### Rules:
```
Adding a service to a project:
  → Service added to project's line items
  → Quoted amount updates to sum of all service prices
  → If no quote sent yet: quote line items update automatically
  → If quote already sent: see "Quote sent" rules below

Removing a service from a project:
  → If no quote sent: removed from line items, total updates
  → If quote sent: warning shown, cannot remove without consequence
    "This item is on a sent quote. Removing it won't 
     update the sent quote."
  → User must resend quote after making changes

Editing a service price in a project:
  → Updates that project's line item price only
  → Does NOT update rate card
  → Quoted amount recalculates automatically
  → If no quote sent: quote total updates automatically
  → If quote sent: see "Quote sent" rules below
```

---

## Project status → what is editable

### QUOTING status

```
Project fields editable:    ALL
  Client name               ✓ editable
  Client email              ✓ editable
  Contact person            ✓ editable
  Services                  ✓ add / remove / edit prices
  Quoted amount             ✓ auto-calculated from services
                              or manually overridable
  Currency                  ✓ editable
  Deposit                   ✓ editable
  Start date                ✓ editable
  Due date                  ✓ editable
  Notes                     ✓ editable

Quote document:
  Not yet generated:        no quote exists yet
  Draft (generated, not sent): fully editable
  Sent:                     LOCKED — see quote sent rules
```

### IN PROGRESS status

```
Project fields editable:    MOST
  Client name               ✓ editable
  Client email              ✓ editable
  Contact person            ✓ editable
  Services                  ✓ add / remove / edit prices
                              (scope can change mid-project)
  Quoted amount             ✓ auto-recalculates from services
  Currency                  ✗ LOCKED (set at project start)
  Deposit                   ✗ LOCKED (agreed at quoting)
  Start date                ✗ LOCKED (project already started)
  Due date                  ✓ editable (deadline can shift)
  Notes                     ✓ editable

Quote document:
  If sent: LOCKED
  If not sent: editable
  
Invoice document:
  Not yet generated: not available
```

### INVOICED status

```
Project fields editable:    LIMITED
  Client name               ✓ editable
  Client email              ✓ editable
  Contact person            ✓ editable
  Services                  ✓ add only (scope expansion)
                            ✗ cannot remove sent line items
                            ✓ can edit price with warning
  Quoted amount             ✗ LOCKED (invoice sent)
  Currency                  ✗ LOCKED
  Deposit                   ✗ LOCKED
  Start date                ✗ LOCKED
  Due date                  ✗ LOCKED (on the invoice)
  Notes                     ✓ editable

Invoice document:
  Draft (generated, not sent): fully editable
  Sent:                     LOCKED — see invoice sent rules
```

### CLEARED status

```
ALL fields:                 ✗ LOCKED — read only
No edit button shown
No swipe interactions
Permanent record
```

---

## Quote document logic

### Quote states and what changes when:

```
State: NOT GENERATED
  Line items: pulled from project services automatically
  Total: sum of service prices
  User action: tap "Generate quote" to create draft

State: DRAFT (generated, not sent)
  Fully editable:
    Line items (add / remove / edit descriptions and prices)
    Quote number (auto-assigned, editable)
    Expiry date
    Payment terms / notes
    Client details (pre-filled from project)
  Total: auto-calculates from line items
  
  Changes to project services:
    → Sync to quote draft automatically
    → User sees updated total in quote
  
  User action: tap "Send quote →" to move to Sent state

State: SENT (link shared with client)
  LOCKED — the following cannot change:
    Line items (descriptions and prices)
    Total amount
    Quote number
    Expiry date
  
  STILL EDITABLE:
    Payment notes / terms
    Client contact details (email, contact person)
  
  Changes to project services AFTER quote sent:
    → Do NOT sync to sent quote
    → Warning shown: "This quote has already been sent. 
       Changes won't update the sent quote."
    → Option shown: "Resend updated quote →"
      Tapping generates a new quote draft with updated line items
      New quote gets incremented number (QUO-002 if QUO-001 was sent)
      User must send the new draft
  
  Client opens link:
    → viewed_at timestamp set in Supabase
    → "Viewed Xh ago" appears on project card modifier text
    → Realtime update — no refresh needed
  
  Quote expiry reached:
    → Status modifier shows "Expired Xd ago"
    → No automatic status change — user decides next action
  
  Client accepts (manual — user marks it):
    → Project moves to IN PROGRESS
    → Quote moves to ACCEPTED state (read only)
    → Invoice section unlocks (but shows empty until generated)

State: ACCEPTED
  Read only — permanent record
  Shows on project detail as accepted quote summary
  No editing possible
```

---

## Invoice document logic

### Invoice states and what changes when:

```
State: NOT GENERATED
  Only available when project is INVOICED status
  Line items: pulled from project services automatically
  Total: sum of service prices (same as approved quote amount)

State: DRAFT (generated, not sent)
  Fully editable:
    Line items (add / remove / edit)
    Invoice number (auto-assigned from user's sequence, editable)
    Due date (pre-filled from project due date)
    Tax label and rate
    Payment notes (pre-filled from Invoice setup defaults)
    Custom fields (pre-filled from Invoice setup defaults)
    Client details
  Total: auto-calculates from line items + tax
  
  Changes to project services in INVOICED state:
    → Sync to invoice draft automatically
    → Warning if adding items: 
      "Adding this will update your invoice draft"
  
  User action: tap "Send invoice →" to move to Sent state

State: SENT (link shared with client)
  LOCKED — the following cannot change:
    Line items (descriptions and prices)
    Total amount
    Invoice number
    Due date
  
  STILL EDITABLE:
    Payment notes / bank details
    Client contact details
  
  Client opens link:
    → viewed_at timestamp set in Supabase
    → view_count incremented
    → "Viewed Xh ago" on project card — Realtime update
  
  Due date passes without payment:
    → Overdue modifier appears on card
    → Left border changes to 3px solid #FFE24B
    → Two sub-states:
      Not viewed: "Not viewed · Xd overdue" (#7A5000)
      Viewed:     "Viewed · Xd overdue" (#7A5000)
  
  User sends reminder:
    → reminded_at timestamp set
    → Modifier: "Reminder sent Xd ago" (#7A8099)
  
  User marks as cleared:
    → Confirmation modal: "Mark as cleared?"
    → On confirm: paid_at timestamp set
    → Project moves to CLEARED status
    → Invoice moves to CLEARED state (read only)
    → Project card moves to Cleared tab

State: CLEARED
  Read only — permanent record
  Shows paid date
  No editing possible
  No resend possible
```

---

## Quoted amount logic

```
Quoted amount = sum of all selected service prices

Auto-calculates when:
  Service added to project → total increases
  Service removed → total decreases
  Service price edited → total recalculates

Manual override:
  User can tap quoted amount field and type a custom total
  This overrides the auto-calculation
  Indicator shown: "Custom amount — differs from service total"
  11px / #7A5000
  "Reset to service total" link shown: 11px / #7A8099

After quote sent:
  Quoted amount LOCKED
  Cannot be changed without resending quote

After invoice sent:
  Invoice total LOCKED
  Cannot be changed
```

---

## Invoice number sequence logic

```
Sequence stored on user record in Supabase
invoice_sequence: int (starts at 1, never resets)

Invoice number format: [prefix]-[padded number]
  Default: INV-001, INV-002, INV-003...
  Custom prefix: KD-001, KD-002...

Number assigned: when invoice moves from DRAFT to SENT
  (not when draft is created — avoids gaps from abandoned drafts)

Quote number format: [prefix]-[padded number]
  Default: QUO-001, QUO-002...
  Separate sequence from invoices

If user resends updated quote:
  New quote gets next quote number
  Old sent quote number is retired
  Shows on project detail: "QUO-001 (superseded)" / "QUO-002 (active)"
```

---

## Client-facing link logic

```
Quote link:   clear.app/q/[quote-uuid]
Invoice link: clear.app/i/[invoice-uuid]

Link generated: when document moves to SENT state
UUID = Supabase record ID (unguessable)

On client opening link:
  Edge function fires (public, no auth)
  First open: sets viewed_at timestamp
  Every open: increments view_count
  Triggers Supabase Realtime update to freelancer's app
  "Viewed Xh ago" appears on project card instantly

Link remains valid:
  Quote link: valid until project archived or deleted
  Invoice link: valid until project archived or deleted
  Cleared invoices: link still works, shows "This invoice has been paid" banner

Link sharing:
  "Send quote →" / "Send invoice →" buttons:
    Copy link to clipboard
    Native share sheet opens (WhatsApp, email, Messages etc)
    Toast: "Link copied — share with your client"
```

---

## Reminder logic

```
Reminder available: when invoice is SENT and overdue
  (due date has passed, paid_at is null)

Tapping "Send reminder":
  Sets reminded_at timestamp
  Native share sheet opens with pre-written message:
  "Hi [client name], just a reminder that invoice [INV-00X] 
   for [total] was due on [due date]. 
   You can view it here: [link]"
  User can edit before sending
  
  After sending:
    reminded_at updated
    Modifier: "Reminder sent today" → "Reminder sent Xd ago"

Can send multiple reminders:
  Each tap updates reminded_at to current time
  No limit on reminders
```

---

## Project deletion and archiving logic

```
ARCHIVE (available on Active projects only):
  Project moves to Archived screen
  All associated quotes and invoices: read only
  Client links remain valid but show archived state
  Restorable: swipe left → Restore → moves back to In Progress
  Archived projects do not count in Active tab badge

DELETE (available on Active and Archived projects):
  Confirmation required: "Delete this project? This can't be undone."
  Permanently removes project and all associated documents
  Client links become invalid (404 page)
  Cannot be undone

CLEARED projects:
  Cannot be archived
  Cannot be deleted
  Permanent record forever
  Read only
```

---

## Onboarding → app data connections

```
Onboarding O3 (persona selection):
  Stores user.persona in Supabase
  Affects: (v1 = stored only, used in v2 for personalisation)

Onboarding O4 (basic details):
  Stores: user.name, user.business_name, user.default_currency
  These pre-fill:
    Invoice setup → Your business section
    Invoice header (name + business name)
    Avatar initial (first letter of name)
    Avatar background (#FFE24B always)

Invoice setup → Your business:
  Stores all business details
  These appear on every quote and invoice sent
  Changes take effect on next generated document
  Does NOT update already-sent documents
```

---

## Invoice setup → quote/invoice connections

```
Default due terms:
  Pre-fills due date in new project form
  User can override per project

Default currency:
  Pre-fills currency in new project form
  User can override per project

Payment notes:
  Pre-fills payment notes section in invoice draft
  User can edit per invoice

Rate card:
  Feeds chips in Services field
  Prices are defaults — overridable per project

Custom fields (VAT number, bank details etc):
  Appear on every invoice and quote automatically
  User can remove per document if needed

Invoice prefix / Quote prefix:
  Applied to all new documents
  Changing prefix: affects future documents only
  Old documents keep their original numbers

Logo + brand colour + template:
  Applied to client-facing pages
  Changing these: affects all future sent documents
  Already-sent documents: still show old style
  (links render current settings at time of viewing — 
   actually updates immediately since rendered server-side)
  Note for Cursor: decide whether to snapshot style at send 
  time or always render current — recommend snapshot for consistency
```

---

## Summary: what triggers what

```
ACTION                           TRIGGERS
─────────────────────────────────────────────────────────
Add service to project      →    Quoted amount recalculates
                                 Draft quote/invoice updates
                                 
Edit service price           →   Quoted amount recalculates
                                 Draft quote/invoice updates
                                 Warning if sent document exists

Remove service               →   Quoted amount recalculates
                                 Warning if on sent document
                                 
Send quote →                 →   Quote LOCKED
                                 viewed_at tracking starts
                                 Modifier: "Sent · not viewed"
                                 
Client opens quote link      →   viewed_at set (first open)
                                 view_count incremented
                                 Realtime: "Viewed Xh ago"
                                 
Mark quote accepted          →   Project → IN PROGRESS
                                 Quote → ACCEPTED (locked)
                                 
Generate invoice             →   Invoice DRAFT created
                                 Line items from project services
                                 
Send invoice →               →   Invoice LOCKED
                                 Invoice number assigned
                                 viewed_at tracking starts
                                 Modifier: "Sent · not viewed"
                                 
Client opens invoice link    →   viewed_at set (first open)
                                 view_count incremented
                                 Realtime: "Viewed Xh ago"
                                 
Due date passes              →   Overdue modifier appears
                                 Left border #FFE24B on card
                                 
Send reminder                →   reminded_at updated
                                 Pre-written message in share sheet
                                 
Mark as cleared →            →   Confirmation modal
                                 paid_at set
                                 Project → CLEARED status
                                 Project card → Cleared tab
                                 Invoice → CLEARED (locked)
                                 
Archive project              →   Project → Archived screen
                                 All docs read only
                                 
Delete project               →   Permanent deletion
                                 All links invalidated
                                 
Edit rate card item          →   Future project chips updated
                                 Existing projects unaffected
                                 
Edit Invoice setup details   →   Future documents updated
                                 Sent documents unaffected
                                 (logo/style: renders current — see note)
```

---

## Edge cases to handle

```
1. User sends quote, then edits service prices
   → Warning: "Quote already sent. Changes won't update it."
   → Option: "Resend updated quote →"

2. User generates invoice with different amount than quote
   → Warning: "Invoice total differs from quoted amount"
   → Allow: scope may have changed
   → Show both amounts on invoice: "Quoted: £4,800 / Invoiced: £5,200"

3. User tries to send invoice before quote is accepted
   → Allow (not all projects start with a quote)
   → No warning needed — quote is optional

4. Two projects for same client
   → No conflict — each project is independent
   → Same client name just appears on multiple cards

5. Currency mismatch (project in GBP, rate card in USD)
   → Project currency takes precedence for that project
   → Rate card prices shown with project currency symbol
   → User should edit price manually if currencies differ

6. User deletes a rate card item that's used in active projects
   → Rate card item removed from future forms
   → Existing projects keep their own copy — unaffected
   → No warning needed

7. Invoice number gap (draft created, abandoned, new draft)
   → Numbers only assigned at send time — no gaps
   → Abandoned drafts never get a number

8. User marks cleared but payment hasn't arrived
   → No way to un-clear in v1
   → Solution: manual discipline
   → V2: "Unmark as cleared" with reason field

9. Client opens invoice link after marked cleared
   → Shows invoice normally with "This invoice has been paid" 
     banner at top (cyan / #E6FBFC)

10. User has no rate card set up when creating first project
    → Services field shows empty state:
      "No services in your rate card yet."
      "Set up rate card →" link
    → Custom service still available
    → Prompt to set up rate card during/after first project
```