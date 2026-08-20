import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBasicClientDialog } from './create-basic-client-dialog';

describe('CreateBasicClientDialog', () => {
  let component: CreateBasicClientDialog;
  let fixture: ComponentFixture<CreateBasicClientDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBasicClientDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBasicClientDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
