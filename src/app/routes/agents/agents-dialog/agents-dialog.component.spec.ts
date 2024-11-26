import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsDialogComponent } from './agents-dialog.component';

describe('AgentsDialogComponent', () => {
  let component: AgentsDialogComponent;
  let fixture: ComponentFixture<AgentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
