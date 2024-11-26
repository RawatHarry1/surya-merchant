import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAdminsDialogComponent } from './sub-admins-dialog.component';

describe('SubAdminsDialogComponent', () => {
  let component: SubAdminsDialogComponent;
  let fixture: ComponentFixture<SubAdminsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubAdminsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubAdminsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
