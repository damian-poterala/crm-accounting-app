import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCalculatorView } from './rate-calculator-view';

describe('RateCalculatorView', () => {
  let component: RateCalculatorView;
  let fixture: ComponentFixture<RateCalculatorView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateCalculatorView],
    }).compileComponents();

    fixture = TestBed.createComponent(RateCalculatorView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
