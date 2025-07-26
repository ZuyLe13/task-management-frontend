import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskUpsertComponent } from './task-upsert.component';

describe('TaskUpsertComponent', () => {
  let component: TaskUpsertComponent;
  let fixture: ComponentFixture<TaskUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskUpsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
