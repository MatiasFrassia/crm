import { Component } from '@angular/core';
import { LoginService } from '../../services/login-service';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  public isAdmin$: any;
  

  constructor(private loginService: LoginService, public router: Router) {}

  ngOnInit() {
   this.isAdmin$ = this.loginService.isAdmin$;
  }
  
 
  logout() {
    this.loginService.logout();
  }
}
