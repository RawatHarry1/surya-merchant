import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntigrationDialogComponent } from './intigration-dialog.component';

describe('IntigrationDialogComponent', () => {
  let component: IntigrationDialogComponent;
  let fixture: ComponentFixture<IntigrationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntigrationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntigrationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
