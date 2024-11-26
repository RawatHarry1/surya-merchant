import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVarientDetailComponent } from './add-varient-detail.component';

describe('AddVarientDetailComponent', () => {
  let component: AddVarientDetailComponent;
  let fixture: ComponentFixture<AddVarientDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVarientDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVarientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
