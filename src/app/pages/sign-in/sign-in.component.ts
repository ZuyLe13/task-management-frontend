import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/_services/auth.service';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  isSignIn: boolean = true;
  signInForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {
    this.signInForm = fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSignIn() {
    if (this.signInForm.invalid) return;

    this.authService.signIn(this.signInForm.value).subscribe({
      next: (res) => {
        console.log('Sign in successful:', res);
      },
      error: (err) => {
        console.error('Sign in failed:', err);
      }
    });
  }

  onSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
