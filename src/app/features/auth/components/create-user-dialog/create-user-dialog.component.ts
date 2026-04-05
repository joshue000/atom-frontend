import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '../../../../core/services/i18n.service';

export interface CreateUserDialogData {
  email: string;
}

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ i18n().auth.createUserDialog.title }}</h2>
    <mat-dialog-content>
      <p>
        {{ i18n().auth.createUserDialog.noAccountFound }}
        <strong>{{ data.email }}</strong
        >.
      </p>
      <p>{{ i18n().auth.createUserDialog.createQuestion }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close [attr.aria-label]="i18n().auth.createUserDialog.cancel">
        {{ i18n().auth.createUserDialog.cancel }}
      </button>
      <button
        mat-flat-button
        color="primary"
        [mat-dialog-close]="true"
        [attr.aria-label]="i18n().auth.createUserDialog.createAccount"
      >
        {{ i18n().auth.createUserDialog.createAccount }}
      </button>
    </mat-dialog-actions>
  `,
})
export class CreateUserDialogComponent {
  readonly i18n = inject(I18nService).t;

  constructor(
    public readonly dialogRef: MatDialogRef<CreateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: CreateUserDialogData,
  ) {}
}
