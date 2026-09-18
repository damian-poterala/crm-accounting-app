import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsView } from './task-details-view';

describe('TaskDetailsView', () => {
  let component: TaskDetailsView;
  let fixture: ComponentFixture<TaskDetailsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailsView],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailsView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
