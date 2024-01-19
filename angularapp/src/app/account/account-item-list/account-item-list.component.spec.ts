import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountItemListComponent } from './account-item-list.component';

describe('AccountItemListComponent', () => {
  let component: AccountItemListComponent;
  let fixture: ComponentFixture<AccountItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountItemListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
