import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductImageDialogComponent } from './view-product-image-dialog.component';

describe('ViewProductImageDialogComponent', () => {
  let component: ViewProductImageDialogComponent;
  let fixture: ComponentFixture<ViewProductImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProductImageDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProductImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
