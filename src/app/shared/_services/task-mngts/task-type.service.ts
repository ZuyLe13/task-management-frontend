import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CacheService } from '../cache.service';

export interface TaskType {
  _id?: string;
  name: string;
  code?: string;
  icon?: string;
  isActive?: boolean;
  isSubTask?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class TaskTypeService {
  private apiUrl = `${environment.apiUrl}/task-type`;

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  getTaskTypes(): Observable<TaskType[]> {
    return this.cacheService.cacheObservable(
      'taskTypes',
      this.http.get<TaskType[]>(this.apiUrl)
    );
  }

  getTaskTypeById(id: string): Observable<ApiResponse<TaskType>> {
    return this.cacheService.cacheObservable(
      `taskType_${id}`,
      this.http.get<ApiResponse<TaskType>>(`${this.apiUrl}/${id}`)
    );
  }

  createTaskType(taskType: TaskType): Observable<ApiResponse<TaskType>> {
    return this.http.post<ApiResponse<TaskType>>(this.apiUrl, taskType).pipe(
      tap(() => {
        this.cacheService.clearCache('taskTypes');
      })
    );
  }

  updateTaskType(id: string, taskType: Partial<TaskType>): Observable<ApiResponse<TaskType>> {
    return this.http.put<ApiResponse<TaskType>>(`${this.apiUrl}/${id}`, taskType).pipe(
      tap(() => {
        this.cacheService.clearCache('taskTypes');
        this.cacheService.clearCache(`taskType_${id}`);
      })
    );
  }

  deleteTaskType(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.cacheService.clearCache('taskTypes');
        this.cacheService.clearCache(`taskType_${id}`);
      })
    );
  }
}
