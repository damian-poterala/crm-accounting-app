import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesView } from './files-view';

describe('FilesView', () => {
  let component: FilesView;
  let fixture: ComponentFixture<FilesView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesView],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
