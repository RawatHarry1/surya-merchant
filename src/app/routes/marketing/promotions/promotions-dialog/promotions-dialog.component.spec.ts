import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionsDialogComponent } from './promotions-dialog.component';

describe('PromotionsDialogComponent', () => {
  let component: PromotionsDialogComponent;
  let fixture: ComponentFixture<PromotionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
