import { Component, OnInit } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskStatus, TaskStatusService } from '../../../shared/_services/task-status.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CommonModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  initialTasks = [
    { name: 'Get to work', status: 'TO_DO' },
    { name: 'Pick up groceries', status: 'TO_DO' },
    { name: 'Go home', status: 'REOPENED' },
    { name: 'Fall asleep', status: 'TO_DO' },
    { name: 'Get up', status: 'DONE' },
    { name: 'Brush teeth', status: 'REOPENED' },
    { name: 'Take a shower', status: 'DONE' },
    { name: 'Check e-mail', status: 'IN_PROCESS' },
    { name: 'Walk dog', status: 'DONE' },
  ];

  taskGroups: { [key: string]: { name: string, status: string }[] } = {};
  statuses: string[] = [];

  constructor(private taskStatusService: TaskStatusService) {}

  ngOnInit(): void {
    this.taskStatusService.getTaskStatus().subscribe({
      next: (taskStatuses: TaskStatus[]) => {
        this.statuses = taskStatuses
          .map(status => status.code ? status.code.toLowerCase() : '')
          .filter(code => code);
        this.taskGroups = this.statuses.reduce((groups, status) => {
          groups[status] = [];
          return groups;
        }, {} as { [key: string]: { name: string, status: string }[] });

        this.initialTasks.forEach(task => {
          const normalizedStatus = task.status.toLowerCase();
          if (this.taskGroups[normalizedStatus]) {
            this.taskGroups[normalizedStatus].push(task);
          } else {
            console.warn(`Status ${task.status} not found, assigning to ${this.statuses[0]}`);
            this.taskGroups[this.statuses[0]].push(task);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching task statuses:', err);
      }
    });
  }

  drop(event: CdkDragDrop<{ name: string, status: string }[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      item.status = newStatus;
    }
  }
}
