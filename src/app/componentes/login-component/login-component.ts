import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login-service';

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
  loadingGoogle = false; // 👈 Nuevo estado de carga

  private loginService = inject(LoginService);
  private toastr = inject(ToastrService);

  logIn(): void {
    if (!this.email?.trim() || !this.password?.trim()) {
      this.toastr.warning('Por favor complete todos los campos requeridos', 'Campos vacíos');
      return;
    }

    this.loading = true;

    this.loginService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // 🟢 NUEVO: Dispara el popup de Google
  loginGoogle(): void {
    this.loadingGoogle = true;
    this.loginService.loginConGoogle();
    
    // Quitamos el loading después de unos segundos en caso de que cierre el popup
    setTimeout(() => this.loadingGoogle = false, 3000); 
  }
}
