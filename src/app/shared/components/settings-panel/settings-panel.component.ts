import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService, Lang } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatDividerModule,
  ],
  templateUrl: './settings-panel.component.html',
  styleUrl: './settings-panel.component.scss',
})
export class SettingsPanelComponent {
  readonly themeService = inject(ThemeService);
  readonly i18nService = inject(I18nService);
  readonly i18n = this.i18nService.t;
  readonly open = signal(false);

  toggle(): void {
    this.open.update((v) => !v);
  }

  setLang(lang: Lang): void {
    this.i18nService.setLang(lang);
  }

  @HostListener('document:keydown.escape')
  close(): void {
    this.open.set(false);
  }
}
