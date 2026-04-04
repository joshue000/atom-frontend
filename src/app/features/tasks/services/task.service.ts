import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../../../core/models/task.model';
import { StorageService } from '../../../core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  private readonly _tasks = new BehaviorSubject<Task[]>([]);
  readonly tasks$: Observable<Task[]> = this._tasks.asObservable();

  loadTasks(): Observable<Task[]> {
    const userId = this.storage.getUserId()!;
    return this.http
      .get<Task[]>(this.baseUrl, { params: { userId } })
      .pipe(tap((tasks) => this._tasks.next(tasks)));
  }

  createTask(payload: CreateTaskPayload): Observable<Task> {
    return this.http
      .post<Task>(this.baseUrl, payload)
      .pipe(tap((task) => this._tasks.next([task, ...this._tasks.getValue()])));
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
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(tap(() => this._tasks.next(this._tasks.getValue().filter((t) => t.id !== id))));
  }
}
