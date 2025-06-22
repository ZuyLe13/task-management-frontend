import { Component, OnInit } from '@angular/core';
import { ZI18nComponent } from "../../../shared/_components/z-i18n/z-i18n.component";
import { InputComponent } from "../../../shared/_components/input/input.component";
import { ErrorComponent } from "../../../shared/_components/error/error.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../shared/_services/user.service';
import { User } from '../../../shared/interfaces/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-profile',
  imports: [
    ZI18nComponent,
    InputComponent,
    ErrorComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit {
  form!: FormGroup;
  user!: User;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      phone: [''],
      role: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.form.patchValue(user);
      },
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.userService.updateProfile(this.form.getRawValue()).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.form.patchValue(updatedUser);
        alert('Profile updated successfully!');
        this.isSubmitting = false;
      },
       error: (err) => {
        console.error(err);
        alert('Failed to update profile.');
        this.isSubmitting = false;
      }
    })
  }
}
