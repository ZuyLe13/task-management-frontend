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
import { ModalService } from '../../../shared/_services/modal.service';
import { ZI18nComponent } from "../../../shared/_components/z-i18n/z-i18n.component";
import { TaskUpsertComponent } from '../../../components/task-upsert/task-upsert.component';
import { TaskService } from '../../../shared/_services/task.service';
import { TaskType } from '../../../shared/_services/task-type.service';

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
    ZI18nComponent
],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  taskList: Task[] = [];
  taskGroups: { [key: string]: Task[] } = {};
  taskStatuses: TaskStatus[] = [];
  taskTypes: TaskType[] = [];

  constructor(
    private taskStatusService: TaskStatusService,
    private modalService: ModalService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadTaskData();
  }

  private loadTaskData(): void {
    this.taskService.getAllTask().subscribe({
      next: (tasks) => {
        this.taskList = tasks;
        this.taskStatusService.getTaskStatus().subscribe({
          next: (taskStatuses) => {
            this.taskStatuses = taskStatuses.map(status => ({
              code: status.code,
              name: status.name
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

  onCreate(): void {
    this.modalService.open(
      TaskUpsertComponent, { data: null }, { width: '800px' })
      .subscribe(result => {
        if(result) this.loadTaskData();
      }
    );
  }
}
