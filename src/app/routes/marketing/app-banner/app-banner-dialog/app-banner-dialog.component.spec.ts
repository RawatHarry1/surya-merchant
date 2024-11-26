import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppBannerDialogComponent } from './app-banner-dialog.component';

describe('AppBannerDialogComponent', () => {
  let component: AppBannerDialogComponent;
  let fixture: ComponentFixture<AppBannerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppBannerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppBannerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
