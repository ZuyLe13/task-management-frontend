import { Routes } from '@angular/router';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { SiteManagementsComponent } from './pages/site-managements/site-managements.component';
import { DashboardComponent } from './pages/site-managements/dashboard/dashboard.component';
import { AuthGuard } from './shared/_guard/auth.guard';
import { CreateWorkspaceComponent } from './pages/create-workspace/create-workspace.component';
import { ProtectedGuard } from './shared/_guard/protected.guard';
import { TaskListComponent } from './pages/site-managements/task-list/task-list.component';
import { MyProfileComponent } from './pages/site-managements/my-profile/my-profile.component';
import { TimelineComponent } from './pages/site-managements/timeline/timeline.component';
import { MessagesComponent } from './pages/site-managements/messages/messages.component';
import { UploadFilesComponent } from './pages/site-managements/upload-files/upload-files.component';

export const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create-workspace',
    component: CreateWorkspaceComponent,
    canActivate: [ProtectedGuard]
  },
  {
    path: '',
    component: SiteManagementsComponent,
    canActivate: [ProtectedGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'task-list',
        component: TaskListComponent
      },
      {
        path: 'profile',
        component: MyProfileComponent
      },
      {
        path: 'timeline',
        component: TimelineComponent
      },
      {
        path: 'messages',
        component: MessagesComponent
      },
      {
        path: 'documents',
        component: UploadFilesComponent
      }
    ]
  },
  {
    path: '**',
    component: ErrorPageComponent
  }
];
