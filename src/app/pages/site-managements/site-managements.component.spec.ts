import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteManagementsComponent } from './site-managements.component';

describe('SiteManagementsComponent', () => {
  let component: SiteManagementsComponent;
  let fixture: ComponentFixture<SiteManagementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteManagementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
