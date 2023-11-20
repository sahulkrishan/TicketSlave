import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCarouselComponent } from './event-carousel.component';

describe('EventCarouselComponent', () => {
  let component: EventCarouselComponent;
  let fixture: ComponentFixture<EventCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventCarouselComponent]
    });
    fixture = TestBed.createComponent(EventCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
