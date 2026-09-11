import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFileFormDialog } from './client-file-form-dialog';

describe('ClientFileFormDialog', () => {
  let component: ClientFileFormDialog;
  let fixture: ComponentFixture<ClientFileFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientFileFormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientFileFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
