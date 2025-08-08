import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityUpsertComponent } from './priority-upsert.component';

describe('PriorityUpsertComponent', () => {
  let component: PriorityUpsertComponent;
  let fixture: ComponentFixture<PriorityUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityUpsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorityUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
