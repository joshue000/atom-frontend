import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { I18nService } from '../../../core/services/i18n.service';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close [attr.aria-label]="i18n().common.cancel">
        {{ i18n().common.cancel }}
      </button>
      <button
        mat-flat-button
        color="warn"
        [mat-dialog-close]="true"
        [attr.aria-label]="data.confirmLabel ?? i18n().common.confirm"
      >
        {{ data.confirmLabel ?? i18n().common.confirm }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  readonly i18n = inject(I18nService).t;

  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: ConfirmDialogData) {}
}
