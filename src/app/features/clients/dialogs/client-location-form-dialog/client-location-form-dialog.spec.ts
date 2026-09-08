import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLocationFormDialog } from './client-location-form-dialog';

describe('ClientLocationFormDialog', () => {
  let component: ClientLocationFormDialog;
  let fixture: ComponentFixture<ClientLocationFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientLocationFormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientLocationFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
