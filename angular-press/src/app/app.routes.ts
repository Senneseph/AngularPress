import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public blog routes
  {
    path: '',
    loadComponent: () => import('./blog/blog-home/blog-home.component').then(m => m.BlogHomeComponent)
  },
  {
    path: 'post/:slug',
    loadComponent: () => import('./blog/blog-post/blog-post.component').then(m => m.BlogPostComponent)
  },

  // Admin routes under /ap-admin
  {
    path: 'ap-admin',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'change-password',
        loadComponent: () => import('./components/change-password/change-password.component').then(m => m.ChangePasswordComponent),
        canActivate: [authGuard]
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
      },
      {
        path: 'posts',
        loadComponent: () => import('./components/posts/posts.component').then(m => m.PostsComponent),
        canActivate: [authGuard]
      },
      {
        path: 'posts/new',
        loadComponent: () => import('./components/posts/post-form/post-form.component').then(m => m.PostFormComponent),
        canActivate: [authGuard]
      },
      {
        path: 'posts/:id',
        loadComponent: () => import('./components/posts/post-detail/post-detail.component').then(m => m.PostDetailComponent),
        canActivate: [authGuard]
      },
      {
        path: 'users',
        loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent),
        canActivate: [authGuard]
      },
      {
        path: 'categories',
        loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent),
        canActivate: [authGuard]
      },
      {
        path: 'tags',
        loadComponent: () => import('./components/tags/tags.component').then(m => m.TagsComponent),
        canActivate: [authGuard]
      }
    ]
  },

  // Fallback to blog home
  { path: '**', redirectTo: '' }
];
