import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueDialogComponent } from './catalogue-dialog.component';

describe('CatalogueDialogComponent', () => {
  let component: CatalogueDialogComponent;
  let fixture: ComponentFixture<CatalogueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogueDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
