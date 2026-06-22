import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Navbar } from "./componentes/navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('crm');
}
