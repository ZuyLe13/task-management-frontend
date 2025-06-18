import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZI18nComponent } from './z-i18n.component';

describe('ZI18nComponent', () => {
  let component: ZI18nComponent;
  let fixture: ComponentFixture<ZI18nComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZI18nComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZI18nComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
