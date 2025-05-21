import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) {
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
    if (this.signUpForm.valid) {
      console.log('Form submitted:', this.signUpForm.value);
    }
  }

  onSignIn() {
    this.router.navigate(['/sign-in']);
  }
}
