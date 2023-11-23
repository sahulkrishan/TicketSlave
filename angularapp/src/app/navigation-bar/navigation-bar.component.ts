import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {EventsOverviewService} from "../events-overview.service";
import {Event} from "../interfaces/event"
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatToolbarModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, MatButtonModule, MatMenuModule],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css'
})
export class NavigationBarComponent implements OnInit {

  myControl = new FormControl<string | Event>('');
  options: Event[] = [];
  filteredOptions!: Observable<Event[]>;

  constructor(private eventsOverviewService : EventsOverviewService, private router : Router){}

  ngOnInit() {
    this.getEvents();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.title;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getEvents(){
    this.eventsOverviewService.getEvents().subscribe(
      (events: Event[]) => {
        // Handle the fetched events here
        this.options = events;
      })

  }

  navigateToDetails(event: Event){
    const url    = '/details/' + event.id;
    this.router.navigate([url]);

  }

  displayFn(event: Event): string {
    return event && event.title ? event.title : '';
  }

  private _filter(name: string): Event[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.title.toLowerCase().includes(filterValue));
  }
}
