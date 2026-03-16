# Clear — Figma Make Correction Prompt v1

These are targeted corrections to the existing design. Do not rebuild from scratch — apply these changes precisely to what exists.

---

## 1. Border radius corrections

**Cards (project cards):**
Change border-radius from current (~16-20px) to 8px on all project cards across all screens.

**FAB ("+ New project" button):**
Change border-radius from fully rounded to 8px. The button width should be auto (padding 0 32px), centred, not full-width edge to edge.

**Filter pills (All / Ready / In progress / Invoiced / Overdue):**
Change border-radius from fully rounded to 8px. These are filter controls, not status badges.

**Status pills inside cards (Invoiced / Ready / Cleared / Archived / Overdue tag):**
Keep --radius-pill (fully rounded) for status pills only — this is intentional and correct.
The "Overdue" badge (yellow, top-right of card) should be --radius-pill also — this is correct, keep as is.

---

## 2. Typography weight hierarchy on project cards

Client name (e.g. "Stripe", "Figma", "Vercel"):
→ font-weight: 600 — this is the primary identity, should be the dominant element

Amount (e.g. "£4,800", "$2,600"):
→ Change to font-weight: 500 — supporting information, should not compete with client name

Project type (e.g. "Brand identity", "UX audit"):
→ Keep at font-weight: 400, color: --color-muted — correct as is

---

## 3. Swipe right interaction (status advance)

Current behaviour: card splits into two panels during swipe (left = green bg with arrow, right = card content remaining visible).

Correct behaviour: the entire card slides right as one unit. The green background (#DCFCE7) with the arrow icon is revealed behind/underneath the card as it moves. The card content stays intact and moves together. On release past 60px threshold, the card snaps back to position and the status pill updates with a transition animation.

The green reveal area should be the full height and full width of the card, sitting behind it in z-order — not splitting the card into two panels.

---

## 4. Tab indicator consistency

All three tabs (Active / Cleared / Archived) should use the same underline indicator colour when active.

Use: white (#FFFFFF) underline, 2px height, for the active tab indicator across all three tabs.

Remove the green underline on the Cleared tab — colour-coding the tab indicator is inconsistent and adds visual noise. The tab label itself is sufficient.

---

## 5. Filter pill row — right edge fade

Add a fade-out gradient on the right edge of the filter pill scroll row.
Gradient: from transparent to --color-surface (#F4F4F4), 24px wide, positioned absolute right edge of the scroll container.
This signals that the row is scrollable horizontally.

---

## 6. FAB positioning and sizing

Current: FAB stretches nearly full width of screen.
Correct: FAB is auto-width, centred horizontally, with 32px left and right internal padding.
Position: fixed, bottom 24px + safe-area-inset-bottom, horizontally centred.
The button should feel like a floating action, not a full-width form submit button.

---

## 7. Card spacing inside

Increase the vertical padding inside each project card slightly.
Current padding appears to be ~12px. Increase to 16px top and bottom, 16px left and right.
This gives the content more room to breathe — client name, type, amount, and status pill should not feel crowded.

---

## 8. Swipe left (Archive / Delete) — colour correction

Archive action background: use #4B5563 (dark slate grey) — correct, keep as is.
Delete action background: use #DC2626 (--color-danger) — correct, keep as is.
Icon + label sizing inside the revealed actions: ensure icon is 20px, label is 12px / 500 weight, both centred vertically and horizontally within their action area.
Minimum width of each action area: 72px.

---

## 9. "6 days overdue" / "16 days overdue" text

This text currently appears in --color-yellow-text which is correct.
Ensure font-weight is 500, font-size 12px (--text-xs).
It should sit on the same visual row as or just below the Overdue badge, right-aligned.

---

## Do not change

- Three-tab navigation structure (Active / Cleared / Archived) — keep as is, this is better than the original spec
- Status pill colours — correct
- Overdue card yellow tint background — correct
- Black top bar with violet period on wordmark — correct
- violet "+" button top right — correct
- Overall card structure and information hierarchy — correct
- Archived tab greyed pill style — correct and intentional