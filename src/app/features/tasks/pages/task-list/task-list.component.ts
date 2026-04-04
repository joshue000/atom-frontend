import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, map } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskService } from '../../services/task.service';
import { StorageService } from '../../../../core/services/storage.service';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import {
  TaskEditDialogComponent,
  TaskEditDialogData,
} from '../../components/task-edit-dialog/task-edit-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  PaginationMetadata,
} from '../../../../core/models/task.model';
import { PAGINATION } from '../../../../core/constants/pagination.constants';

@Component({
  selector: 'app-task-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    TaskFormComponent,
    TaskCardComponent,
    PaginationComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly searchTerm = signal('');
  readonly currentPage = signal(1);
  readonly metadata = signal<PaginationMetadata | null>(null);

  readonly filteredTasks$ = combineLatest([
    this.taskService.tasks$,
    toObservable(this.searchTerm),
  ]).pipe(
    map(([tasks, term]) => {
      const normalized = term.trim().toLowerCase();
      if (!normalized) return tasks;
      return tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(normalized) ||
          t.description.toLowerCase().includes(normalized),
      );
    }),
  );

  ngOnInit(): void {
    this.loadPage(1);
  }

  private loadPage(page: number): void {
    this.loading.set(true);
    this.taskService.loadTasks(page, PAGINATION.DEFAULT_LIMIT).subscribe({
      next: (res) => {
        this.currentPage.set(res.metadata.page);
        this.metadata.set(res.metadata);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Failed to load tasks.', 'Close', { duration: 4000 });
      },
    });
  }

  onPageChange(page: number): void {
    this.searchTerm.set('');
    this.loadPage(page);
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onAddTask(payload: Omit<CreateTaskPayload, 'userId'>, formRef: TaskFormComponent): void {
    const userId = this.storageService.getUserId()!;
    formRef.setLoading(true);

    this.taskService.createTask({ ...payload, userId }).subscribe({
      next: () => {
        formRef.reset();
        formRef.setLoading(false);
        this.snackBar.open('Task added!', undefined, { duration: 2000 });
        this.loadPage(1);
      },
      error: () => {
        formRef.setLoading(false);
        this.snackBar.open('Failed to add task.', 'Close', { duration: 4000 });
      },
    });
  }

  onToggleComplete(task: Task): void {
    this.taskService.updateTask(task.id, { completed: !task.completed }).subscribe({
      error: () => this.snackBar.open('Failed to update task.', 'Close', { duration: 4000 }),
    });
  }

  onEditTask(task: Task): void {
    const data: TaskEditDialogData = { task };
    const ref = this.dialog.open(TaskEditDialogComponent, { data, width: '480px' });

    ref.afterClosed().subscribe((payload: UpdateTaskPayload | undefined) => {
      if (!payload) return;
      this.taskService.updateTask(task.id, payload).subscribe({
        next: () => this.snackBar.open('Task updated!', undefined, { duration: 2000 }),
        error: () => this.snackBar.open('Failed to update task.', 'Close', { duration: 4000 }),
      });
    });
  }

  onDeleteTask(task: Task): void {
    const data: ConfirmDialogData = {
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"?`,
      confirmLabel: 'Delete',
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { data, width: '380px' });

    ref.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (!confirmed) return;
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.snackBar.open('Task deleted.', undefined, { duration: 2000 });
          this.loadPage(this.currentPage());
        },
        error: () => this.snackBar.open('Failed to delete task.', 'Close', { duration: 4000 }),
      });
    });
  }

  onLogout(): void {
    this.storageService.clear();
    this.router.navigate(['/auth']);
  }
}
