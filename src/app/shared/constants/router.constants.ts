export const routerObject = {
  dashboard: {
    path: '/dashboard',
    breadcrumb: 'Dashboard'
  },
  taskList: {
    path: '/task-list',
    breadcrumb: 'Task List'
  },
  projects: {
    path: '/projects',
    breadcrumb: 'Projects'
  },
  projectDetail: {
    path: '/projects/:id',
    breadcrumb: 'Project Detail'
  },
  settings: {
    path: '/settings',
    breadcrumb: 'Settings'
  },
  profile: {
    path: '/profile',
    breadcrumb: 'Profile'
  }
} as const;