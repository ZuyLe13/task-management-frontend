import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../../site-managements/task-management/task-list/task-list.component';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(
    private http: HttpClient,
  ) { }

  getAllTask(): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.apiUrl}/task`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${environment.apiUrl}/task`, task);
  }
}
