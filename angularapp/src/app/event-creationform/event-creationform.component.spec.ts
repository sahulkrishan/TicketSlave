import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCreationformComponent } from './event-creationform.component';

describe('EventCreationformComponent', () => {
  let component: EventCreationformComponent;
  let fixture: ComponentFixture<EventCreationformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCreationformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventCreationformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
