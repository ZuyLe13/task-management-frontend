import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'z-i18n',
  imports: [CommonModule],
  templateUrl: './z-i18n.component.html',
  styleUrl: './z-i18n.component.scss'
})
export class ZI18nComponent {
  @Input() key!: string;
  value: any;

  constructor(private translate: TranslateService) { }

  ngOnChanges() {
    this.value = this.translate.stream(this.key);
  }
}
