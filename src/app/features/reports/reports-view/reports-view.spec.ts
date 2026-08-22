import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsView } from './reports-view';

describe('ReportsView', () => {
  let component: ReportsView;
  let fixture: ComponentFixture<ReportsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsView],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
