# Clear — Client-Facing Pages Prompt

This prompt covers two public-facing screens: the client quote view and the client invoice view. These are separate from the main Clear app. No login required. No Clear account needed. Renders from Supabase by ID on a public Vercel/Next.js route.

This prompt also corrects and documents the complete project pipeline, quote states, and invoice states for use across both the main app and these client pages.

---

## Core principle

The client never touches Clear. They receive a link. They open a browser. They see a clean, professional document that looks like it came from the freelancer — not from a generic tool. Clear's branding appears only as a small unobtrusive footer credit.

---

## Routes

```
Quote view:    clear.app/q/[quote-id]
Invoice view:  clear.app/i/[invoice-id]

Both routes:
  Public — no authentication required
  Server-side rendered via Next.js + Supabase
  ID is the Supabase UUID of the quote/invoice record
  UUID is unguessable — no additional token needed
  View tracking fires on page load via Supabase edge function
```

---

## Complete project pipeline — corrected and final

```
QUOTING
  Work not started. Freelancer is in early conversations with client.
  A quote document can be generated and sent from this stage.
  Quote is a proposed price — not yet agreed.
  Project stays here until freelancer manually marks quote as accepted.

  ↓ (freelancer taps "Mark quote accepted" after client confirms)

IN PROGRESS
  Quote approved. Price is locked. Work is happening.
  No invoice yet — work isn't done.
  Project stays here until work is complete.

  ↓ (freelancer taps "Generate invoice" when work is done)

INVOICED
  Work complete. Invoice generated (starts as Draft).
  Freelancer edits if needed, then taps "Send invoice".
  Link is shared with client.
  Waiting for payment.
  Project stays here until payment received.

  ↓ (freelancer taps "Mark as cleared" after payment received)

CLEARED
  Payment received. Project complete.
  Moves to Cleared tab. Read-only. No further actions.

ARCHIVED (side branch, available from any active stage)
  Project abandoned, cancelled, or no longer active.
  Accessible via swipe left → Archive action.
  Read-only. Restorable to In Progress via swipe left → Restore.
```

---

## Quote states — complete

```
DRAFT
  Quote created but not sent.
  Freelancer is editing line items and terms.
  Not visible to client yet.
  Card modifier: "Draft · not sent" → #7A8099

SENT
  Quote link shared with client.
  Client has not opened it yet.
  viewed_at is null.
  Card modifier: "Sent · not viewed" → #7A8099

VIEWED
  Client opened the quote link.
  viewed_at is set. Expiry date not passed.
  Card modifier: "Viewed Xh ago" → #00A3B5 (dark cyan)

EXPIRED
  Expiry date passed. Client has not responded.
  Card modifier: "Expired Xd ago" → #7A5000 amber
  Left border accent: 1.5px solid #C4C4C4

ACCEPTED
  Freelancer manually marks as accepted after client confirms
  (via WhatsApp, email, call — any channel).
  Triggers project move to In Progress.
  This is ALWAYS manual in v1 — no client-side accept button yet.

DECLINED
  Freelancer manually marks as declined.
  Project can be archived from here.
```

**Quote modifier text on card (right column):**
```
Draft       → "Draft · not sent"        #7A8099
Sent        → "Sent · not viewed"       #7A8099
Viewed      → "Viewed Xh ago"           #00A3B5
Expired     → "Expired Xd ago"          #7A5000
Accepted    → moves to In Progress      (no longer shown in Quoting)
Declined    → "Declined"                #7A8099
```

---

## Invoice states — complete

```
DRAFT
  Invoice generated but not sent yet.
  Freelancer is reviewing/editing line items.
  Not visible to client.
  Card modifier: "Draft · not sent" → #7A8099

SENT
  Invoice link shared with client.
  Client has not opened it yet.
  sent_at is set. viewed_at is null.
  Card modifier: "Sent · not viewed" → #7A8099

VIEWED
  Client opened the invoice link.
  viewed_at is set. Due date not passed.
  Card modifier: "Viewed Xh ago" → #00A3B5 (dark cyan)

OVERDUE — NOT VIEWED
  Due date passed. Client has never opened the link.
  Most urgent state — they may not know it exists.
  Card modifier: "Not viewed · Xd overdue" → #7A5000
  Card left border: 3px solid #FFE24B

OVERDUE — VIEWED
  Due date passed. Client has opened the link.
  They've seen it and still not paid.
  Card modifier: "Viewed · Xd overdue" → #7A5000
  Card left border: 3px solid #FFE24B

REMINDED
  Freelancer sent a follow-up reminder.
  reminded_at is set.
  Card modifier: "Reminder sent Xd ago" → #7A8099

CLEARED
  Freelancer manually marks as paid after payment received.
  paid_at is set. Project moves to Cleared tab.
  Card modifier: "Paid 12 Mar" → #1A7A3A (dark green)
```

**Invoice modifier text on card (right column):**
```
Draft               → "Draft · not sent"          #7A8099
Sent, not viewed    → "Sent · not viewed"          #7A8099
Viewed              → "Viewed Xh ago"              #00A3B5
Overdue not viewed  → "Not viewed · Xd overdue"   #7A5000
Overdue viewed      → "Viewed · Xd overdue"       #7A5000
Reminded            → "Reminder sent Xd ago"       #7A8099
Cleared             → "Paid 12 Mar"                #1A7A3A
```

---

## Supabase state tracking

```
Invoice/quote state is derived from timestamps — no separate status field:

sent_at       → null = Draft / set = Sent or beyond
viewed_at     → null = not viewed / set = Viewed or beyond
due_date      → compared to today = Overdue if passed and paid_at null
reminded_at   → null = not reminded / set = Reminded
paid_at       → null = unpaid / set = Cleared

View tracking:
  Client opens link → edge function fires
  Sets viewed_at (first open only)
  Increments view_count (every open)
  Freelancer's app receives update via Supabase Realtime subscription
  "Viewed Xh ago" appears on card instantly, no refresh
```

---

## Client-facing page spec

### Shared elements (both quote and invoice views)

**Status bar (top of page):**
```
Height:         36px
Display:        flex / align-items center / justify-content center / gap 6px
Font:           11px / 600 / #0A0A0A

Quote bar:      background #FFFBE6 / border-bottom 1px solid #FFE24B
                "Quote · expires [date]"
                Dot: 6px circle / #FFE24B fill / 1px #0A0A0A border

Invoice bar:    background #E6FBFC / border-bottom 1px solid #65F7FF
                "Invoice · due [date]"
                Dot: 6px circle / #65F7FF fill / 1px #0A0A0A border

Overdue bar:    background #FFFBE6 / border-bottom 1px solid #FFE24B
                "Invoice · Xd overdue"
                Dot: #FFE24B
```

**Page container:**
```
Max-width:      480px
Margin:         0 auto
Background:     #FFFFFF
Min-height:     100vh
Font:           DM Sans
```

**Footer:**
```
Padding:        16px
Text-align:     center
Border-top:     1px solid #E2E5EC
"Sent with Clear" → 11px / 400 / #C4C4C4
No logo, no upsell, no signup CTA — text only
```

---

### Template: Classic

```
Header strip:
  Background:   #0A0A0A
  Padding:      20px

  Left side:
    Logo: 40×40px / border-radius 8px
          If uploaded: user's logo image
          If not: initials box / rgba(255,255,255,0.15) bg / white text / 14px / 700
    Business name: 13px / 400 / rgba(255,255,255,0.6) / margin-top 4px

  Right side:
    Document type: "Quote" or "Invoice" / 13px / 600 / rgba(255,255,255,0.6)
    Number: "#QUO-003" or "#INV-008" / 11px / 400 / rgba(255,255,255,0.4) / monospace
    Total amount: 24px / 700 / #FFFFFF / margin-top 8px
    Label: "Total" or "Total due" / 10px / rgba(255,255,255,0.4)
```

### Template: Branded

```
Header strip:
  Background:   User's brand colour (from branding settings)
  Padding:      20px

  Same layout as Classic.
  Text colours:
    On light brand colours: #0A0A0A text
    On dark brand colours:  #FFFFFF text
    (determined by luminance of brand colour — if luminance > 0.5 use black text)

  Logo box (if no logo): rgba(0,0,0,0.15) bg
```

### Template: Minimal

```
Header:
  Background:   #FFFFFF
  Padding:      20px 20px 0
  Border-bottom: 3px solid #0A0A0A
  Padding-bottom: 16px

  Left side:
    Logo: same as above, but dark variant
          Initials box: #F0F0F0 bg / #0A0A0A text
    Business name: 13px / 400 / #7A8099

  Right side:
    Document type: 13px / 600 / #0A0A0A
    Number: 11px / #7A8099 / monospace
    Total: 24px / 700 / #0A0A0A
    Label: 10px / #7A8099
```

---

### Document body (all templates share this)

```
Padding: 20px

Bill to / Prepared for block:
  Label:  10px / 600 / uppercase / 0.08em tracking / #7A8099
          "Bill to" (invoice) or "Prepared for" (quote)
  Name:   15px / 600 / #0A0A0A
  Margin-bottom: 16px

Divider: 1px solid #E2E5EC

Line items:
  Each row: flex / justify-content space-between / padding 8px 0
  Border-bottom: 1px solid #E2E5EC (last row no border)
  Description: 13px / 400 / #0A0A0A
  Amount:      13px / 600 / #0A0A0A

  If qty > 1: show "Description × qty" on description side
              Unit rate in muted below: 11px / #7A8099

Tax row (if applicable):
  Label: "VAT (20%)" or user's custom tax label / 13px / #7A8099
  Amount: 13px / #7A8099
  Border-bottom: 1px solid #E2E5EC

Total row:
  Border-top: 2px solid #0A0A0A / margin-top 4px / padding-top 12px
  "Total" or "Total due": 14px / 700 / #0A0A0A
  Amount: 20px / 700 / #0A0A0A

Due date / expiry block:
  Background: #F5F6F8
  Border-radius: 8px
  Padding: 10px 14px
  Display: flex / justify-content space-between
  Label: 11px / #7A8099
  Value: 12px / 600 / #0A0A0A
  Margin-top: 16px

Payment details block (invoice only):
  Section label: 10px / 600 / uppercase / #7A8099 / margin-bottom 6px
  Content: 13px / 400 / #0A0A0A / line-height 1.6
  (Bank details, preferred payment method, PayPal etc)
  Margin-top: 16px

To proceed block (quote only):
  Section label: 10px / 600 / uppercase / #7A8099 / margin-bottom 6px
  Content: 13px / 400 / #0A0A0A / line-height 1.6
  Default text: "Reply to confirm and work begins immediately."
  User can customise this in invoice defaults → quote notes field
  Margin-top: 16px

Custom fields block (if any):
  Each field: flex / space-between
  Label: 13px / #7A8099
  Value: 13px / 500 / #0A0A0A
  Border-bottom: 1px solid #E2E5EC
  Margin-top: 16px
```

---

## Quote vs invoice page differences

```
                    QUOTE PAGE          INVOICE PAGE
Route               /q/[id]             /i/[id]
Status bar          Yellow              Cyan (or amber if overdue)
Document heading    "Quote"             "Invoice"
Number format       #QUO-XXX            #INV-XXX
Date label          "Expires"           "Due date"
Recipient label     "Prepared for"      "Bill to"
Payment details     Hidden              Visible
To proceed block    Visible             Hidden
Accept button       NOT in v1           N/A
Action available    None                None (client reads only)
View tracking       Yes                 Yes
```

---

## What the client cannot do (v1)

```
- Accept a quote (manual process — freelancer marks accepted)
- Pay through the page (no payment integration in v1)
- Comment or message
- Download PDF directly (browser print-to-PDF is available)
- Create a Clear account from this page
- See any other invoices or quotes
```

---

## Responsiveness

```
Mobile (default):
  Full-width, single column, 16px horizontal padding

Tablet/desktop:
  Max-width 480px, centred, white card on #F5F6F8 background
  Card gets subtle border: 1px solid #E2E5EC / border-radius 12px
  Padding: 40px above and below card
```

---

## Technical notes for Lovable / Next.js build

```
Route type:       Public Next.js page (no auth middleware)
Data fetching:    Server-side (getServerSideProps or Next.js App Router)
                  Fetch invoice/quote by ID from Supabase on each request
View tracking:    Supabase edge function called on page load
                  Sets viewed_at on first load only (check if null first)
                  Increments view_count on every load
                  Triggers Realtime update to freelancer's app

Error states:
  Invalid ID:     "This link is no longer available" — simple centred message
  Expired quote:  Show quote but with expired status bar
  Already paid:   Show invoice with "This invoice has been paid" banner
                  Background: #E6FBFC / border #65F7FF / text #004D52

PDF:              Browser print — page is print-styled
                  @media print: hide status bar and footer
                  Clean white page prints correctly
```

---

## Figma Make build instructions

Build two screens at 390×844px:

**Screen A — Quote view (Classic template)**
Show populated state with:
- Yellow status bar "Quote · expires 30 Mar"
- Black header with KD logo placeholder, business name, quote number, total
- Body: Prepared for, line items, total, expiry block, to proceed block
- Footer: "Sent with Clear"

**Screen B — Invoice view (Branded template)**
Show populated state with:
- Cyan status bar "Invoice · due 14 Apr"
- Brand colour header (use #FF659C as example)
- Body: Bill to, line items, tax row, total, due date block, payment details
- Footer: "Sent with Clear"

**Screen C — Invoice view (Minimal template)**
Same content as Screen B, minimal header treatment.

**Screen D — Overdue invoice state**
Amber status bar "Invoice · 6 days overdue"
Banner below status bar:
  Background: #FFFBE6 / border-bottom 1px solid #FFE24B / padding 10px 16px
  "Payment is overdue. Please contact [business name] if you have any questions."
  11px / 400 / #7A5000

No prototype connections needed for client pages — static display only.