import { Component } from '@angular/core';
import { ZI18nComponent } from "../../../shared/_components/z-i18n/z-i18n.component";
import { InputComponent } from "../../../shared/_components/input/input.component";

@Component({
  selector: 'app-my-profile',
  imports: [ZI18nComponent, InputComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent {

}
