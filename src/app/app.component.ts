import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { I18nService } from './core/services/i18n.service';
import { SettingsPanelComponent } from './shared/components/settings-panel/settings-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SettingsPanelComponent],
  template: `
    <router-outlet></router-outlet>
    <app-settings-panel></app-settings-panel>
  `,
})
export class AppComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly i18nService = inject(I18nService);

  ngOnInit(): void {
    this.themeService.init();
    this.i18nService.init();
  }
}
