import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/_components/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-site-managements',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './site-managements.component.html',
  styleUrl: './site-managements.component.scss'
})
export class SiteManagementsComponent {

}
