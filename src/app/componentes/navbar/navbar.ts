import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login-service';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private loginService = inject(LoginService);
  public router = inject(Router);
  public themeService = inject(ThemeService);

  // Enlazamos directamente con los Observables del LoginService
  public isAdmin$: Observable<boolean> = this.loginService.isAdmin$;
  public isCliente$: Observable<boolean> = this.loginService.isCliente$; // 👈 Agregamos el observador de clientes

  ngOnInit(): void {
    // Verifica si hay una sesión guardada en localStorage al F5 / recarga
    this.loginService.checkAuth();
  }

  logout(): void {
    this.loginService.logout();
  }
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
