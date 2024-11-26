import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushCampaignsComponent } from './push-campaigns.component';

describe('PushCampaignsComponent', () => {
  let component: PushCampaignsComponent;
  let fixture: ComponentFixture<PushCampaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PushCampaignsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PushCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
