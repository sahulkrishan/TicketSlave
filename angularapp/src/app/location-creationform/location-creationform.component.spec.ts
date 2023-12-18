import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationCreationformComponent } from './location-creationform.component';

describe('LocationCreationformComponent', () => {
  let component: LocationCreationformComponent;
  let fixture: ComponentFixture<LocationCreationformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationCreationformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationCreationformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
