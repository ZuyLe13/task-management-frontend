import { HttpClient } from '@angular/common/http';
import { Injectable, ChangeDetectionStrategy } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CacheService } from '../cache.service';
import { ApiResponse } from './task-type.service';

export interface TaskStatus {
  _id?: string;
  name: string;
  code: string;
  color?: string;
  isActive?: boolean;
  isDefault?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskStatusService {
  private apiUrl = `${environment.apiUrl}/task-status`;

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  getTaskStatuses(): Observable<TaskStatus[]> {
    return this.cacheService.cacheObservable(
      'taskStatuses',
      this.http.get<TaskStatus[]>(this.apiUrl)
    );
  }

  getTaskStatusById(id: string): Observable<ApiResponse<TaskStatus>> {
    return this.cacheService.cacheObservable(
      `taskStatus_${id}`,
      this.http.get<ApiResponse<TaskStatus>>(`${this.apiUrl}/${id}`)
    );
  }

  createTaskStatus(taskStatus: TaskStatus): Observable<ApiResponse<TaskStatus>> {
    return this.http.post<ApiResponse<TaskStatus>>(`${environment.apiUrl}/task-status`, taskStatus).pipe(
      tap(() => {
        this.cacheService.clearCache('taskStatuses');
      })
    );
  }

  updateTaskStatus(id: string, taskStatus: Partial<TaskStatus>): Observable<ApiResponse<TaskStatus>> {
    return this.http.put<ApiResponse<TaskStatus>>(`${environment.apiUrl}/task-status/${id}`, taskStatus).pipe(
      tap(() => {
        this.cacheService.clearCache('taskStatuses');
        this.cacheService.clearCache(`taskStatus_${id}`);
      })
    );
  }

  deleteTaskStatus(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/task-status/${id}`).pipe(
      tap(() => {
        this.cacheService.clearCache('taskStatuses');
        this.cacheService.clearCache(`taskStatus_${id}`);
      })
    );
  }
}
