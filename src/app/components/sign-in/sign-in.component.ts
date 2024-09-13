import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      () => this.router.navigate([this.route.snapshot.queryParams['redirectUrl'] || '/']),
      error => console.error('Login error: ', error)
    );
  }
}
