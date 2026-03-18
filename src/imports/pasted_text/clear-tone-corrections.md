# Clear — Tone & Language Correction Prompt

Apply these copy and communication style corrections across all screens. Do not change any visual design, layout, or functionality — text content only unless specified.

---

## Brand voice principles

Clear speaks like a smart, direct friend who knows what they're doing.

```
Confident         not bossy
Direct            not cold
Human             not casual
Action-oriented   not pushy
Honest            not modest
```

Never corporate. Never over-excited. Never vague.

---

## Logo + tagline treatment

On all black background screens (Landing, O1, O2, O5, any future dark screens):

```
Logo:    C✓ear SVG — height 28px — left aligned — padding 20px from top
Tagline: "From quote to cleared."
         DM Sans 12px / 400 / rgba(255,255,255,0.45)
         margin-top 6px / left aligned / tracking 0.01em
```

These two elements appear together as a unit on every black screen.
They do NOT appear on white mid-flow screens (O3, O4, form screens, settings).

---

## Arrow → usage rules

Use → only when the action moves the user forward in a flow.
Never use → on save, delete, cancel, edit, or any lateral/destructive action.

```
USE →:
  Next step in a flow
  Sending something out
  Starting something new
  Navigating deeper

DO NOT USE →:
  Save / saving in place
  Delete / destructive actions
  Edit / lateral actions
  Cancel / back actions
  Final completion states
```

---

## CTA label corrections — full app

### Onboarding

```
CURRENT              →    CORRECTED
"Get Started"             "Get started →"
"Continue"                "Next →"              (O1, O3)
"Continue with Google"    "Continue with Google →"
"Skip for now"            "Skip for now"        (no arrow — optional action)
"Let's go"                "Let's go →"          (O4)
"Go to projects"          "Go to projects →"    (O5)
```

### Project flow

```
CURRENT              →    CORRECTED
"Create Project"          "Create project →"
"Save"                    "Save"                (no arrow — saving in place)
"Send Quote"              "Send quote →"
"Generate Invoice"        "Generate invoice →"
"Send Invoice"            "Send invoice →"
"Mark as Invoiced"        "Mark as invoiced →"
"Mark as Cleared"         "Mark as cleared →"
"Resend Invoice"          "Resend invoice"      (no arrow — repeat action)
"Edit Project"            "Edit project"        (no arrow — lateral)
"Duplicate"               "Duplicate project"   (no arrow — lateral)
"Cancel"                  "Cancel"              (no arrow)
"Delete"                  "Delete"              (no arrow)
"Archive"                 "Archive"             (no arrow)
```

### Settings / navigation

```
CURRENT              →    CORRECTED
"Edit Profile"            "Edit profile"        (no arrow — lateral)
"Save Changes"            "Save"                (no arrow — saving in place)
"Sign Out"                "Sign out"            (no arrow — destructive)
"View Invoice"            "View invoice →"
"View Quote"              "View quote →"
```

---

## Screen-by-screen copy corrections

### Landing screen

```
Tagline (below logo):  "From quote to cleared."
Headline:              "Project in.\nPayment cleared."
Sub:                   "Track projects, send quotes, get paid."
Primary CTA:           "Get started →"
Secondary link:        "Already have an account? Sign in"
```

### Onboarding O1 — Welcome (black bg)

```
Logo + tagline:   per spec above
Progress:         5 dots, dot 1 filled white
Heading:          "Welcome."
Sub:              "Your freelance work, from first quote to final payment."
CTA:              "Next →"
```

### Onboarding O2 — Sign in (black bg)

```
Logo + tagline:   per spec above
Progress:         dot 2 filled
Heading:          "Sign in to save your work"
Sub:              "Projects, quotes and invoices — all in one place."
Google CTA:       "Continue with Google →"
Apple CTA:        "Continue with Apple · Coming soon"
                  (greyed, non-tappable)
Skip link:        "Skip for now"
```

### Onboarding O3 — Persona (white bg)

```
No logo/tagline — mid-flow utility screen
Progress:         dot 3 filled (dots now black)
Heading:          "What do you do?"
Sub:              "We'll tailor Clear to fit your work."
Options:          "Designer" / "Developer" / "Consultant" / "Other"
CTA:              "Next →"   (disabled until selection)
```

### Onboarding O4 — Basic details (white bg)

```
No logo/tagline
Progress:         dot 4 filled
Heading:          "A few quick details"
Sub:              "These appear on every invoice and quote you send."
Field labels:     "Your name" / "Business name" / "Default currency"
CTA:              "Let's go →"   (disabled until name + business filled)
```

### Onboarding O5 — Ready (black bg)

```
Logo + tagline:   per spec above
Progress:         dot 5 filled white
Heading:          "You're all set."
Sub:              "Add your first project to get started."
CTA:              "Go to projects →"
```

### Project list — empty state

```
Heading:    "No projects yet"
Sub:        "Add your first project to get started."
CTA:        "New project →"

Three guide cards below (small, horizontal):
Card 1:     "1. Add a project"
Card 2:     "2. Send a quote"
Card 3:     "3. Get paid"
Style:      #F5F6F8 bg / #E2E5EC border / 8px radius
            10px/600/#7A8099 label
```

### Project list — Cleared tab empty state

```
Heading:    "Nothing cleared yet"
Sub:        "Mark a project as cleared once payment arrives."
No CTA button — just the message.
```

### Project detail — status hint banner

```
Quoting →     "Swipe right when the client approves your quote →"
In progress → "Swipe right when the work is done →"
Invoiced →    "Swipe right once payment arrives →"
```

### New project form

```
Screen title:       remove — not needed
Close button:       "×" only
Save button (top right, enabled state): "Save"
Save button (top right, disabled state): "Save" opacity 0.3

Field labels (sentence case, no colons):
  "Client name"
  "Client email"
  "Contact person"
  "Project type"
  "Categories"
  "Quoted amount"
  "Currency"
  "Deposit"
  "Start date"
  "Due date"
  "Notes"

Helper texts:
  Client email:     "Used when sharing quotes and invoices"
  Categories:       "Max 5 · tap to remove"
  Quoted amount:    "Leave blank if not agreed yet"
  Deposit:          "Shown on quote if applicable"
  Due date pills:   "7 days" / "14 days" / "30 days" / "Custom"
  Below due date:   "Days after invoice is sent"

Create button:      "Create project →"
```

### Invoice defaults screen

```
Screen title:         "Invoice defaults"
Section labels (all uppercase, 10px/600/#7A8099):
  "YOUR BUSINESS"
  "NUMBERING"
  "RATE CARD"
  "CUSTOM FIELDS"
  "PAYMENT DEFAULTS"
  "QUOTE DEFAULTS"

Field labels:
  "Your name"
  "Business name"
  "Email"
  "Address"
  "Phone"
  "Invoice prefix"     helper: "Your next invoice will be [prefix]-001"
  "Quote prefix"       helper: "Your next quote will be [prefix]-001"
  "Starting number"

Payment defaults:
  Due terms label:     "Payment due within"
  Pills:               "7 days" / "14 days" / "30 days" / "Custom"
  Helper below pills:  "Days after invoice is sent"

Save button:           "Save"   (no arrow — saving in place)
```

### Avatar bottom sheet

```
Section labels:
  "YOUR SETUP"
  "PROJECTS"  
  "ACCOUNT"

Row labels:
  "Branding"
  "Invoice defaults"
  "Archived projects"
  "Help"
  "Sign out"          (red, no chevron)

Edit profile button:  "Edit profile"   (no arrow)
```

### Branding screen

```
Screen title:         "Branding"
Section labels:
  "YOUR LOGO"
  "BRAND COLOUR"
  "INVOICE STYLE"

Upload box text:
  Primary:   "Upload logo"
  Secondary: "PNG or SVG · shown on all invoices and quotes"
  If uploaded: "Replace"

Template labels:
  "Classic" / "Branded" / "Minimal"

Save button:          "Save"
```

### Help screen

```
Screen title:   "Help"

FAQ items:
  Q1: "How do I send a quote?"
  A1: "Open a project and scroll to the Quote section.
       Tap Generate quote, review the details, then tap
       Send quote to copy a shareable link."

  Q2: "How do I mark a project as cleared?"
  A2: "Once payment arrives, open the project and tap
       Mark as cleared. The project moves to your
       Cleared tab permanently."

  Q3: "How do I add my bank details to invoices?"
  A3: "Tap your avatar → Invoice defaults → Payment defaults.
       Add your details in Default payment notes.
       They appear on every invoice automatically."
```

### Status change bottom sheet

```
Title:   "[Client name] — move to..."
Options: "Quoting" / "In progress" / "Invoiced" / "Cleared"
         (show current status as selected)
```

### Confirmation dialogs

```
Delete project:
  Title:   "Delete this project?"
  Body:    "This can't be undone."
  Confirm: "Delete"     (red text, no arrow)
  Cancel:  "Cancel"

Archive project:
  Title:   "Archive this project?"
  Body:    "You can restore it anytime from Archived projects."
  Confirm: "Archive"
  Cancel:  "Cancel"

Sign out:
  Title:   "Sign out?"
  Body:    "You'll need to sign in again to access your projects."
  Confirm: "Sign out"   (red text)
  Cancel:  "Cancel"
```

### Toast / success messages

```
Project created:    "Project created"
Quote sent:         "Quote link copied — share it with your client"
Invoice sent:       "Invoice link copied — share it with your client"
Cleared:            "Cleared. Well done."
Changes saved:      "Saved"
Project archived:   "Archived"
Project deleted:    "Deleted"
```

### Error messages

```
Required field:     "[Field name] is required"
Invalid email:      "That doesn't look like a valid email"
Network error:      "Something went wrong. Try again."
No connection:      "You're offline. Check your connection."
```

---

## General rules — apply everywhere

```
Sentence case always    →  "New project" not "New Project"
No exclamation marks    →  "You're all set." not "You're all set!"
No ellipsis in CTAs     →  "Loading" not "Loading..."
No please/sorry         →  direct, not apologetic
Numbers not words       →  "7 days" not "seven days"
Ampersand only in UI    →  "Quotes & invoices" in labels only
                           spell out "and" in sentences
```

---

## Do not change

- Any colours, fonts, spacing, or visual design
- Any component structure or layout
- Any icons or illustrations
- Navigation or routing logic
- Interaction states or animations