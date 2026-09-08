import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientContactFormDialog } from './client-contact-form-dialog';

describe('ClientContactFormDialog', () => {
  let component: ClientContactFormDialog;
  let fixture: ComponentFixture<ClientContactFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientContactFormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientContactFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
