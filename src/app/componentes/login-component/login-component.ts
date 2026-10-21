import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login-service'; // 👈 Importamos LoginService

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  private loginService = inject(LoginService); // 👈 Inyectamos LoginService
  private toastr = inject(ToastrService);

  logIn(): void {
    if (!this.email?.trim() || !this.password?.trim()) {
      this.toastr.warning('Por favor complete todos los campos requeridos', 'Campos vacíos');
      return;
    }

    this.loading = true;

    // 🟢 Invocamos LoginService para que ejecute todo el flujo de sesión reactivo
    this.loginService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
