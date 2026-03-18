import { createBrowserRouter } from 'react-router';
import Root from './Root';
import Landing from './screens/Landing';
import Onboarding from './screens/Onboarding';
import ProjectList from './screens/ProjectList';
import ProjectDetail from './screens/ProjectDetail';
import NewProject from './screens/NewProject';
import InvoiceDefaults from './screens/InvoiceDefaults';
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
      // ── Main app ─────────────────────────────────────────
      { path: 'projects', Component: ProjectList },
      { path: 'projects/new', Component: NewProject },
      { path: 'projects/:id', Component: ProjectDetail },
      { path: 'settings/invoice-defaults', Component: InvoiceDefaults },
      // ── Public client-facing pages ────────────────────────
      { path: 'q/:id', Component: ClientQuotePage },
      { path: 'i/:id', Component: ClientInvoicePage },
    ],
  },
]);