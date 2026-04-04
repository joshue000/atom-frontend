import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface CreateUserDialogData {
  email: string;
}

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>New Account</h2>
    <mat-dialog-content>
      <p>
        No account found for <strong>{{ data.email }}</strong
        >.
      </p>
      <p>Would you like to create a new account?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close aria-label="Cancel">Cancel</button>
      <button mat-flat-button color="primary" [mat-dialog-close]="true" aria-label="Create account">
        Create Account
      </button>
    </mat-dialog-actions>
  `,
})
export class CreateUserDialogComponent {
  constructor(
    public readonly dialogRef: MatDialogRef<CreateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: CreateUserDialogData,
  ) {}
}
