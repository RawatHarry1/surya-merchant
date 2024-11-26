import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAdminsPermissionComponent } from './sub-admins-permission.component';

describe('SubAdminsPermissionComponent', () => {
  let component: SubAdminsPermissionComponent;
  let fixture: ComponentFixture<SubAdminsPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubAdminsPermissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubAdminsPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
