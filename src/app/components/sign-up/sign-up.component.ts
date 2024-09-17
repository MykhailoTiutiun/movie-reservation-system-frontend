import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  register(): void {
    if (this.password == this.confirmPassword) {
      this.authService.register(this.email, this.password).subscribe(
        () => this.router.navigate(['/check-email']),
        error => console.error('Sign up error: ', error)
      );
    }
  }
}
