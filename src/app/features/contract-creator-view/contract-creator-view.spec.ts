import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractCreatorView } from './contract-creator-view';

describe('ContractCreatorView', () => {
  let component: ContractCreatorView;
  let fixture: ComponentFixture<ContractCreatorView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractCreatorView],
    }).compileComponents();

    fixture = TestBed.createComponent(ContractCreatorView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
