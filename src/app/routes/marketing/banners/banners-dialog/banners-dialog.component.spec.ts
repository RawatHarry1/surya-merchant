import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannersDialogComponent } from './banners-dialog.component';

describe('BannersDialogComponent', () => {
  let component: BannersDialogComponent;
  let fixture: ComponentFixture<BannersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannersDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
