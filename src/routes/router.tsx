import type { Session } from '@supabase/supabase-js';
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import Auth from '../pages/Auth';
import Index from '../pages/Index';

type RouterContext = {
  session: Session | null;
};

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: '/auth',
      });
    }
  },
  component: Index,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: Auth,
});

const routeTree = rootRoute.addChildren([appRoute, authRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    session: null,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
