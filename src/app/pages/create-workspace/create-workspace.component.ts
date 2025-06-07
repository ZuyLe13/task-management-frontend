import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkspaceService } from '../../shared/_services/workspace.service';

@Component({
  selector: 'app-create-workspace',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-workspace.component.html',
  styleUrl: './create-workspace.component.scss'
})
export class CreateWorkspaceComponent {
  createWorkspaceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private workspaceService: WorkspaceService
  ) {
    this.createWorkspaceForm = fb.group({
      title: ['', [Validators.required]],
      desc: ['']
    });
  }

  onCreateWorkspace() {
    if (this.createWorkspaceForm.invalid) {
      this.createWorkspaceForm.markAllAsTouched();
      return;
    }

    const { title, desc } = this.createWorkspaceForm.value;
    console.log('📦 Sending:', { title, desc });

    this.workspaceService.createWorkspace({
      title: title,
      desc: desc
    }).subscribe({
      next: (res) => {
        console.log('✅ Workspace created:', res);
        // this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.log('❌ Error:', err);
      }
    })
  }
}
