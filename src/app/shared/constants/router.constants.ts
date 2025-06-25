export const routerObject = {
  // Dashboard
  dashboard: {
    path: 'dashboard',
    breadcrumb: 'Dashboard'
  },

  // Task Management
  taskManagement: {
    path: 'task-mngt',
    breadcrumb: 'Task Management'
  },
  taskList: {
    path: 'task-mngt/task-list',
    breadcrumb: 'Task List'
  },
  projectSettings: {
    path: 'task-mngt/project-settings',
    breadcrumb: 'Project Settings'
  },

  // Timeline
  timeline: {
    path: 'timeline',
    breadcrumb: 'Timeline'
  },

  // My Profile
  profile: {
    path: 'profile',
    breadcrumb: 'My Profile'
  },

  // Messages
  messages: {
    path: 'messages',
    breadcrumb: 'Messages'
  },

  // Documents
  documents: {
    path: 'documents',
    breadcrumb: 'Documents'
  }
} as const;
