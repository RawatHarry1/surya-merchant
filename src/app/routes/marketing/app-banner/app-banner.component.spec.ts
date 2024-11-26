import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppBannerComponent } from './app-banner.component';

describe('AppBannerComponent', () => {
  let component: AppBannerComponent;
  let fixture: ComponentFixture<AppBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
