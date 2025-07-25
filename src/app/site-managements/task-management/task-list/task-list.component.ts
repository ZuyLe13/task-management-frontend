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

export interface Task {
  taskKey: string;
  reporter: string;
  assignee: string;
  title: string;
  description: string;
  label: string;
  taskType: string;
  priority: string;
  status: string;
  startDate: string;
  endDate: string;
  comments: string[];
}

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
  initialTasks: Task[] = [
    { 
      taskKey: 'ZT-1', title: 'Commute to Workplace Commute to Workplace Commute to Workplace', 
      description: 'Travel to the office for the workday. Travel to the office for the workday. Travel to the office for the workday.', label: 'Work', taskType: 'Commute', 
      priority: 'Medium', status: 'To Do', startDate: '2025-07-26', endDate: '2025-07-26',
      reporter: 'john.doe@example.com', assignee: 'dile@example.com', 
      comments: ['Ensure to leave early to avoid traffic.', 'Check for road closures.']
    },
    { 
      taskKey: 'ZT-2', title: 'Grocery Shopping', 
      description: 'Buy weekly groceries from the supermarket.', label: 'Personal', taskType: 'Errand', 
      priority: 'High', status: 'To Do', startDate: '2025-07-26', endDate: '2025-07-26',
      reporter: 'jane.smith@example.com', assignee: 'nhungo@example.com', 
      comments: ['Include milk and eggs.', 'Check for discounts.']
    },
    { 
      taskKey: 'ZT-3', title: 'Return Home', 
      description: 'Travel back home after work.', label: 'Personal', taskType: 'Commute', 
      priority: 'Medium', status: 'Reopened', startDate: '2025-07-26', endDate: '2025-07-26',
      reporter: 'john.doe@example.com', assignee: 'abc@example.com', 
      comments: ['Check bus schedule.', 'Avoid rush hour.']
    },
    { 
      taskKey: 'ZT-4', title: 'Sleep', 
      description: 'Get a good night’s rest.', label: 'Personal', taskType: 'Routine', 
      priority: 'Low', status: 'To Do', startDate: '2025-07-26', endDate: '2025-07-26',
      reporter: 'jane.smith@example.com', assignee: 'hgc@example.com', 
      comments: ['Avoid screens before bed.', 'Set a relaxing bedtime routine.']
    },
    { 
      taskKey: 'ZT-5', title: 'Wake Up', 
      description: 'Wake up in the morning.', label: 'Personal', taskType: 'Routine', 
      priority: 'High', status: 'Done', startDate: '2025-07-25', endDate: '2025-07-25',
      reporter: 'john.doe@example.com', assignee: 'pho@example.com', 
      comments: ['Set alarm for 6 AM.', 'Morning stretch recommended.']
    },
    { 
      taskKey: 'ZT-6', title: 'Oral Hygiene', 
      description: 'Brush teeth to maintain oral health.', label: 'Personal', taskType: 'Routine', 
      priority: 'Medium', status: 'Reopened', startDate: '2025-07-25', endDate: '2025-07-25',
      reporter: 'jane.smith@example.com', assignee: 'mnh@example.com', 
      comments: ['Use new toothbrush.', 'Floss afterward.']
    },
    { 
      taskKey: 'ZT-7', title: 'Shower', 
      description: 'Take a shower to stay clean.', label: 'Personal', taskType: 'Routine', 
      priority: 'Medium', status: 'Done', startDate: '2025-07-25', endDate: '2025-07-25',
      reporter: 'john.doe@example.com', assignee: 'qua@example.com', 
      comments: ['Use body wash.', 'Check water temperature.']
    },
    { 
      taskKey: 'ZT-8', title: 'Email Review', 
      description: 'Review and respond to work emails.', label: 'Work', taskType: 'Administrative', 
      priority: 'High', status: 'In Process', startDate: '2025-07-25', endDate: '2025-07-25',
      reporter: 'jane.smith@example.com', assignee: 'lkx@example.com', 
      comments: ['Prioritize urgent emails.', 'Archive completed threads.']
    },
    { 
      taskKey: 'ZT-9', title: 'Dog Walk', 
      description: 'Take the dog for a walk.', label: 'Personal', taskType: 'Pet Care', 
      priority: 'High', status: 'Done', startDate: '2025-07-25', endDate: '2025-07-25',
      reporter: 'john.dzb@example.com', assignee: 'to@example.com', 
      comments: ['Take the long route.', 'Bring water for the dog.']
    }
  ];

  taskGroups: { [key: string]: Task[] } = {};
  statuses!: string[];

  constructor(private taskStatusService: TaskStatusService) {}

  ngOnInit(): void {
    this.taskStatusService.getTaskStatus().subscribe({
      next: (taskStatuses: TaskStatus[]) => {
        this.statuses = taskStatuses.map(status => status.name);

        // Khởi tạo taskGroups với array rỗng cho mỗi status
        this.taskGroups = {};
        taskStatuses.forEach(status => {
          this.taskGroups[status.name] = [];
        });

        // Tạo mapping để so sánh case-insensitive
        const statusMapping: { [key: string]: string } = {};
        taskStatuses.forEach(status => {
          const normalizedKey = status.name.toLowerCase().replace(/\s+/g, ' ').trim();
          statusMapping[normalizedKey] = status.name;
        });

        // Phân loại tasks vào các nhóm tương ứng
        this.initialTasks.forEach(task => {
          const normalizedTaskStatus = task.status.toLowerCase().replace(/\s+/g, ' ').trim();
          const matchedStatus = statusMapping[normalizedTaskStatus];
          
          if (matchedStatus && this.taskGroups[matchedStatus]) {
            this.taskGroups[matchedStatus].push(task);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching task statuses:', err);
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: string) {
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
