import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/_services/auth.service';

@Component({
  standalone: true,
  selector: 'app-sign-up',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signUpForm: FormGroup;
  isShowPassword = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService,
  ) {
    this.signUpForm = fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  showPassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  onSubmit() {
    if (this.signUpForm.invalid) return;
    
    this.authService.signUp(this.signUpForm.value).subscribe({
      next: (res) => {
        console.log('Sign up successful:', res);
        // this.router.navigate(['/sign-in']);
      },
      error: (err) => {
        console.error('Sign up failed:', err);
      }
    });
  }

  onSignIn() {
    this.router.navigate(['/sign-in']);
  }
}
