import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkspaceService } from '../../shared/_services/projects/workspace.service';

@Component({
  selector: 'app-create-workspace',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-workspace.component.html',
  styleUrl: './create-workspace.component.scss'
})
export class CreateWorkspaceComponent {
  createWorkspaceForm: FormGroup;
  selectedFile!: File;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private workspaceService: WorkspaceService
  ) {
    this.createWorkspaceForm = fb.group({
      title: ['', [Validators.required]],
      desc: [''],
      imageUrl: [null]
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onCreateWorkspace() {
    if (this.createWorkspaceForm.invalid) {
      this.createWorkspaceForm.markAllAsTouched();
      return;
    }

    // if (!this.selectedFile) {
    //   console.log('Please select an image file');
    //   return;
    // }

    const { title, desc } = this.createWorkspaceForm.value;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('desc', desc);
    formData.append('image', this.selectedFile);

    this.workspaceService.createWorkspace(formData).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.log('❌ Error:', err);
      }
    });
  }
}
