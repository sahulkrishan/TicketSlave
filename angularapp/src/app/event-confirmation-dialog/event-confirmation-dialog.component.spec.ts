import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventConfirmationDialogComponent } from './event-confirmation-dialog.component';

describe('EventConfirmationDialogComponent', () => {
  let component: EventConfirmationDialogComponent;
  let fixture: ComponentFixture<EventConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventConfirmationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
