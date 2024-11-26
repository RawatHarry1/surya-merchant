import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSubCategoryDialogComponent } from './sub-sub-category-dialog.component';

describe('SubSubCategoryDialogComponent', () => {
  let component: SubSubCategoryDialogComponent;
  let fixture: ComponentFixture<SubSubCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubSubCategoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubSubCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
