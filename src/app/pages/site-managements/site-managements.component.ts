import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/_components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from '../../shared/_components/side-bar/side-bar.component';

@Component({
  selector: 'app-site-managements',
  imports: [HeaderComponent, RouterOutlet, SideBarComponent],
  templateUrl: './site-managements.component.html',
  styleUrl: './site-managements.component.scss'
})
export class SiteManagementsComponent {

}
