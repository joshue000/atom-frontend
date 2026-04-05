import { Injectable, computed, signal } from '@angular/core';
import en from '../../../assets/i18n/en.json';
import es from '../../../assets/i18n/es.json';

export type Lang = 'en' | 'es';
export type Translations = typeof en;

const TRANSLATIONS: Record<Lang, Translations> = { en, es };
const STORAGE_KEY = 'atom-lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly currentLang = signal<Lang>('en');
  readonly t = computed(() => TRANSLATIONS[this.currentLang()]);

  init(): void {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && stored in TRANSLATIONS) {
      this.currentLang.set(stored);
    }
  }

  setLang(lang: Lang): void {
    this.currentLang.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }

  interpolate(template: string, params: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => params[key] ?? '');
  }
}
