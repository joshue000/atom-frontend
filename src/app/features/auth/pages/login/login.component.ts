import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { I18nService } from '../../../../core/services/i18n.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../../../core/services/storage.service';
import {
  CreateUserDialogComponent,
  CreateUserDialogData,
} from '../../components/create-user-dialog/create-user-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  readonly i18n = inject(I18nService).t;

  readonly loading = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;

    const email = this.form.value.email!;
    this.loading.set(true);

    this.authService.findByEmail(email).subscribe({
      next: (user) => {
        this.storageService.setUserId(user.id);
        this.storageService.setUserEmail(user.email);
        this.loading.set(false);
        this.router.navigate(['/tasks']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        if (err.status === 404) {
          this.openCreateUserDialog(email);
        } else {
          this.snackBar.open(
            this.i18n().auth.errors.somethingWentWrong,
            this.i18n().auth.errors.close,
            {
              duration: 4000,
            },
          );
        }
      },
    });
  }

  private openCreateUserDialog(email: string): void {
    const data: CreateUserDialogData = { email };
    const ref = this.dialog.open(CreateUserDialogComponent, {
      data,
      width: '400px',
      disableClose: true,
    });

    ref.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (!confirmed) return;
      this.createUser(email);
    });
  }

  private createUser(email: string): void {
    this.loading.set(true);
    this.authService.createUser({ email }).subscribe({
      next: (user) => {
        this.storageService.setUserId(user.id);
        this.storageService.setUserEmail(user.email);
        this.loading.set(false);
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open(this.i18n().auth.errors.failedToCreate, this.i18n().auth.errors.close, {
          duration: 4000,
        });
      },
    });
  }
}
