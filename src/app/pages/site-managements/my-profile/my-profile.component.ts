import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ZI18nComponent } from "../../../shared/_components/z-i18n/z-i18n.component";
import { InputComponent } from "../../../shared/_components/input/input.component";
import { ErrorComponent } from "../../../shared/_components/error/error.component";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../shared/_services/user.service';
import { User } from '../../../shared/interfaces/user.model';

@Component({
  selector: 'app-my-profile',
  imports: [
    ZI18nComponent,
    InputComponent,
    ErrorComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit {
  form!: FormGroup;
  user!: User;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private cdr: ChangeDetectorRef
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
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data;

        // Gán dữ liệu vào form
        this.form.patchValue({
          fullName: this.user.fullName || '',
          email: this.user.email || '',
          firstName: this.user.firstName || '',
          lastName: this.user.lastName || '',
          phone: this.user.phone || '',
          role: this.user.role || ''
        });
      },
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      // xử lý submit
    } else {
      this.form.markAllAsTouched();
    }
  }
}
