# Design Guidelines: Teacher Substitution System

## Design Approach

**Selected Framework:** Material Design 3 with productivity-focused adaptations
**Rationale:** This is a utility-first administrative tool requiring clarity, efficiency, and data-dense displays. Material Design's structured approach with clear visual hierarchy and robust component library aligns perfectly with school administration needs.

## Typography System

**Font Family:** Inter (primary), Roboto (fallback) via Google Fonts CDN

**Hierarchy:**
- Page Titles: text-3xl font-bold (30px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-lg font-medium (18px)
- Body Text: text-base font-normal (16px)
- Supporting Text: text-sm font-normal (14px)
- Labels/Captions: text-xs font-medium (12px, uppercase tracking-wide)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4 or p-6
- Section spacing: gap-6 or gap-8
- Card spacing: p-4
- Form field gaps: gap-4

**Grid Structure:**
- Main container: max-w-7xl mx-auto px-4
- Dashboard metrics: 3-column grid (grid-cols-3) on desktop, stack on mobile
- Weekly schedule: Full-width table with fixed time column, scrollable content area

## Core Layout Structure

### Navigation
**Top Navigation Bar:**
- Fixed header with height h-16
- Logo/title on left, user profile/notifications on right
- Clean, minimal design with subtle border-b

**Sidebar Navigation:**
- Width w-64, fixed position on desktop
- Collapsible to icon-only on tablet/mobile
- Menu items with icons (Lucide) + labels
- Active state with background highlight

### Dashboard Layout
**3-Column Metrics Grid:**
- Cards showing: Total Substituições, Necessidades Pendentes, Falhas/Sem Disponibilidade
- Each card: Large number (text-4xl font-bold), label below (text-sm), icon top-right
- Card styling: rounded-lg border with subtle shadow

**Charts Section:**
- 2-column layout for Recharts visualizations
- Line chart for substituições over time
- Bar chart for professores mais escalados
- Consistent card containers with headers

### Weekly Schedule View (Primary Interface)

**Based on provided mockup:**

**Header Section:**
- Breadcrumb navigation (Dashboard > Grade Semanal)
- Week selector with previous/next arrows
- "Gerar Automaticamente" button (primary action, top-right)
- Current week display (e.g., "Semana de 20 a 24 de Janeiro")

**Schedule Grid:**
- Time slots column (fixed left, w-24): 07:00 - 18:00
- 5 day columns: Segunda to Sexta
- Grid cells with rounded corners showing:
  - Subject name (font-medium)
  - Teacher name (text-sm, muted)
  - Substitution indicator (badge/chip when applicable)
- Empty cells: subtle border with dashed style
- Filled cells: solid border, background fill
- Substitution cells: distinct visual treatment (border accent)

**Grid Specifications:**
- Minimum cell height: h-20
- Hover state on cells for interaction
- Click to edit/view details
- Responsive: horizontal scroll on mobile

### Teacher Management
**List View:**
- Table layout with columns: Nome, Área de Conhecimento, Carga Horária (progress bar), Ações
- Search/filter bar at top
- "Adicionar Professor" button (primary, top-right)
- Pagination at bottom

**Form Layout:**
- Single column form with max-w-2xl
- Clear field labels above inputs
- Helper text below fields where needed
- Action buttons at bottom (Cancel left, Save right)

### Absence Registration Form
**Modal/Drawer Layout:**
- Clean, focused design (max-w-lg)
- Form fields stacked with gap-4:
  - Professor selector (dropdown)
  - Disciplina input
  - Data/Horário pickers (side-by-side)
  - Duração (number input with hour suffix)
- Preview section showing affected schedule slot
- Primary "Registrar Ausência" button

## Component Library

### Cards
- Border radius: rounded-lg
- Border: border with subtle color
- Padding: p-6
- Shadow: Minimal, only shadow-sm

### Buttons
**Primary:** Solid fill, rounded-md, px-4 py-2, font-medium
**Secondary:** Border outline, same dimensions
**Icon Buttons:** Square aspect-ratio, p-2, rounded-md

### Form Inputs
- Height: h-10 for text inputs
- Border: border rounded-md
- Focus: ring-2 focus state
- Labels: text-sm font-medium mb-1

### Tables
- Striped rows for readability
- Hover state on rows
- Sticky header when scrolling
- Alternating row backgrounds (very subtle)

### Badges/Chips
- Small, rounded-full pills
- Used for: status indicators, subject areas, notification counts
- Padding: px-3 py-1, text-xs font-medium

### Dropdowns/Selects
- Consistent with text inputs
- Chevron icon on right
- Dropdown menu with max-height and scroll

## Notifications System
**Toast Notifications:**
- Position: top-right corner
- Auto-dismiss after 4 seconds
- Types: Success (substitution assigned), Error (no professor available), Info
- Close button always visible

**Empty States:**
- Centered layout with icon, heading, description
- Helpful action button when applicable
- Used in: no pending needs, no teachers available

## Responsive Behavior

**Desktop (lg:):** Full multi-column layouts, sidebar always visible
**Tablet (md:):** Collapsible sidebar, 2-column grids, schedule may require horizontal scroll
**Mobile (base):** Single column stacks, hamburger menu, card-based schedule view

## Data Visualization (Recharts)

**Chart Styling:**
- Minimal gridlines
- Clear axis labels
- Legend positioned top-right
- Tooltips on hover with detailed info
- Consistent spacing: p-6 in chart containers

## Icons
**Library:** Lucide React exclusively
**Usage:**
- Navigation items (Home, Calendar, Users, Settings)
- Action buttons (Plus, Edit, Trash, ChevronRight)
- Status indicators (Check, X, AlertCircle)
- Size: Consistent w-5 h-5 for most contexts

**No animations** except for loading states (simple spinners) and toast notifications (slide-in).

---

**Overall Principle:** Clean, professional, data-dense interface optimized for administrative efficiency. Every element serves a functional purpose with clear visual hierarchy guiding users through complex scheduling tasks.