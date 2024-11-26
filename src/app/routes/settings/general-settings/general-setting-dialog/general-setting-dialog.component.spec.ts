import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralSettingDialogComponent } from './general-setting-dialog.component';

describe('GeneralSettingDialogComponent', () => {
  let component: GeneralSettingDialogComponent;
  let fixture: ComponentFixture<GeneralSettingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralSettingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralSettingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
