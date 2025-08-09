import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { ApiResponse } from './task-type.service';
import { CacheService } from './cache.service';
import { tap } from 'rxjs';

export interface Priority {
  _id?: string;
  name: string;
  code: string;
  level: number;
  color?: string;
  isActive?: boolean;
  isDefault?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PriorityService {
  private apiUrl = `${environment.apiUrl}/priority`;

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  getPriorities(): Observable<Priority[]> {
    return this.cacheService.cacheObservable(
      'priorities',
      this.http.get<Priority[]>(this.apiUrl)
    );
  }

  getPriorityById(id: string): Observable<ApiResponse<Priority>> {
    return this.cacheService.cacheObservable(
      `priority_${id}`,
      this.http.get<ApiResponse<Priority>>(`${this.apiUrl}/${id}`)
    );
  }

  createPriority(priority: Priority): Observable<ApiResponse<Priority>> {
    return this.http.post<ApiResponse<Priority>>(this.apiUrl, priority).pipe(
      tap(() => {
        this.cacheService.clearCache('priorities');
      })
    );
  }

  updatePriority(id: string, priority: Partial<Priority>): Observable<ApiResponse<Priority>> {
    return this.http.put<ApiResponse<Priority>>(`${this.apiUrl}/${id}`, priority).pipe(
      tap(() => {
        this.cacheService.clearCache('priorities');
        this.cacheService.clearCache(`priority_${id}`);
      })
    );
  }

  deletePriority(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.cacheService.clearCache('priorities');
        this.cacheService.clearCache(`priority_${id}`);
      })
    );
  }
}
