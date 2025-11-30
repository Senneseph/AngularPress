import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Dynamic routes with parameters - use Server rendering
  {
    path: 'post/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'ap-admin/posts/:id',
    renderMode: RenderMode.Server
  },
  // Static routes - prerender
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'ap-admin',
    renderMode: RenderMode.Server
  },
  {
    path: 'ap-admin/**',
    renderMode: RenderMode.Server
  },
  // Fallback - use client-side rendering for everything else
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
