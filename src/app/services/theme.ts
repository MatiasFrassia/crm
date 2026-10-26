import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDarkMode = false;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.cargarTemaGuardado();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      this.document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }

  get isDark(): boolean {
    return this.isDarkMode;
  }

  private cargarTemaGuardado(): void {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.isDarkMode = true;
        this.document.body.classList.add('dark-mode');
      }
    }
  }
}