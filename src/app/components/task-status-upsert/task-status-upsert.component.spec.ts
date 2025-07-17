import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskStatusUpsertComponent } from './task-status-upsert.component';

describe('TaskStatusUpsertComponent', () => {
  let component: TaskStatusUpsertComponent;
  let fixture: ComponentFixture<TaskStatusUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskStatusUpsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskStatusUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
