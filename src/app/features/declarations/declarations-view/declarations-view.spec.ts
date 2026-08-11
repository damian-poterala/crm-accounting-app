import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationsView } from './declarations-view';

describe('DeclarationsView', () => {
  let component: DeclarationsView;
  let fixture: ComponentFixture<DeclarationsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclarationsView],
    }).compileComponents();

    fixture = TestBed.createComponent(DeclarationsView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
