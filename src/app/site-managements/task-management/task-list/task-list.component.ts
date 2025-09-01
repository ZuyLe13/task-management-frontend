import { Component, OnInit } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskStatus, TaskStatusService } from '../../../shared/_services/task-mngts/task-status.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../shared/_services/modals/modal.service';
import { ZI18nComponent } from "../../../shared/_components/z-i18n/z-i18n.component";
import { TaskUpsertComponent } from '../../../components/task-upsert/task-upsert.component';
import { TaskType } from '../../../shared/_services/task-mngts/task-type.service';
import { TaskService } from '../../../shared/_services/task-mngts/task.service';
import { Priority, PriorityService } from '../../../shared/_services/task-mngts/priority.service';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

export interface Task {
  taskKey: string;
  reporter: string;
  assignee: string;
  title: string;
  description: string;
  label: string[];
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
    CommonModule,
    ZI18nComponent,
    MatMenuModule,
    FormsModule
],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  taskList: Task[] = [];
  taskGroups: { [key: string]: Task[] } = {};
  taskStatuses: TaskStatus[] = [];
  taskTypes: TaskType[] = [];
  priorities: Priority[] = [];
  selectedTask: any;

  constructor(
    private taskStatusService: TaskStatusService,
    private taskService: TaskService,
    private priorityService: PriorityService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTaskData();
    this.priorityService.getPriorities().subscribe({
      next: (priorities) => {
        this.priorities = priorities;
      },
      error: (err) => console.error('Error fetching priorities:', err)
    });
  }

  private loadTaskData(): void {
    this.taskService.getAllTask().subscribe({
      next: (tasks) => {
        this.taskList = tasks;
        this.taskStatusService.getTaskStatuses().subscribe({
          next: (taskStatuses) => {
            this.taskStatuses = taskStatuses.map(status => ({
              code: status.code,
              name: status.name,
              color: status.color
            }));
            this.taskGroups = Object.fromEntries(this.taskStatuses.map(status => [status.code, []]));
            const statusMap = Object.fromEntries(
              taskStatuses.map(status => [
                status.code.toLowerCase().replace(/[_-\s]+/g, ' ').trim(),
                status.code
              ])
            );
            this.taskList.forEach(task => {
              if (task?.taskKey && task?.status) {
                const matchedStatus = statusMap[task.status.toLowerCase().replace(/[_-\s]+/g, ' ').trim()] || 'Unknown';
                if (!this.taskGroups[matchedStatus]) {
                  this.taskGroups[matchedStatus] = [];
                  if (!this.taskStatuses.some(s => s.code === matchedStatus)) {
                    this.taskStatuses.push({ code: matchedStatus, name: matchedStatus });
                  }
                }
                this.taskGroups[matchedStatus].push(task);
              }
            });
          },
          error: (err) => console.error('Error fetching statuses:', err)
        });
      },
      error: (err) => console.error('Error fetching tasks:', err)
    });
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];
      this.onChangeTaskStatus(movedTask, newStatus);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      movedTask.status = newStatus;
    }
  }

  onCreate(statusCode?: string): void {
    const dialogData: any = {};

    if (statusCode) {
      dialogData.initialStatus = statusCode;
    }

    const dialogRef = this.dialog.open(TaskUpsertComponent, {
      minWidth: '800px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTaskData();
      }
    });
  }

  onDeleteTask(item: Task) {
    if (confirm('Bạn có chắc chắn muốn xóa task này?')) {
      this.taskService.deleteTask(item.taskKey).subscribe({
        next: () => {
          this.loadTaskData();
        },
        error: (err) => {
          alert('Xóa task thất bại!');
          console.error('Delete task error:', err);
        }
      });
    }
  }

  onChangeTaskStatus(item: Task, newStatus: string) {
    if (item.status === newStatus) return;
    this.taskService.updateTaskWithTaskStatus(item.taskKey, newStatus).subscribe({
      next: () => {
        item.status = newStatus;
        this.loadTaskData();
      },
      error: (err) => {
        alert('Cập nhật trạng thái thất bại!');
        console.error('Update status error:', err);
      }
    });
  }

  getStatusColor(code: string, opacity: number = 1): string {
    const hex = this.taskStatuses.find(s => s.code === code)?.color || '#e5e7eb';
    return this.hexToRgba(hex, opacity);
  }

  getPriorityColor(code: string, opacity: number = 1): string {
    const hex = this.priorities.find(p => p.code === code)?.color || '#f3f4f6';
    return this.hexToRgba(hex, opacity);
  }

  hexToRgba(hex: string, opacity: number): string {
    let c = hex.replace('#', '');
    if (c.length === 3) {
      c = c.split('').map(x => x + x).join('');
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${opacity})`;
  }

  getStatusName(code: string): string {
    return this.taskStatuses.find(s => s.code === code)?.name || code;
  }

  getPriorityName(code: string): string {
    return this.priorities.find(p => p.code === code)?.name || code;
  }
}
