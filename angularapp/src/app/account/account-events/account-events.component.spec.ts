import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEventsComponent } from './account-events.component';

describe('AccountEventsComponent', () => {
  let component: AccountEventsComponent;
  let fixture: ComponentFixture<AccountEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountEventsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
