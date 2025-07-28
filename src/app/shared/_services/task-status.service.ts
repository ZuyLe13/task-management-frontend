import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TaskStatus {
  _id: string;
  name: string;
  code: string;
  color: string;
  isActive: boolean;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskStatusService {
  constructor(
    private http: HttpClient, 
  ) { }

  getTaskStatus(): Observable<TaskStatus[]> {
    return this.http.get<TaskStatus[]>(`${environment.apiUrl}/task-status`);
  }

  getTaskStatusById(id: string): Observable<TaskStatus> {
    return this.http.get<any>(`${environment.apiUrl}/task-status/${id}`)
      .pipe(
        map(response => response.data || response)
      );
  }

  createTaskStatus(taskStatus: TaskStatus): Observable<TaskStatus> {
    return this.http.post<TaskStatus>(`${environment.apiUrl}/task-status`, taskStatus);
  }

  updateTaskStatus(id: string, taskStatus: TaskStatus): Observable<TaskStatus> {
    return this.http.put<TaskStatus>(`${environment.apiUrl}/task-status/${id}`, {
      name: taskStatus.name,
      color: taskStatus.color,
      isActive: taskStatus.isActive,
      isDefault: taskStatus.isDefault,
    });
  }

  deleteTaskStatus(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/task-status/${id}`);
  }
}
