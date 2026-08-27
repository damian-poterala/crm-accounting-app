import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDetailsFormDialog } from './client-details-form-dialog';

describe('ClientDetailsFormDialog', () => {
  let component: ClientDetailsFormDialog;
  let fixture: ComponentFixture<ClientDetailsFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDetailsFormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientDetailsFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
