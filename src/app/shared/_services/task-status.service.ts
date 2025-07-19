import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TaskStatus {
  name: string;
  code: string;
  color: string;
  active: boolean;
  default: boolean;
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
}
