import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationsTable } from './declarations-table';

describe('DeclarationsTable', () => {
  let component: DeclarationsTable;
  let fixture: ComponentFixture<DeclarationsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclarationsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(DeclarationsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
