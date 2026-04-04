import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Task, UpdateTaskPayload } from '../../../../core/models/task.model';

export interface TaskEditDialogData {
  task: Task;
}

@Component({
  selector: 'app-task-edit-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './task-edit-dialog.component.html',
})
export class TaskEditDialogComponent {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    title: [this.data.task.title, [Validators.required, Validators.maxLength(100)]],
    description: [this.data.task.description, [Validators.maxLength(500)]],
  });

  constructor(
    public readonly dialogRef: MatDialogRef<TaskEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: TaskEditDialogData,
  ) {}

  onSave(): void {
    if (this.form.invalid) return;

    const payload: UpdateTaskPayload = {
      title: this.form.value.title!,
      description: this.form.value.description ?? '',
    };
    this.dialogRef.close(payload);
  }
}
