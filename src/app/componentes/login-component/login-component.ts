import { Component } from '@angular/core';
import { LoginService } from '../../services/login-service';
import { FormsModule } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login-component',
  imports: [FormsModule, AsyncPipe],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  email!: string;
  password!: string;
  error$!: Observable<boolean>;
  router: any;

  constructor(private loginService: LoginService) {}

ngOnInit() {
  this.error$ = this.loginService.getError();
}


  login() {
    this.loginService.login(this.email, this.password);

   
  }
}
