export const projectSettingsTabs = [
  {
    key: 'project-setting',
    label: 'Project Setting'
  },
  {
    key: 'task-status',
    label: 'Task Status'
  },
  {
    key: 'task-type',
    label: 'Task Type'
  }
];

export const projectSettingsTabMap = projectSettingsTabs.reduce((map, tab) => {
  map[tab.key] = tab.label;
  return map;
}, {} as Record<string, string>);
