import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBasicClientDialog } from './edit-basic-client-dialog';

describe('EditBasicClientDialog', () => {
  let component: EditBasicClientDialog;
  let fixture: ComponentFixture<EditBasicClientDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBasicClientDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(EditBasicClientDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
