import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingDialogComponent } from './billing-dialog.component';

describe('BillingDialogComponent', () => {
  let component: BillingDialogComponent;
  let fixture: ComponentFixture<BillingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
