import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsImport } from './clients-import';

describe('ClientsImport', () => {
  let component: ClientsImport;
  let fixture: ComponentFixture<ClientsImport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsImport],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsImport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
