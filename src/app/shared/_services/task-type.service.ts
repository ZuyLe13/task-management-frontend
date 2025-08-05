import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';

export interface TaskType {
  name: string;
  code?: string;
  icon?: string;
  isActive?: boolean;
  isSubTask?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskTypeService {

  constructor(private http: HttpClient) { }

  getTaskTypes(): Observable<TaskType[]> {
    return this.http.get<TaskType[]>(`${environment.apiUrl}/task-type`);
  }

  createTaskType(taskType: TaskType): Observable<TaskType> {
    return this.http.post<TaskType>(`${environment.apiUrl}/task-type`, taskType);
  }
}
