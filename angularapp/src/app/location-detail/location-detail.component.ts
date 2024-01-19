import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LocationsService} from "../../service/locations.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "../../interfaces/location";

@Component({
  selector: 'app-location-detail',
  standalone: true,
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './location-detail.component.html',
  styleUrl: './location-detail.component.scss'
})
export class LocationDetailComponent implements OnInit{
  locationForm!: FormGroup;

  location: Location = {
    id : "",
    address: "",
    city: "",
    country: "",
    emailAddress: "",
    name: "",
    phoneNumber: "",
    postalCode: "",
    website: "",
    zones: []
  }

  oldLocation: Location = {
    id : "",
    address: "",
    city: "",
    country: "",
    emailAddress: "",
    name: "",
    phoneNumber: "",
    postalCode: "",
    website: "",
    zones: []
  }


  isDisabled = true;
  submitBtnIsVisibile = false;
  readyToSubmit = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private locationService: LocationsService, private route: ActivatedRoute) {
    this.locationForm = this.formBuilder.group({
      name: [this.location.name, Validators.required],
      address: [this.location.address, Validators.required],
      city: [this.location.city, Validators.required],
      postalCode: [
        this.location.postalCode,
        [
          Validators.required,
          Validators.pattern(/^\d{4}\s?[a-zA-Z]{2}$/)
        ]
      ],
      country: [ this.location.country , Validators.required],
      website: [this.location.website],
      phoneNumber: [
        this.location.phoneNumber,
        [
          Validators.required,
          Validators.pattern(/^\d{10,12}$/)
        ]
      ],
      emailAddress: [
        this.location.emailAddress,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]
      ]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if(id){
        this.locationService.getLocationById(id).subscribe(result => {
          this.location = result;
          this.locationForm = this.formBuilder.group({
            id: [{ value: this.location.id, disabled: this.isDisabled }, [Validators.required, Validators.pattern(/^\d{4}\s?[a-zA-Z]{2}$/)]],
            name: [{ value: this.location.name, disabled: this.isDisabled }, Validators.required],
            address: [{ value: this.location.address, disabled: this.isDisabled }, Validators.required],
            city: [{ value: this.location.city, disabled: this.isDisabled }, Validators.required],
            postalCode: [{ value: this.location.postalCode, disabled: this.isDisabled }, [Validators.required, Validators.pattern(/^\d{4}\s?[a-zA-Z]{2}$/)]],
            country: [{ value: this.location.country, disabled: this.isDisabled }, Validators.required],
            website: [{ value: this.location.website, disabled: this.isDisabled }],
            phoneNumber: [{ value: this.location.phoneNumber, disabled: this.isDisabled }, [Validators.required ,Validators.pattern(/^\d{10,12}$/)]],
            emailAddress: [{ value: this.location.emailAddress, disabled: this.isDisabled }, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
          });
        });
      }
    });

  }

  toggleEditMode() {
    this.isDisabled = !this.isDisabled;
    if (this.isDisabled) {
      this.location = this.oldLocation;
      this.locationForm.disable();
      this.submitBtnIsVisibile = false;
    } else {
      this.oldLocation = this.location;
      this.locationForm.enable();
      this.submitBtnIsVisibile = true;
    }
  }

  onSubmit() {
    if(this.locationForm.valid) {
      this.readyToSubmit = true;
      const newLocation: Location = this.locationForm.value as Location;
      this.locationService.updateLocation(newLocation).subscribe((result: Location) => {
        console.log("Het gewijzigde locatie: ", result);

      });
      this.locationForm.disable()
      this.submitBtnIsVisibile = false;
      this.isDisabled = true;
    }
  }
}
