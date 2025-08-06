import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';

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

  constructor(private http: HttpClient) { }

  getTaskTypes(): Observable<TaskType[]> {
    return this.http.get<TaskType[]>(`${environment.apiUrl}/task-type`);
  }

  createTaskType(taskType: TaskType): Observable<ApiResponse<TaskType>> {
    return this.http.post<ApiResponse<TaskType>>(`${environment.apiUrl}/task-type`, taskType);
  }

  updateTaskType(id: string, taskType: Partial<TaskType>): Observable<ApiResponse<TaskType>> {
    return this.http.put<ApiResponse<TaskType>>(`${environment.apiUrl}/task-type/${id}`, taskType);
  }

  deleteTaskType(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/task-type/${id}`);
  }

  getTaskTypeById(id: string): Observable<ApiResponse<TaskType>> {
    return this.http.get<ApiResponse<TaskType>>(`${environment.apiUrl}/task-type/${id}`);
  }
}
