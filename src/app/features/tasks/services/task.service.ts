import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  PaginatedResponse,
} from '../../../core/models/task.model';
import { StorageService } from '../../../core/services/storage.service';
import { PAGINATION } from '../../../core/constants/pagination.constants';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  private readonly _tasks = new BehaviorSubject<Task[]>([]);
  readonly tasks$: Observable<Task[]> = this._tasks.asObservable();

  loadTasks(page = 1, limit = PAGINATION.DEFAULT_LIMIT): Observable<PaginatedResponse<Task>> {
    const userId = this.storage.getUserId()!;
    const offset = (page - 1) * limit;
    return this.http
      .get<PaginatedResponse<Task>>(this.baseUrl, {
        params: { userId, limit: String(limit), offset: String(offset) },
      })
      .pipe(tap((res) => this._tasks.next(res.data)));
  }

  createTask(payload: CreateTaskPayload): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, payload);
  }

  updateTask(id: string, payload: UpdateTaskPayload): Observable<Task> {
    return this.http
      .put<Task>(`${this.baseUrl}/${id}`, payload)
      .pipe(
        tap((updated) =>
          this._tasks.next(this._tasks.getValue().map((t) => (t.id === id ? updated : t))),
        ),
      );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
