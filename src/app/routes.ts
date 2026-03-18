import { createBrowserRouter } from 'react-router';
import Root from './Root';
import Landing from './screens/Landing';
import Onboarding from './screens/Onboarding';
import Help from './screens/Help';
import ProjectList from './screens/ProjectList';
import ProjectDetail from './screens/ProjectDetail';
import NewProject from './screens/NewProject';
import Branding from './screens/Branding';
import InvoiceDefaults from './screens/InvoiceDefaults';
import Archived from './screens/Archived';
import ClientQuotePage from './screens/ClientQuotePage';
import ClientInvoicePage from './screens/ClientInvoicePage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Landing },
      // ── Onboarding flow ───────────────────────────────────
      { path: 'onboarding/:step', Component: Onboarding },
      // ── Help ─────────────────────────────────────────────
      { path: 'help', Component: Help },
      // ── Main app ─────────────────────────────────────────
      { path: 'projects', Component: ProjectList },
      { path: 'projects/new', Component: NewProject },
      { path: 'projects/:id', Component: ProjectDetail },
      { path: 'settings/branding', Component: Branding },
      { path: 'settings/invoice-defaults', Component: InvoiceDefaults },
      { path: 'archived', Component: Archived },
      // ── Public client-facing pages ────────────────────────
      { path: 'q/:id', Component: ClientQuotePage },
      { path: 'i/:id', Component: ClientInvoicePage },
    ],
  },
]);
