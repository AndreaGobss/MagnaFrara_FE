import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SessionService } from './servizi/session.service';
import { User } from './modelli/user.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  loggedUser: User | null = null;

  constructor(private session: SessionService) {}

  ngOnInit(): void {
    // Ascoltiamo i cambiamenti di login/logout
    this.session.userChanged.subscribe(user => {
      this.loggedUser = user;
    });
  }
}