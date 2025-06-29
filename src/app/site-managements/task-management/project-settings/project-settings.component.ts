import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { TaskStatusComponent } from "./task-status/task-status.component";
import { ProjectSettingComponent } from "./project-setting/project-setting.component";
import { ActivatedRoute, Router } from '@angular/router';
import { projectSettingsTabs } from '../../../shared/constants/tabs.constants';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export interface ExampleTab {
  label: string;
  content: string;
}

@Component({
  selector: 'app-project-settings',
  imports: [
    MatTabsModule, 
    CommonModule, 
    TaskStatusComponent, 
    ProjectSettingComponent,
    TranslateModule
  ],
  templateUrl: './project-settings.component.html',
  styleUrl: './project-settings.component.scss'
})
export class ProjectSettingsComponent implements OnInit {
  selectedTabIndex = 0;
  tabRoutes = projectSettingsTabs.map(tab => ({
    key: tab.key,
    label: tab.label
  }));

  constructor(
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab && this.tabRoutes.some(route => route.key === tab)) {
        this.selectedTabIndex = this.tabRoutes.findIndex(route => route.key === tab);
      } else {
        this.selectedTabIndex = 0;
        this.navigate(this.selectedTabIndex);
      }
    });
  }

  onTabChange(index: number): void {
    this.navigate(index);
  }

  navigate(index: number): void {
    const tabName = this.tabRoutes[index];
    this.router.navigate([], {
      queryParams: { tab: tabName.key },
      queryParamsHandling: 'merge',
      relativeTo: this.route
    });
  }
}
