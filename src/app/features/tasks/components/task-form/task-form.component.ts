import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CreateTaskPayload } from '../../../../core/models/task.model';
import { I18nService } from '../../../../core/services/i18n.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  @Output() taskSubmit = new EventEmitter<Omit<CreateTaskPayload, 'userId'>>();

  private readonly fb = inject(FormBuilder);
  readonly i18n = inject(I18nService).t;

  readonly loading = signal(false);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });

  setLoading(value: boolean): void {
    this.loading.set(value);
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;

    this.taskSubmit.emit({
      title: this.form.value.title!,
      description: this.form.value.description ?? '',
    });
  }

  reset(): void {
    this.form.reset();
  }
}
