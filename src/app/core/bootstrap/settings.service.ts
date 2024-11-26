import { MediaMatcher } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AppDirectionality, LocalStorageService } from '@shared';
import { AppSettings, AppTheme, defaults, defaults2 } from '../settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly key = 'ng-matero-settings';

  private readonly store = inject(LocalStorageService);
  private readonly mediaMatcher = inject(MediaMatcher);
  private readonly document = inject(DOCUMENT);
  private readonly dir = inject(AppDirectionality);

  private readonly notify$ = new BehaviorSubject<Partial<AppSettings>>({});

  get notify() {
    return this.notify$.asObservable();
  }

  private htmlElement!: HTMLHtmlElement;

  options: AppSettings = defaults;

  themeColor: Exclude<AppTheme, 'auto'> = 'light';

  constructor() {
    // Initialization is deferred to `initializeSettings` method
    this.htmlElement = this.document.querySelector('html')!;
  }

  initializeSettings() {
    const platformId = localStorage.getItem("platformId");
    const storedOptions = this.store.get(this.key);

    // Load settings based on platform ID and available stored settings
    if (platformId === "6236f5ded1c52f5a383a03e3") {
      this.options = Object.assign({}, defaults2, storedOptions);
    } else if (platformId === "6236e5e35ab0c45d83958f92") {
      this.options = Object.assign({}, defaults, storedOptions);
    } else {
      // Fallback to default settings if platform ID is unknown
      this.options = Object.assign({}, defaults, storedOptions);
    }
    this.themeColor = this.getThemeColor();

    this.setTheme();
  }


  reset() {
    this.store.remove(this.key);
  }

  getThemeColor() {
    if (
      this.options.theme === 'auto' &&
      this.mediaMatcher.matchMedia('(prefers-color-scheme)').media !== 'not all'
    ) {
      const isSystemDark = this.mediaMatcher.matchMedia('(prefers-color-scheme: dark)').matches;
      return isSystemDark ? 'dark' : 'light';
    } else {
      return this.options.theme as Exclude<AppTheme, 'auto'>;
    }
  }

  setOptions(options: AppSettings) {
    this.options = Object.assign(defaults, options);
    this.store.set(this.key, this.options);
    this.notify$.next(this.options);
  }

  setLanguage(lang: string) {
    this.options.language = lang;
    this.store.set(this.key, this.options);
    this.notify$.next(this.options);
  }

  setDirection() {
    this.dir.value = this.options.dir;
    this.htmlElement.dir = this.dir.value;
  }

  setTheme() {
    const platformId = localStorage.getItem("platformId");
    this.themeColor = this.getThemeColor();

    if (platformId === "6236f5ded1c52f5a383a03e3") {
      this.htmlElement.classList.add('theme-dark');
    } else {
      this.htmlElement.classList.remove('theme-dark');
    }
  }
}
