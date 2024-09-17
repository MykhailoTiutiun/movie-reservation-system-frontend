import {Component} from '@angular/core';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {MovieListComponent} from "./components/movie-list/movie-list.component";
import {AuthService} from "./services/auth.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MovieListComponent, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'movie-reservation-system-frontend';

  constructor(private router: Router, protected authService: AuthService) {
  }

  getReturnUrl(): string {
    return this.router.url;
  }
}
