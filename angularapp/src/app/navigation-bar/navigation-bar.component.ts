import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {Event} from "../../interfaces/event"
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {map, Observable, startWith, Subscription} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {Router, RouterLink} from "@angular/router";
import {EventService} from "../../service/event.service";
import {AccountService} from "../../service/account.service";
import {User} from "../../interfaces/user";

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatToolbarModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, MatButtonModule, MatMenuModule, RouterLink],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css'
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  userProfileSubscription: Subscription;
  isSignedInSubscription: Subscription;
  eventsSubscription: Subscription;

  myControl = new FormControl<string | Event>('');
  events: Event[] = [];
  filteredOptions!: Observable<Event[]>;
  user?: User = undefined;
  signedIn: boolean = false;

  constructor(
    private eventService: EventService,
    private router: Router,
    private accountService: AccountService
  ) {
    this.isSignedInSubscription = this.accountService.signedIn$.subscribe({
      next: (bool) => {
        this.signedIn = bool;
      }
    })
    this.userProfileSubscription = this.accountService.userProfile$.subscribe({
      next: (user) => {
        this.user = user;
      }
    })
    this.eventsSubscription = this.eventService.events$.subscribe(
    (events: Event[]) => {
      // Handle the fetched events here
      this.events = events;
    });
  }


  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.title;
        return name ? this._filter(name as string) : this.events.slice();
      }),
    );
  }

  ngOnDestroy() {
    // Unsubscribe when the component is destroyed to prevent memory leaks
    this.userProfileSubscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
  }

  navigateToCreateEvent() {
    const url = '/events/create';
    this.router.navigate([url]);

  }

  navigateToDetails(event: Event) {
    const url = '/events/' + event.id;
    this.router.navigate([url]);
  }

  navigateToOverview() {
    const url = '/';
    this.router.navigate([url]);
  }

  displayFn(event: Event): string {
    return event && event.title ? event.title : '';
  }

  private _filter(name: string): Event[] {
    const filterValue = name.toLowerCase();

    return this.events.filter(option => option.title.toLowerCase().includes(filterValue));
  }
}
